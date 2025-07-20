import React, { useState } from 'react';
import type { ShareTransaction, Stakeholder } from '../../types/database';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type TransactionFormData = Omit<ShareTransaction, 'id' | 'created_at' | 'company'>;

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  stakeholders: Stakeholder[];
  shareClasses: string[];
  onCancel: () => void;
}

export function TransactionForm({ onSubmit, stakeholders, shareClasses, onCancel }: TransactionFormProps) {
  const [transactionType, setTransactionType] = useState<string>('issuance');
  const [transactionDate, setTransactionDate] = useState<Date | null>(new Date());

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Format the date properly
    const dateValue = transactionDate ? transactionDate.toISOString().split('T')[0] : '';
    
    onSubmit({
      date: dateValue,
      type: formData.get('type') as string,
      from_stakeholder: formData.get('from_stakeholder') ? { id: formData.get('from_stakeholder') as string, name: '' } : null,
      to_stakeholder: { id: formData.get('to_stakeholder') as string, name: '' },
      quantity: parseInt(formData.get('quantity') as string, 10),
      share_class: formData.get('share_class') ? { name: formData.get('share_class') as string } : null,
      price: parseFloat(formData.get('price') as string),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-foreground">
      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Transaction Type</label>
        <select
          name="type"
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
          className="w-full p-2 border rounded bg-background text-foreground"
        >
          <option value="issuance">Issuance</option>
          <option value="transfer">Transfer</option>
          <option value="exercise">Exercise</option>
        </select>
      </div>

      {transactionType !== 'issuance' && (
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">From Stakeholder</label>
          <select name="from_stakeholder" className="w-full p-2 border rounded bg-background text-foreground">
            <option value="">Select stakeholder</option>
            {stakeholders.map(stakeholder => (
              <option key={stakeholder.id} value={stakeholder.id}>
                {stakeholder.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">To Stakeholder</label>
        <select name="to_stakeholder" className="w-full p-2 border rounded bg-background text-foreground" required>
          <option value="">Select stakeholder</option>
          {stakeholders.map(stakeholder => (
            <option key={stakeholder.id} value={stakeholder.id}>
              {stakeholder.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Share Class</label>
        <select name="share_class" className="w-full p-2 border rounded bg-background text-foreground" required>
          <option value="">Select share class</option>
          {shareClasses.map(shareClass => (
            <option key={shareClass} value={shareClass}>
              {shareClass}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Quantity</label>
        <input
          type="number"
          name="quantity"
          required
          min="1"
          className="w-full p-2 border rounded bg-background text-foreground"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Price per Share</label>
        <input
          type="number"
          name="price"
          required
          min="0"
          step="0.01"
          className="w-full p-2 border rounded bg-background text-foreground"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Transaction Date</label>
        <DatePicker
          selected={transactionDate}
          onChange={(date) => setTransactionDate(date)}
          className="w-full p-2 border rounded bg-background text-foreground focus:ring-2 focus:ring-primary"
          dateFormat="yyyy/MM/dd"
          placeholderText="Select date"
          required
          wrapperClassName="w-full"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded hover:bg-accent bg-background text-foreground"
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