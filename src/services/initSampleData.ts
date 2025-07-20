import { supabase } from '../lib/supabase';
import type {
  ShareClass,
  ShareTransaction,
  Stakeholder,
  FundingRound,
  EquityGrant,
  ComplianceRecord
} from '../types/database';

const handleSupabaseError = (error: any, operation: string) => {
  console.error(`Error in ${operation}:`, error);
  throw new Error(`Database error: ${error.message || 'Unknown error'}`);
};

export async function initializeSampleData(companyId: string) {
  try {
    console.log(`Initializing sample data for company ${companyId}...`);

    // Clear existing data
    console.log('Clearing existing data...');
    await supabase.from('compliance_records').delete().eq('company', companyId);
    await supabase.from('equity_grants').delete().eq('company', companyId);
    await supabase.from('share_transactions').delete().eq('company', companyId);
    await supabase.from('stakeholders').delete().eq('company', companyId);
    await supabase.from('share_classes').delete().eq('company', companyId);
    await supabase.from('funding_rounds').delete().eq('company', companyId);

    // Add Share Classes
    console.log('Creating share classes...');
    const { data: commonA } = await supabase
      .from('share_classes')
      .insert({
        company: companyId,
        name: 'Common A',
        rights: 'Standard common stock rights',
        voting_rights: '1 vote per share',
        dividend_rights: 'Pro rata participation',
        liquidation_preference: '1x'
      })
      .select()
      .single();

    const { data: preferredA } = await supabase
      .from('share_classes')
      .insert({
        company: companyId,
        name: 'Preferred A',
        rights: 'Enhanced rights with anti-dilution protection',
        voting_rights: '1.5 votes per share',
        dividend_rights: 'Priority distribution',
        liquidation_preference: '1.5x'
      })
      .select()
      .single();

    const { data: commonB } = await supabase
      .from('share_classes')
      .insert({
        company: companyId,
        name: 'Common B',
        rights: 'Standard rights without voting',
        voting_rights: 'No voting rights',
        dividend_rights: 'Pro rata participation',
        liquidation_preference: '1x'
      })
      .select()
      .single();

    const { data: preferredB } = await supabase
      .from('share_classes')
      .insert({
        company: companyId,
        name: 'Preferred B',
        rights: 'Enhanced rights with double liquidation preference',
        voting_rights: '2 votes per share',
        dividend_rights: 'Priority distribution',
        liquidation_preference: '2x'
      })
      .select()
      .single();

    // Add Stakeholders
    console.log('Creating stakeholders...');
    const stakeholderData = [
      {
        name: 'John Smith',
        email: 'john@example.com',
        type: 'founder',
        shares: 1000000,
        share_class: commonA?.id,
        join_date: '2023-01-01'
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        type: 'investor',
        shares: 500000,
        share_class: preferredA?.id,
        join_date: '2023-02-15'
      },
      {
        name: 'Michael Brown',
        email: 'michael@example.com',
        type: 'employee',
        shares: 50000,
        share_class: commonB?.id,
        join_date: '2023-03-01'
      },
      {
        name: 'Emily Davis',
        email: 'emily@example.com',
        type: 'advisor',
        shares: 25000,
        share_class: commonA?.id,
        join_date: '2023-04-15'
      },
      {
        name: 'Tech Ventures LLC',
        email: 'info@techventures.com',
        type: 'investor',
        shares: 750000,
        share_class: preferredB?.id,
        join_date: '2023-05-01'
      },
      {
        name: 'David Wilson',
        email: 'david@example.com',
        type: 'employee',
        shares: 30000,
        share_class: commonB?.id,
        join_date: '2023-06-15'
      },
      {
        name: 'Lisa Chen',
        email: 'lisa@example.com',
        type: 'employee',
        shares: 40000,
        share_class: commonB?.id,
        join_date: '2023-07-01'
      },
      {
        name: 'Growth Fund I',
        email: 'info@growthfund.com',
        type: 'investor',
        shares: 1000000,
        share_class: preferredB?.id,
        join_date: '2023-08-15'
      },
      {
        name: 'Robert Taylor',
        email: 'robert@example.com',
        type: 'advisor',
        shares: 20000,
        share_class: commonA?.id,
        join_date: '2023-09-01'
      },
      {
        name: 'Angel Group X',
        email: 'info@angelgroup.com',
        type: 'investor',
        shares: 250000,
        share_class: preferredA?.id,
        join_date: '2023-10-15'
      }
    ];

    const stakeholders = [];
    for (const data of stakeholderData) {
      const { data: stakeholder } = await supabase
        .from('stakeholders')
        .insert({
          company: companyId,
          ...data
        })
        .select()
        .single();
      stakeholders.push(stakeholder);
    }

    // Add Share Transactions
    console.log('Creating share transactions...');
    const transactionData = stakeholders.map((stakeholder) => ({
      company: companyId,
      type: 'issuance',
      from_stakeholder: null,
      to_stakeholder: stakeholder?.id,
      quantity: stakeholder?.shares,
      share_class: stakeholder?.share_class,
      price: stakeholder?.type === 'investor' ? 1.00 : 0.01,
      date: stakeholder?.join_date
    }));

    // Add some transfers between stakeholders
    transactionData.push(
      {
        company: companyId,
        type: 'transfer',
        from_stakeholder: stakeholders[0]?.id,
        to_stakeholder: stakeholders[2]?.id,
        quantity: 10000,
        share_class: commonA?.id,
        price: 0.50,
        date: '2023-06-01'
      },
      {
        company: companyId,
        type: 'transfer',
        from_stakeholder: stakeholders[1]?.id,
        to_stakeholder: stakeholders[3]?.id,
        quantity: 5000,
        share_class: preferredA?.id,
        price: 1.50,
        date: '2023-07-15'
      }
    );

    await supabase.from('share_transactions').insert(transactionData);

    // Add Funding Rounds
    console.log('Creating funding rounds...');
    const fundingRoundData = [
      {
        company: companyId,
        name: 'Pre-Seed',
        type: 'Equity',
        date: '2023-01-15',
        amount: 500000,
        valuation: 5000000,
        investors: ['Angel Group X'],
        status: 'closed'
      },
      {
        company: companyId,
        name: 'Seed',
        type: 'Equity',
        date: '2023-04-01',
        amount: 2000000,
        valuation: 10000000,
        investors: ['Tech Ventures LLC'],
        status: 'closed'
      },
      {
        company: companyId,
        name: 'Series A',
        type: 'Equity',
        date: '2023-08-15',
        amount: 5000000,
        valuation: 25000000,
        investors: ['Growth Fund I'],
        status: 'closed'
      },
      {
        company: companyId,
        name: 'Series B',
        type: 'Equity',
        date: '2024-01-15',
        amount: 10000000,
        valuation: 50000000,
        investors: ['Growth Fund II', 'Tech Fund X'],
        status: 'active'
      }
    ];

    await supabase.from('funding_rounds').insert(fundingRoundData);

    // Add Equity Grants
    console.log('Creating equity grants...');
    const equityGrantData = [
      {
        company: companyId,
        recipient: stakeholders[2]?.id, // Michael Brown
        type: 'option',
        quantity: 50000,
        grant_date: '2023-03-01',
        vesting_schedule: '4 years with 1 year cliff',
        exercise_price: 0.50,
        status: 'active'
      },
      {
        company: companyId,
        recipient: stakeholders[5]?.id, // David Wilson
        type: 'option',
        quantity: 30000,
        grant_date: '2023-06-15',
        vesting_schedule: '4 years with 1 year cliff',
        exercise_price: 0.75,
        status: 'active'
      },
      {
        company: companyId,
        recipient: stakeholders[6]?.id, // Lisa Chen
        type: 'option',
        quantity: 40000,
        grant_date: '2023-07-01',
        vesting_schedule: '4 years with 1 year cliff',
        exercise_price: 0.75,
        status: 'active'
      },
      {
        company: companyId,
        recipient: stakeholders[3]?.id, // Emily Davis
        type: 'rsu',
        quantity: 25000,
        grant_date: '2023-04-15',
        vesting_schedule: '4 years quarterly vesting',
        exercise_price: 0.00,
        status: 'active'
      },
      {
        company: companyId,
        recipient: stakeholders[8]?.id, // Robert Taylor
        type: 'rsu',
        quantity: 20000,
        grant_date: '2023-09-01',
        vesting_schedule: '4 years quarterly vesting',
        exercise_price: 0.00,
        status: 'active'
      }
    ];

    await supabase.from('equity_grants').insert(equityGrantData);

    // Add Compliance Records
    console.log('Creating compliance records...');
    const complianceRecordData = [
      {
        company: companyId,
        type: 'Annual Filing',
        due_date: '2024-03-31',
        status: 'pending',
        description: 'Annual company return filing',
        assigned_to: stakeholders[0]?.id,
        priority: 'high'
      },
      {
        company: companyId,
        type: 'Board Meeting',
        due_date: '2024-02-28',
        status: 'pending',
        description: 'Q1 2024 Board Meeting',
        assigned_to: stakeholders[0]?.id,
        priority: 'medium'
      },
      {
        company: companyId,
        type: 'Share Certificate',
        due_date: '2024-02-15',
        status: 'pending',
        description: 'Issue new share certificates for Series B investors',
        assigned_to: stakeholders[1]?.id,
        priority: 'high'
      },
      {
        company: companyId,
        type: 'Tax Filing',
        due_date: '2024-04-15',
        status: 'pending',
        description: 'Annual tax return preparation and filing',
        assigned_to: stakeholders[0]?.id,
        priority: 'high'
      },
      {
        company: companyId,
        type: 'Option Grant Review',
        due_date: '2024-03-15',
        status: 'pending',
        description: 'Review and approve new option grants',
        assigned_to: stakeholders[1]?.id,
        priority: 'medium'
      },
      {
        company: companyId,
        type: 'Shareholder Meeting',
        due_date: '2024-05-15',
        status: 'pending',
        description: 'Annual shareholder meeting preparation',
        assigned_to: stakeholders[0]?.id,
        priority: 'medium'
      },
      {
        company: companyId,
        type: 'Regulatory Filing',
        due_date: '2024-06-30',
        status: 'pending',
        description: 'Securities regulatory filing',
        assigned_to: stakeholders[1]?.id,
        priority: 'high'
      },
      {
        company: companyId,
        type: 'Vesting Review',
        due_date: '2024-03-01',
        status: 'pending',
        description: 'Quarterly vesting schedule review',
        assigned_to: stakeholders[1]?.id,
        priority: 'medium'
      }
    ];

    await supabase.from('compliance_records').insert(complianceRecordData);

    console.log(`Sample data initialized successfully for company ${companyId}!`);
  } catch (error) {
    console.error('Error initializing sample data:', error);
    throw error;
  }
} 