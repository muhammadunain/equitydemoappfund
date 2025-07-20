const { supabase } = require('../lib/supabaseAdmin');
import type {
  Stakeholder,
  ShareClass,
  ShareTransaction,
  FundingRound,
  EquityGrant,
  ComplianceRecord,
} from '../types/database';

// Helper function to handle Supabase errors
const handleSupabaseError = (error: any, operation: string) => {
  console.error(`Error in ${operation}:`, error);
  if (error.code === '42P01') {
    throw new Error(`Table does not exist. Please make sure all database tables are created.`);
  } else if (error.code === '23505') {
    throw new Error(`Duplicate entry. This record already exists.`);
  } else if (error.code === '23503') {
    throw new Error(`Referenced record does not exist.`);
  } else {
    throw new Error(`Database error: ${error.message || 'Unknown error'}`);
  }
};

// Service functions for initialization
const services = {
  async createShareClass(data: Omit<ShareClass, 'id' | 'created_at'>) {
    const { data: result, error } = await supabase.rpc('create_share_class', {
      p_company: data.company,
      p_name: data.name,
      p_rights: data.rights,
      p_voting_rights: data.voting_rights,
      p_dividend_rights: data.dividend_rights,
      p_liquidation_preference: data.liquidation_preference
    });
    
    if (error) handleSupabaseError(error, 'creating share class');
    return result;
  },

  async createStakeholder(data: Omit<Stakeholder, 'id' | 'created_at'>) {
    const { data: result, error } = await supabase.rpc('create_stakeholder', {
      p_company: data.company,
      p_name: data.name,
      p_email: data.email,
      p_type: data.type,
      p_shares: data.shares,
      p_share_class: data.share_class,
      p_join_date: data.join_date
    });
    
    if (error) handleSupabaseError(error, 'creating stakeholder');
    return result;
  },

  async createTransaction(data: Omit<ShareTransaction, 'id' | 'created_at'>) {
    const { data: result, error } = await supabase.rpc('create_transaction', {
      p_company: data.company,
      p_type: data.type,
      p_from_stakeholder: data.from_stakeholder,
      p_to_stakeholder: data.to_stakeholder,
      p_quantity: data.quantity,
      p_share_class: data.share_class,
      p_price: data.price,
      p_date: data.date
    });
    
    if (error) handleSupabaseError(error, 'creating transaction');
    return result;
  },

  async createFundingRound(data: Omit<FundingRound, 'id' | 'created_at'>) {
    const { data: result, error } = await supabase.rpc('create_funding_round', {
      p_company: data.company,
      p_name: data.name,
      p_type: data.type,
      p_date: data.date,
      p_amount: data.amount,
      p_valuation: data.valuation,
      p_investors: data.investors,
      p_status: data.status
    });
    
    if (error) handleSupabaseError(error, 'creating funding round');
    return result;
  },

  async createEquityGrant(data: Omit<EquityGrant, 'id' | 'created_at'>) {
    const { data: result, error } = await supabase.rpc('create_equity_grant', {
      p_company: data.company,
      p_recipient: data.recipient,
      p_type: data.type,
      p_quantity: data.quantity,
      p_grant_date: data.grant_date,
      p_vesting_schedule: data.vesting_schedule,
      p_exercise_price: data.exercise_price,
      p_status: data.status
    });
    
    if (error) handleSupabaseError(error, 'creating equity grant');
    return result;
  },

  async createComplianceRecord(data: Omit<ComplianceRecord, 'id' | 'created_at'>) {
    const { data: result, error } = await supabase.rpc('create_compliance_record', {
      p_company: data.company,
      p_type: data.type,
      p_due_date: data.due_date,
      p_status: data.status,
      p_description: data.description,
      p_assigned_to: data.assigned_to,
      p_priority: data.priority
    });
    
    if (error) handleSupabaseError(error, 'creating compliance record');
    return result;
  }
};

async function initializeData() {
  try {
    console.log('Starting data initialization...');

    // Add Share Classes
    console.log('Creating share classes...');
    const commonA = await services.createShareClass({
      company: 'nextech-ventures',
      name: 'Common A',
      rights: 'Standard common stock rights',
      voting_rights: '1 vote per share',
      dividend_rights: 'Pro rata participation',
      liquidation_preference: '1x'
    });

    await services.createShareClass({
      company: 'nextech-ventures',
      name: 'Preferred A',
      rights: 'Enhanced rights',
      voting_rights: '1.5 votes per share',
      dividend_rights: 'Priority distribution',
      liquidation_preference: '1.5x'
    });

    // Add Stakeholders
    console.log('Creating stakeholders...');
    const founder = await services.createStakeholder({
      company: 'nextech-ventures',
      name: 'John Smith',
      email: 'john@nextech.com',
      type: 'founder',
      shares: 1000000,
      share_class: commonA.id,
      join_date: '2023-01-01'
    });

    await services.createStakeholder({
      company: 'nextech-ventures',
      name: 'Sarah Johnson',
      email: 'sarah@nextech.com',
      type: 'investor',
      shares: 500000,
      share_class: commonA.id,
      join_date: '2023-02-15'
    });

    await services.createStakeholder({
      company: 'nextech-ventures',
      name: 'Mike Williams',
      email: 'mike@nextech.com',
      type: 'employee',
      shares: 50000,
      share_class: commonA.id,
      join_date: '2023-03-01'
    });

    // Add Share Transactions
    console.log('Creating share transactions...');
    await services.createTransaction({
      company: 'nextech-ventures',
      type: 'issuance',
      from_stakeholder: null,
      to_stakeholder: founder.id,
      quantity: 1000000,
      share_class: commonA.id,
      price: 0.01,
      date: '2023-01-01'
    });

    // Add Funding Rounds
    console.log('Creating funding rounds...');
    await services.createFundingRound({
      company: 'nextech-ventures',
      name: 'Seed Round',
      type: 'Equity',
      date: '2023-01-15',
      amount: 1000000,
      valuation: 5000000,
      investors: ['Sarah Johnson'],
      status: 'closed'
    });

    await services.createFundingRound({
      company: 'nextech-ventures',
      name: 'Series A',
      type: 'Equity',
      date: '2023-06-01',
      amount: 5000000,
      valuation: 20000000,
      investors: ['Venture Capital A', 'Angel Investor B'],
      status: 'active'
    });

    // Add Equity Grants
    console.log('Creating equity grants...');
    await services.createEquityGrant({
      company: 'nextech-ventures',
      recipient: founder.id,
      type: 'option',
      quantity: 50000,
      grant_date: '2023-03-01',
      vesting_schedule: '4 years with 1 year cliff',
      exercise_price: 0.50,
      status: 'active'
    });

    await services.createEquityGrant({
      company: 'nextech-ventures',
      recipient: founder.id,
      type: 'rsu',
      quantity: 20000,
      grant_date: '2023-04-01',
      vesting_schedule: '4 years quarterly',
      exercise_price: 0,
      status: 'active'
    });

    // Add Compliance Records
    console.log('Creating compliance records...');
    await services.createComplianceRecord({
      company: 'nextech-ventures',
      type: 'Annual Filing',
      due_date: '2024-01-31',
      status: 'pending',
      description: 'Annual company return filing',
      assigned_to: founder.id,
      priority: 'high'
    });

    await services.createComplianceRecord({
      company: 'nextech-ventures',
      type: 'Share Certificate',
      due_date: '2023-12-15',
      status: 'completed',
      description: 'Issue new share certificates for Series A investors',
      assigned_to: founder.id,
      priority: 'medium'
    });

    await services.createComplianceRecord({
      company: 'nextech-ventures',
      type: 'Board Meeting',
      due_date: '2024-02-15',
      status: 'pending',
      description: 'Q1 2024 Board Meeting',
      assigned_to: founder.id,
      priority: 'medium'
    });

    console.log('Sample data initialized successfully!');
  } catch (error) {
    console.error('Error initializing sample data:', error);
    throw error;
  }
}

module.exports = { initializeData }; 