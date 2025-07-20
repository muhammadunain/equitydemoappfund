import React, { useState } from 'react';
import type { FundingRound } from '../../types/database';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type FundingRoundFormData = Omit<FundingRound, 'id' | 'created_at' | 'company'>;

interface FundingRoundFormProps {
  onSubmit: (data: FundingRoundFormData) => void;
  onCancel: () => void;
}

export function FundingRoundForm({ onSubmit, onCancel }: FundingRoundFormProps) {
  const [roundDate, setRoundDate] = useState<Date | null>(new Date());
  const [investorsList, setInvestorsList] = useState<string[]>([]);
  const [newInvestor, setNewInvestor] = useState('');

  const handleAddInvestor = () => {
    if (newInvestor.trim()) {
      setInvestorsList([...investorsList, newInvestor.trim()]);
      setNewInvestor('');
    }
  };

  const handleRemoveInvestor = (index: number) => {
    setInvestorsList(investorsList.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Prepare investors data - either from the input field or from the list we've built
    let investors: string[];
    const investorsField = formData.get('investors');
    
    if (investorsList.length > 0) {
      investors = investorsList;
    } else if (investorsField && typeof investorsField === 'string') {
      investors = investorsField.split(',').map(s => s.trim()).filter(s => s !== '');
    } else {
      investors = [];
    }
    
    // Parse numeric values, with fallback to prevent NaN
    const amount = parseFloat(formData.get('amount') as string) || 0;
    const valuation = parseFloat(formData.get('valuation') as string) || 0;
    
    // Format the date properly
    const dateValue = roundDate ? roundDate.toISOString().split('T')[0] : '';
    
    // Prepare the submission data
    const submissionData: FundingRoundFormData = {
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      date: dateValue,
      amount: amount,
      valuation: valuation,
      investors: investors,
      status: formData.get('status') as string,
    };
    
    console.log('Submitting funding round data:', submissionData);
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-foreground">
      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Name</label>
        <input
          type="text"
          name="name"
          required
          className="w-full p-2 border rounded bg-background text-foreground focus:ring-2 focus:ring-primary"
          placeholder="e.g., Series A"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Type</label>
        <select 
          name="type" 
          className="w-full p-2 border rounded bg-background text-foreground focus:ring-2 focus:ring-primary" 
          required
        >
          <option value="">Select type</option>
          <option value="seed">Seed</option>
          <option value="series_a">Series A</option>
          <option value="series_b">Series B</option>
          <option value="series_c">Series C</option>
          <option value="bridge">Bridge</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Date</label>
        <DatePicker
          selected={roundDate}
          onChange={(date) => setRoundDate(date)}
          className="w-full p-2 border rounded bg-background text-foreground focus:ring-2 focus:ring-primary"
          dateFormat="yyyy/MM/dd"
          placeholderText="Select date"
          required
          wrapperClassName="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Amount</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-foreground">$</span>
          <input
            type="number"
            name="amount"
            min="0"
            step="0.01"
            required
            className="w-full p-2 pl-8 border rounded bg-background text-foreground focus:ring-2 focus:ring-primary"
            placeholder="Enter amount"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Valuation</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-foreground">$</span>
          <input
            type="number"
            name="valuation"
            min="0"
            step="0.01"
            required
            className="w-full p-2 pl-8 border rounded bg-background text-foreground focus:ring-2 focus:ring-primary"
            placeholder="Enter valuation"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Investors</label>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            value={newInvestor}
            onChange={(e) => setNewInvestor(e.target.value)}
            className="flex-1 p-2 border rounded bg-background text-foreground focus:ring-2 focus:ring-primary"
            placeholder="Enter investor name"
          />
          <button
            type="button"
            onClick={handleAddInvestor}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
          >
            Add
          </button>
        </div>
        
        {investorsList.length > 0 ? (
          <div className="mb-2 space-y-2">
            {investorsList.map((investor, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                <span className="text-foreground">{investor}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveInvestor(index)}
                  className="text-destructive hover:text-destructive/90"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <input
            type="text"
            name="investors"
            className="w-full p-2 border rounded bg-background text-foreground focus:ring-2 focus:ring-primary"
            placeholder="Or enter investor names, separated by commas"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Status</label>
        <select 
          name="status" 
          className="w-full p-2 border rounded bg-background text-foreground focus:ring-2 focus:ring-primary" 
          required
        >
          <option value="">Select status</option>
          <option value="planned">Planned</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-border rounded hover:bg-accent text-foreground"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Save
        </button>
      </div>
    </form>
  );
}

export default FundingRoundForm; 