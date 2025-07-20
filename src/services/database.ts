import { supabase } from '../lib/supabase';
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

// Get current company from localStorage
const getCurrentCompany = () => {
  const auth = localStorage.getItem('auth');
  console.log('Auth data from localStorage:', auth);
  const company = auth ? JSON.parse(auth).companyId : '';
  console.log('Current company ID from localStorage:', company);
  return company;
};

// Stakeholders
export const stakeholderService = {
  async getAll() {
    try {
      const company = getCurrentCompany();
      const { data, error } = await supabase
        .from('stakeholders')
        .select(`
          *,
          share_class:share_classes!stakeholders_share_class_fkey(name)
        `)
        .eq('company', company)
        .order('created_at', { ascending: false });
      
      if (error) handleSupabaseError(error, 'fetching stakeholders');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'fetching stakeholders');
    }
  },

  async create(stakeholder: Omit<Stakeholder, 'id' | 'created_at'>) {
    try {
      const company = getCurrentCompany();
      const { data, error } = await supabase
        .from('stakeholders')
        .insert({ ...stakeholder, company })
        .select()
        .single();
      
      if (error) handleSupabaseError(error, 'creating stakeholder');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'creating stakeholder');
    }
  },

  async update(id: string, stakeholder: Partial<Stakeholder>) {
    try {
      const company = getCurrentCompany();
      const { data, error } = await supabase
        .from('stakeholders')
        .update(stakeholder)
        .eq('id', id)
        .eq('company', company)
        .select()
        .single();
      
      if (error) handleSupabaseError(error, 'updating stakeholder');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'updating stakeholder');
    }
  },

  async delete(id: string) {
    try {
      const company = getCurrentCompany();
      const { error } = await supabase
        .from('stakeholders')
        .delete()
        .eq('id', id)
        .eq('company', company);
      
      if (error) handleSupabaseError(error, 'deleting stakeholder');
    } catch (error) {
      handleSupabaseError(error, 'deleting stakeholder');
    }
  }
};

// Share Classes
export const shareClassService = {
  async getAll() {
    try {
      const company = getCurrentCompany();
      const { data, error } = await supabase
        .from('share_classes')
        .select('*')
        .eq('company', company)
        .order('created_at', { ascending: false });
      
      if (error) handleSupabaseError(error, 'fetching share classes');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'fetching share classes');
    }
  },

  async create(shareClass: Omit<ShareClass, 'id' | 'created_at'>) {
    try {
      const company = getCurrentCompany();
      const { data, error } = await supabase
        .from('share_classes')
        .insert({ ...shareClass, company })
        .select()
        .single();
      
      if (error) handleSupabaseError(error, 'creating share class');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'creating share class');
    }
  },

  async update(id: string, shareClass: Partial<ShareClass>) {
    try {
      const company = getCurrentCompany();
      const { data, error } = await supabase
        .from('share_classes')
        .update(shareClass)
        .eq('id', id)
        .eq('company', company)
        .select()
        .single();
      
      if (error) handleSupabaseError(error, 'updating share class');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'updating share class');
    }
  },

  async delete(id: string) {
    try {
      const company = getCurrentCompany();
      const { error } = await supabase
        .from('share_classes')
        .delete()
        .eq('id', id)
        .eq('company', company);
      
      if (error) handleSupabaseError(error, 'deleting share class');
    } catch (error) {
      handleSupabaseError(error, 'deleting share class');
    }
  }
};

// Share Transactions
export const transactionService = {
  async getAll() {
    try {
      const company = getCurrentCompany();
      const { data, error } = await supabase
        .from('share_transactions')
        .select(`
          *,
          from_stakeholder:stakeholders!share_transactions_from_stakeholder_fkey(name),
          to_stakeholder:stakeholders!share_transactions_to_stakeholder_fkey(name),
          share_class:share_classes!share_transactions_share_class_fkey(name)
        `)
        .eq('company', company)
        .order('created_at', { ascending: false });
      
      if (error) handleSupabaseError(error, 'fetching transactions');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'fetching transactions');
    }
  },

  async create(transaction: Omit<ShareTransaction, 'id' | 'created_at'>) {
    try {
      const company = getCurrentCompany();
      const { data, error } = await supabase
        .from('share_transactions')
        .insert({ ...transaction, company })
        .select()
        .single();
      
      if (error) handleSupabaseError(error, 'creating transaction');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'creating transaction');
    }
  },

  async update(id: string, transaction: Partial<ShareTransaction>) {
    try {
      const company = getCurrentCompany();
      const { data, error } = await supabase
        .from('share_transactions')
        .update(transaction)
        .eq('id', id)
        .eq('company', company)
        .select()
        .single();
      
      if (error) handleSupabaseError(error, 'updating transaction');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'updating transaction');
    }
  },

  async delete(id: string) {
    try {
      const company = getCurrentCompany();
      const { error } = await supabase
        .from('share_transactions')
        .delete()
        .eq('id', id)
        .eq('company', company);
      
      if (error) handleSupabaseError(error, 'deleting transaction');
    } catch (error) {
      handleSupabaseError(error, 'deleting transaction');
    }
  }
};

// Funding Rounds
export const fundingRoundService = {
  async getAll() {
    try {
      const company = getCurrentCompany();
      const { data, error } = await supabase
        .from('funding_rounds')
        .select('*')
        .eq('company', company)
        .order('created_at', { ascending: false });
      
      if (error) handleSupabaseError(error, 'fetching funding rounds');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'fetching funding rounds');
    }
  },

  async create(round: Omit<FundingRound, 'id' | 'created_at'>) {
    try {
      const company = getCurrentCompany();
      const { data, error } = await supabase
        .from('funding_rounds')
        .insert({ ...round, company })
        .select()
        .single();
      
      if (error) handleSupabaseError(error, 'creating funding round');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'creating funding round');
    }
  },

  async update(id: string, round: Partial<FundingRound>) {
    try {
      const company = getCurrentCompany();
      const { data, error } = await supabase
        .from('funding_rounds')
        .update(round)
        .eq('id', id)
        .eq('company', company)
        .select()
        .single();
      
      if (error) handleSupabaseError(error, 'updating funding round');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'updating funding round');
    }
  },

  async delete(id: string) {
    try {
      const company = getCurrentCompany();
      const { error } = await supabase
        .from('funding_rounds')
        .delete()
        .eq('id', id)
        .eq('company', company);
      
      if (error) handleSupabaseError(error, 'deleting funding round');
    } catch (error) {
      handleSupabaseError(error, 'deleting funding round');
    }
  }
};

// Equity Grants
export const equityGrantService = {
  async getAll() {
    try {
      const company = getCurrentCompany();
      const { data, error } = await supabase
        .from('equity_grants')
        .select('*')
        .eq('company', company)
        .order('created_at', { ascending: false });
      
      if (error) handleSupabaseError(error, 'fetching equity grants');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'fetching equity grants');
    }
  },

  async create(grant: Omit<EquityGrant, 'id' | 'created_at'>) {
    try {
      const company = getCurrentCompany();
      const { data, error } = await supabase
        .from('equity_grants')
        .insert({ ...grant, company })
        .select()
        .single();
      
      if (error) handleSupabaseError(error, 'creating equity grant');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'creating equity grant');
    }
  },

  async update(id: string, grant: Partial<EquityGrant>) {
    try {
      const company = getCurrentCompany();
      const { data, error } = await supabase
        .from('equity_grants')
        .update(grant)
        .eq('id', id)
        .eq('company', company)
        .select()
        .single();
      
      if (error) handleSupabaseError(error, 'updating equity grant');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'updating equity grant');
    }
  },

  async delete(id: string) {
    try {
      const company = getCurrentCompany();
      const { error } = await supabase
        .from('equity_grants')
        .delete()
        .eq('id', id)
        .eq('company', company);
      
      if (error) handleSupabaseError(error, 'deleting equity grant');
    } catch (error) {
      handleSupabaseError(error, 'deleting equity grant');
    }
  }
};

// Compliance Records
export const complianceService = {
  async getAll() {
    try {
      const company = getCurrentCompany();
      const { data, error } = await supabase
        .from('compliance_records')
        .select('*')
        .eq('company', company)
        .order('created_at', { ascending: false });
      
      if (error) handleSupabaseError(error, 'fetching compliance records');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'fetching compliance records');
    }
  },

  async create(record: Omit<ComplianceRecord, 'id' | 'created_at'>) {
    try {
      const company = getCurrentCompany();
      const { data, error } = await supabase
        .from('compliance_records')
        .insert({ ...record, company })
        .select()
        .single();
      
      if (error) handleSupabaseError(error, 'creating compliance record');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'creating compliance record');
    }
  },

  async update(id: string, record: Partial<ComplianceRecord>) {
    try {
      const company = getCurrentCompany();
      const { data, error } = await supabase
        .from('compliance_records')
        .update(record)
        .eq('id', id)
        .eq('company', company)
        .select()
        .single();
      
      if (error) handleSupabaseError(error, 'updating compliance record');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'updating compliance record');
    }
  },

  async delete(id: string) {
    try {
      const company = getCurrentCompany();
      const { error } = await supabase
        .from('compliance_records')
        .delete()
        .eq('id', id)
        .eq('company', company);
      
      if (error) handleSupabaseError(error, 'deleting compliance record');
    } catch (error) {
      handleSupabaseError(error, 'deleting compliance record');
    }
  }
};

export interface Company {
  id: string;
  name: string;
  industry: string;
  founded: string;
  total_shares: number;
  valuation: number;
}

// Companies
export const companyService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) handleSupabaseError(error, 'fetching companies');
      console.log('Available companies:', data);
      return data;
    } catch (error) {
      handleSupabaseError(error, 'fetching companies');
    }
  },
  
  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) handleSupabaseError(error, 'fetching company by id');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'fetching company by id');
    }
  }
}; 