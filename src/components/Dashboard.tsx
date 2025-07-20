import React from 'react';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Award,
  FileCheck
} from 'lucide-react';
import { Badge } from './Badge';
import type { 
  Stakeholder, 
  ShareTransaction, 
  FundingRound,
  EquityGrant,
  ComplianceRecord 
} from '../types';
import { 
  ShareDistributionChart, 
  FundingHistoryChart, 
  EquityGrantsChart, 
  ComplianceStatusChart 
} from './charts/DashboardCharts';

interface DashboardProps {
  stakeholders: Stakeholder[];
  transactions: ShareTransaction[];
  fundingRounds: FundingRound[];
  equityGrants: EquityGrant[];
  complianceRecords: ComplianceRecord[];
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}

function StatCard({ title, value, change, icon }: StatCardProps) {
  return (
    <div className="bg-card rounded-lg p-6 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-semibold">{value}</h3>
          <p className="text-xs text-muted-foreground mt-1">{change}</p>
        </div>
        <div className="p-3 bg-primary/10 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );
}

export function Dashboard({ 
  stakeholders, 
  transactions, 
  fundingRounds, 
  equityGrants,
  complianceRecords 
}: DashboardProps) {
  const totalShares = stakeholders.reduce((sum, s) => sum + s.shares, 0);
  const totalFunding = fundingRounds.reduce((sum, r) => sum + r.amount, 0);
  const activeGrants = equityGrants.filter(g => g.status === 'active').length;
  const pendingCompliance = complianceRecords.filter(r => r.status === 'pending').length;

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Stakeholders"
          value={stakeholders.length.toString()}
          change="+2 from last month"
          icon={<Users className="h-6 w-6 text-primary" />}
        />
        <StatCard
          title="Total Shares"
          value={totalShares.toLocaleString()}
          change="+5000 from last month"
          icon={<TrendingUp className="h-6 w-6 text-primary" />}
        />
        <StatCard
          title="Active Grants"
          value={activeGrants.toString()}
          change="+3 from last month"
          icon={<Award className="h-6 w-6 text-primary" />}
        />
        <StatCard
          title="Pending Compliance"
          value={pendingCompliance.toString()}
          change="-2 from last month"
          icon={<FileCheck className="h-6 w-6 text-primary" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-4">Share Distribution</h3>
          <ShareDistributionChart stakeholders={stakeholders} />
        </div>
        <div className="bg-card rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-4">Funding History</h3>
          <FundingHistoryChart fundingRounds={fundingRounds} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-4">Equity Grants by Month</h3>
          <EquityGrantsChart equityGrants={equityGrants} />
        </div>
        <div className="bg-card rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-4">Compliance Status</h3>
          <ComplianceStatusChart complianceRecords={complianceRecords} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {transactions.slice(0, 3).map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{transaction.to}</p>
                  <p className="text-sm text-muted-foreground">{transaction.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{transaction.quantity.toLocaleString()} shares</p>
                  <Badge variant={transaction.type === 'issuance' ? 'success' : 'default'}>
                    {transaction.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Upcoming Compliance</h3>
          <div className="space-y-4">
            {complianceRecords
              .filter(record => record.status === 'pending')
              .slice(0, 3)
              .map(record => (
                <div key={record.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{record.type}</p>
                    <p className="text-sm text-muted-foreground">Due: {record.dueDate}</p>
                  </div>
                  <Badge variant={
                    record.priority === 'high' ? 'error' :
                    record.priority === 'medium' ? 'warning' :
                    'default'
                  }>
                    {record.priority}
                  </Badge>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Funding Overview */}
      <div className="bg-card p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Funding Overview</h3>
        <div className="space-y-4">
          {fundingRounds.map(round => (
            <div key={round.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{round.name}</p>
                <p className="text-sm text-muted-foreground">{round.date}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${round.amount.toLocaleString()}</p>
                <Badge variant={
                  round.status === 'closed' ? 'success' :
                  round.status === 'active' ? 'warning' :
                  'default'
                }>
                  {round.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}