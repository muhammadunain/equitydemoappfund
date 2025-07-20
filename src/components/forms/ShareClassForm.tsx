import React from 'react';
import type { ShareClass } from '../../types/database';

type ShareClassFormData = Omit<ShareClass, 'id' | 'created_at' | 'company'>;

interface ShareClassFormProps {
  onSubmit: (data: ShareClassFormData) => void;
  onCancel: () => void;
}

export function ShareClassForm({ onSubmit, onCancel }: ShareClassFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    onSubmit({
      name: formData.get('name') as string,
      rights: formData.get('rights') as string,
      voting_rights: formData.get('voting_rights') as string,
      dividend_rights: formData.get('dividend_rights') as string,
      liquidation_preference: formData.get('liquidation_preference') as string,
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
        <label className="block text-sm font-medium mb-1 text-foreground">Rights</label>
        <input
          type="text"
          name="rights"
          required
          className="w-full p-2 border rounded bg-background text-foreground"
          placeholder="e.g., Standard common stock rights"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Voting Rights</label>
        <input
          type="text"
          name="voting_rights"
          required
          className="w-full p-2 border rounded bg-background text-foreground"
          placeholder="e.g., 1 vote per share"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Dividend Rights</label>
        <input
          type="text"
          name="dividend_rights"
          required
          className="w-full p-2 border rounded bg-background text-foreground"
          placeholder="e.g., Pro rata participation"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Liquidation Preference</label>
        <input
          type="text"
          name="liquidation_preference"
          required
          className="w-full p-2 border rounded bg-background text-foreground"
          placeholder="e.g., 1x"
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