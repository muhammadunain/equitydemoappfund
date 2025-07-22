import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  LabelList
} from 'recharts';
import type { 
  Stakeholder, 
  ShareTransaction, 
  FundingRound,
  EquityGrant,
  ComplianceRecord 
} from '../../types';

interface ChartProps {
  stakeholders: Stakeholder[];
  transactions: ShareTransaction[];
  fundingRounds: FundingRound[];
  equityGrants: EquityGrant[];
  complianceRecords: ComplianceRecord[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function ShareDistributionChart({ stakeholders }: { stakeholders: Stakeholder[] }) {
  const data = stakeholders.reduce((acc, stakeholder) => {
    const existingType = acc.find(item => item.type === stakeholder.type);
    if (existingType) {
      existingType.shares += stakeholder.shares;
    } else {
      acc.push({ type: stakeholder.type, shares: stakeholder.shares });
    }
    return acc;
  }, [] as { type: string; shares: number }[]);

  const totalShares = data.reduce((sum, item) => sum + item.shares, 0);
  const dataWithPercent = data.map((item, index) => ({
    ...item,
    percent: ((item.shares / totalShares) * 100).toFixed(1),
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="h-[300px] flex  items-start  justify-start">
      <ResponsiveContainer className={'w-full h-full'} >
        <BarChart
          data={dataWithPercent}
          layout="vertical"
          margin={{ top: 20, right: 40, left: 10, bottom: 20 }}
        >
          <XAxis type="number" allowDecimals={false} />
          <YAxis dataKey="type" type="category" className='text-[0.8899rem]'  width={60}/>
          <Tooltip formatter={(value: number, name: string, props: any) => [`${value} shares (${props.payload.percent}%)`, 'Shares']} />
          <Legend />
          <Bar dataKey="shares" name="Shares" isAnimationActive fill="#8884d8">
            {dataWithPercent.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            <LabelList dataKey="percent" position="right" formatter={(val: string) => `${val}%`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FundingHistoryChart({ fundingRounds }: { fundingRounds: FundingRound[] }) {
  const sortedRounds = [...fundingRounds].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={sortedRounds}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
          <Tooltip formatter={(value) => `$${(Number(value) / 1000000).toFixed(1)}M`} />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="valuation" 
            name="Valuation" 
            stroke="#8884d8" 
            fill="#8884d8" 
            fillOpacity={0.3} 
          />
          <Area 
            type="monotone" 
            dataKey="amount" 
            name="Amount Raised" 
            stroke="#82ca9d" 
            fill="#82ca9d" 
            fillOpacity={0.3} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function EquityGrantsChart({ equityGrants }: { equityGrants: EquityGrant[] }) {
  const data = equityGrants.reduce((acc, grant) => {
    const month = new Date(grant.grantDate).toLocaleString('default', { month: 'short' });
    const existingMonth = acc.find(item => item.month === month);
    if (existingMonth) {
      existingMonth[grant.type] = (existingMonth[grant.type] || 0) + grant.quantity;
    } else {
      acc.push({ 
        month, 
        [grant.type]: grant.quantity 
      });
    }
    return acc;
  }, [] as any[]);

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="option" name="Options" fill="#8884d8" />
          <Bar dataKey="rsu" name="RSUs" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ComplianceStatusChart({ complianceRecords }: { complianceRecords: ComplianceRecord[] }) {
  const data = complianceRecords.reduce((acc, record) => {
    const month = new Date(record.dueDate).toLocaleString('default', { month: 'short' });
    const existingMonth = acc.find(item => item.month === month);
    if (existingMonth) {
      existingMonth[record.status] = (existingMonth[record.status] || 0) + 1;
    } else {
      acc.push({ 
        month, 
        [record.status]: 1 
      });
    }
    return acc;
  }, [] as any[]);

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="pending" name="Pending" stroke="#ffc107" />
          <Line type="monotone" dataKey="completed" name="Completed" stroke="#28a745" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 