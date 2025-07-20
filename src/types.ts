export interface Stakeholder {
  id: string;
  name: string;
  email: string;
  type: 'founder' | 'investor' | 'employee';
  shares: number;
  shareClass: string;
  joinDate: string;
}

export interface ShareTransaction {
  id: string;
  date: string;
  type: 'issuance' | 'transfer' | 'exercise';
  from?: string;
  to: string;
  quantity: number;
  shareClass: string;
  price: number;
}

export interface ShareClass {
  id: string;
  name: string;
  rights: string[];
  votingRights: boolean;
  dividendRights: boolean;
  antiDilution: boolean;
  liquidationPreference: number;
}

export interface FundingRound {
  id: string;
  name: string;
  type: string;
  date: string;
  amount: number;
  valuation: number;
  investors: string[];
  status: 'planned' | 'active' | 'closed';
}

export interface EquityGrant {
  id: string;
  recipient: string;
  type: 'option' | 'warrant' | 'rsu';
  quantity: number;
  grantDate: string;
  vestingSchedule: string;
  exercisePrice: number;
  status: 'active' | 'exercised' | 'expired';
}

export interface ComplianceRecord {
  id: string;
  type: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  description: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
}