import React, { useState } from 'react';
import type { Stakeholder, ShareClass } from '../../types/database';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type StakeholderFormData = Omit<Stakeholder, 'id' | 'created_at' | 'company'>;

interface StakeholderFormProps {
  onSubmit: (data: StakeholderFormData) => void;
  shareClasses: ShareClass[];
  onCancel: () => void;
}

export function StakeholderForm({ onSubmit, shareClasses, onCancel }: StakeholderFormProps) {
  const [joinDate, setJoinDate] = useState<Date | null>(new Date());

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Format the date properly
    const dateValue = joinDate ? joinDate.toISOString().split('T')[0] : '';
    
    onSubmit({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      type: formData.get('type') as string,
      shares: formData.get('shares') ? parseInt(formData.get('shares') as string, 10) : 0,
      share_class: formData.get('share_class') ? { name: formData.get('share_class') as string } : undefined,
      join_date: dateValue,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-foreground">
      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Name</label>
        <input
          type="text"
          name="name"
          required
          className="w-full p-2 border rounded bg-background text-foreground"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Email</label>
        <input
          type="email"
          name="email"
          required
          className="w-full p-2 border rounded bg-background text-foreground"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Type</label>
        <select name="type" className="w-full p-2 border rounded bg-background text-foreground" required>
          <option value="">Select type</option>
          <option value="founder">Founder</option>
          <option value="investor">Investor</option>
          <option value="employee">Employee</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Shares</label>
        <input
          type="number"
          name="shares"
          min="0"
          className="w-full p-2 border rounded bg-background text-foreground"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Share Class</label>
        <select name="share_class" className="w-full p-2 border rounded bg-background text-foreground">
          <option value="">Select share class</option>
          {shareClasses.map(shareClass => (
            <option key={shareClass.id} value={shareClass.id}>
              {shareClass.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Join Date</label>
        <DatePicker
          selected={joinDate}
          onChange={(date) => setJoinDate(date)}
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