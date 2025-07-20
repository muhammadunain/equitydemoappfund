export interface Stakeholder {
  id: string;
  name: string;
  email: string;
  type: string;
  shares: number;
  share_class?: { name: string };
  join_date: string;
  company: string;
  created_at?: string;
}

export interface ShareClass {
  id: string;
  name: string;
  rights: string;
  voting_rights: string;
  dividend_rights: string;
  liquidation_preference: string;
  company: string;
  created_at?: string;
}

export interface ShareTransaction {
  id: string;
  date: string;
  type: string;
  from_stakeholder: { id: string; name: string } | null;
  to_stakeholder: { id: string; name: string } | null;
  quantity: number;
  share_class: { name: string } | null;
  price: number;
  company: string;
  created_at?: string;
}

export interface FundingRound {
  id: string;
  name: string;
  type: string;
  date: string;
  amount: number;
  valuation: number;
  investors: string[];
  status: string;
  company: string;
  created_at?: string;
}

export interface EquityGrant {
  id: string;
  recipientId: string;
  type: string;
  quantity: number;
  grantDate: string;
  vestingSchedule: string;
  exercisePrice: number;
  status: string;
  company: string;
  created_at?: string;
}

export interface ComplianceRecord {
  id: string;
  type: string;
  dueDate: string;
  status: string;
  description: string;
  assignedTo: string;
  priority: string;
  company: string;
  created_at?: string;
}

export interface Company {
  id: string;
  name: string;
  created_at?: string;
  description?: string;
  industry?: string;
  website?: string;
  logo_url?: string;
} 