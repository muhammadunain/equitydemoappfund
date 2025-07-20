import React, { useState } from 'react';
import type { ComplianceRecord, Stakeholder } from '../../types/database';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type ComplianceFormData = Omit<ComplianceRecord, 'id' | 'created_at' | 'company'>;

interface ComplianceFormProps {
  onSubmit: (data: ComplianceFormData) => void;
  stakeholders: Stakeholder[];
  onCancel: () => void;
}

export function ComplianceForm({ onSubmit, stakeholders, onCancel }: ComplianceFormProps) {
  const [dueDate, setDueDate] = useState<Date | null>(new Date());

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Format the date properly
    const dateValue = dueDate ? dueDate.toISOString().split('T')[0] : '';
    
    onSubmit({
      type: formData.get('type') as string,
      dueDate: dateValue,
      status: formData.get('status') as string,
      description: formData.get('description') as string,
      assignedTo: formData.get('assigned_to') ? formData.get('assigned_to') as string : '',
      priority: formData.get('priority') as string,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-foreground">
      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Type</label>
        <select name="type" className="w-full p-2 border rounded bg-background text-foreground" required>
          <option value="">Select type</option>
          <option value="filing">Filing</option>
          <option value="report">Report</option>
          <option value="disclosure">Disclosure</option>
          <option value="certification">Certification</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Due Date</label>
        <DatePicker
          selected={dueDate}
          onChange={(date) => setDueDate(date)}
          className="w-full p-2 border rounded bg-background text-foreground focus:ring-2 focus:ring-primary"
          dateFormat="yyyy/MM/dd"
          placeholderText="Select date"
          required
          wrapperClassName="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Status</label>
        <select name="status" className="w-full p-2 border rounded bg-background text-foreground" required>
          <option value="">Select status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Description</label>
        <textarea
          name="description"
          required
          className="w-full p-2 border rounded bg-background text-foreground"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Assigned To</label>
        <select name="assigned_to" className="w-full p-2 border rounded bg-background text-foreground">
          <option value="">Select stakeholder</option>
          {stakeholders.map(stakeholder => (
            <option key={stakeholder.id} value={stakeholder.id}>
              {stakeholder.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Priority</label>
        <select name="priority" className="w-full p-2 border rounded bg-background text-foreground" required>
          <option value="">Select priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
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