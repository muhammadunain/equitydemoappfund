import { 
  Stakeholder, 
  ShareTransaction, 
  ShareClass, 
  FundingRound,
  EquityGrant,
  ComplianceRecord 
} from './types';

export const stakeholders: Stakeholder[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    type: 'founder',
    shares: 100000,
    shareClass: 'Common A',
    joinDate: '2023-01-01'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    type: 'investor',
    shares: 50000,
    shareClass: 'Preferred A',
    joinDate: '2023-02-15'
  },
  {
    id: '3',
    name: 'Mike Williams',
    email: 'mike@example.com',
    type: 'employee',
    shares: 5000,
    shareClass: 'Common B',
    joinDate: '2023-03-01'
  }
];

export const shareTransactions: ShareTransaction[] = [
  {
    id: '1',
    date: '2023-01-15',
    type: 'issuance',
    to: 'John Smith',
    quantity: 100000,
    shareClass: 'Common A',
    price: 0.01
  },
  {
    id: '2',
    date: '2023-02-15',
    type: 'issuance',
    to: 'Sarah Johnson',
    quantity: 50000,
    shareClass: 'Preferred A',
    price: 1.00
  },
  {
    id: '3',
    date: '2023-03-01',
    type: 'transfer',
    from: 'John Smith',
    to: 'Mike Williams',
    quantity: 5000,
    shareClass: 'Common B',
    price: 0.50
  }
];

export const shareClasses: ShareClass[] = [
  {
    id: '1',
    name: 'Common A',
    rights: ['Voting', 'Dividends'],
    votingRights: true,
    dividendRights: true,
    antiDilution: false,
    liquidationPreference: 1
  },
  {
    id: '2',
    name: 'Preferred A',
    rights: ['Voting', 'Dividends', 'Anti-dilution', 'Liquidation Preference'],
    votingRights: true,
    dividendRights: true,
    antiDilution: true,
    liquidationPreference: 1.5
  },
  {
    id: '3',
    name: 'Common B',
    rights: ['Dividends'],
    votingRights: false,
    dividendRights: true,
    antiDilution: false,
    liquidationPreference: 1
  }
];

export const fundingRounds: FundingRound[] = [
  {
    id: '1',
    name: 'Seed Round',
    type: 'Equity',
    date: '2023-01-15',
    amount: 1000000,
    valuation: 5000000,
    investors: ['Sarah Johnson'],
    status: 'closed'
  },
  {
    id: '2',
    name: 'Series A',
    type: 'Equity',
    date: '2023-06-01',
    amount: 5000000,
    valuation: 20000000,
    investors: ['Venture Capital A', 'Angel Investor B'],
    status: 'active'
  }
];

export const equityGrants: EquityGrant[] = [
  {
    id: '1',
    recipient: 'Mike Williams',
    type: 'option',
    quantity: 5000,
    grantDate: '2023-03-01',
    vestingSchedule: '4 years with 1 year cliff',
    exercisePrice: 0.50,
    status: 'active'
  },
  {
    id: '2',
    recipient: 'Jane Doe',
    type: 'rsu',
    quantity: 2000,
    grantDate: '2023-04-01',
    vestingSchedule: '4 years quarterly',
    exercisePrice: 0,
    status: 'active'
  }
];

export const complianceRecords: ComplianceRecord[] = [
  {
    id: '1',
    type: 'Annual Filing',
    dueDate: '2024-01-31',
    status: 'pending',
    description: 'Annual company return filing',
    assignedTo: 'John Smith',
    priority: 'high'
  },
  {
    id: '2',
    type: 'Share Certificate',
    dueDate: '2023-12-15',
    status: 'completed',
    description: 'Issue new share certificates for Series A investors',
    assignedTo: 'Sarah Johnson',
    priority: 'medium'
  },
  {
    id: '3',
    type: 'Board Meeting',
    dueDate: '2024-02-15',
    status: 'pending',
    description: 'Q1 2024 Board Meeting',
    assignedTo: 'John Smith',
    priority: 'medium'
  }
];