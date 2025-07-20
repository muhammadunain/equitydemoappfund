import React, { useState } from 'react';
import type { EquityGrant, Stakeholder } from '../../types/database';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type EquityGrantFormData = Omit<EquityGrant, 'id' | 'created_at' | 'company'>;

interface EquityGrantFormProps {
  onSubmit: (data: EquityGrantFormData) => void;
  onCancel: () => void;
  stakeholders: Stakeholder[]; // Type should match your stakeholder structure
}

export function EquityGrantForm({ onSubmit, onCancel, stakeholders }: EquityGrantFormProps) {
  const [grantDate, setGrantDate] = useState<Date | null>(new Date());

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Parse numeric values with fallbacks to prevent NaN
    const quantity = parseInt(formData.get('quantity') as string, 10) || 0;
    const exercisePrice = parseFloat(formData.get('exercisePrice') as string) || 0;
    
    // Format the date properly
    const dateValue = grantDate ? grantDate.toISOString().split('T')[0] : '';

    // Prepare the submission data
    const submissionData: EquityGrantFormData = {
      recipientId: formData.get('recipientId') as string,
      type: formData.get('type') as string,
      quantity: quantity,
      grantDate: dateValue,
      vestingSchedule: formData.get('vestingSchedule') as string,
      exercisePrice: exercisePrice,
      status: formData.get('status') as string,
    };
    
    console.log('Submitting equity grant data:', submissionData);
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-foreground">
      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Recipient</label>
        <select 
          name="recipientId" 
          className="w-full p-2 border rounded bg-background text-foreground focus:ring-2 focus:ring-primary" 
          required
        >
          <option value="">Select recipient</option>
          {stakeholders.map((stakeholder) => (
            <option key={stakeholder.id} value={stakeholder.id}>
              {stakeholder.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Type</label>
        <select 
          name="type" 
          className="w-full p-2 border rounded bg-background text-foreground focus:ring-2 focus:ring-primary" 
          required
        >
          <option value="">Select type</option>
          <option value="option">Stock Option</option>
          <option value="rsu">RSU</option>
          <option value="sars">Stock Appreciation Rights</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Quantity</label>
        <input
          type="number"
          name="quantity"
          min="1"
          required
          className="w-full p-2 border rounded bg-background text-foreground focus:ring-2 focus:ring-primary"
          placeholder="Enter number of shares"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Grant Date</label>
        <DatePicker
          selected={grantDate}
          onChange={(date) => setGrantDate(date)}
          className="w-full p-2 border rounded bg-background text-foreground focus:ring-2 focus:ring-primary"
          dateFormat="yyyy/MM/dd"
          placeholderText="Select date"
          required
          wrapperClassName="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Vesting Schedule</label>
        <select 
          name="vestingSchedule" 
          className="w-full p-2 border rounded bg-background text-foreground focus:ring-2 focus:ring-primary" 
          required
        >
          <option value="">Select schedule</option>
          <option value="4-year-1-year-cliff">4 years with 1 year cliff</option>
          <option value="4-year-no-cliff">4 years with no cliff</option>
          <option value="immediate">Immediate</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Exercise Price</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-foreground">$</span>
          <input
            type="number"
            name="exercisePrice"
            min="0"
            step="0.01"
            className="w-full p-2 pl-8 border rounded bg-background text-foreground focus:ring-2 focus:ring-primary"
            placeholder="Enter price per share"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Status</label>
        <select 
          name="status" 
          className="w-full p-2 border rounded bg-background text-foreground focus:ring-2 focus:ring-primary" 
          required
        >
          <option value="">Select status</option>
          <option value="active">Active</option>
          <option value="exercised">Exercised</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
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

export default EquityGrantForm; 