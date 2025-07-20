import React, { useState, useEffect } from 'react';
import { companyService } from '../services/database';
import type { Company } from '../types/database';

interface LoginPageProps {
  onLogin: (company: Company, username: string, password: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('user');
  const [password, setPassword] = useState('user');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const allCompanies = await companyService.getAll();
      console.log('Available companies:', allCompanies);
      if (allCompanies && allCompanies.length > 0) {
        setCompanies(allCompanies);
        setSelectedCompany(allCompanies[0]);
      }
    } catch (error) {
      console.error('Error loading companies:', error);
      setError('Failed to load companies. Please try again.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) {
      setError('Please select a company');
      return;
    }
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }
    onLogin(selectedCompany, username, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-xl shadow-lg border border-border">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Equity Vantage</h1>
        <p className="text-muted-foreground my-3">
  Demo account pre-filled just click "Login" to explore the app.
</p>


        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="company" className="block text-sm font-medium mb-1">
              Company
            </label>
            <select
              id="company"
              value={selectedCompany?.id || ''}
              onChange={(e) => {
                const company = companies.find(c => c.id === e.target.value);
                setSelectedCompany(company || null);
              }}
              className="w-full px-3 py-2 bg-background border border-input rounded-md"
            >
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-input rounded-md"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-input rounded-md"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
} 