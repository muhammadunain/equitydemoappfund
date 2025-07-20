import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { companyService } from '../services/database';
import type { Company } from '../types/database';

interface CompanySwitcherProps {
  currentCompany: string;
  onCompanyChange: (company: Company) => void;
}

export function CompanySwitcher({ currentCompany, onCompanyChange }: CompanySwitcherProps) {
  const [open, setOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    if (companies.length > 0) {
      const company = companies.find(c => c.id === currentCompany);
      setSelectedCompany(company || null);
    }
  }, [companies, currentCompany]);

  const loadCompanies = async () => {
    try {
      const allCompanies = await companyService.getAll();
      console.log('Available companies for switcher:', allCompanies);
      if (allCompanies) {
        setCompanies(allCompanies);
      }
    } catch (error) {
      console.error('Error loading companies:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg"
      >
        {selectedCompany?.name || 'Select Company'}
        <ChevronsUpDown size={16} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50">
          {companies.map((company) => (
            <button
              key={company.id}
              onClick={() => {
                onCompanyChange(company);
                setOpen(false);
              }}
              className={`
                flex items-center justify-between w-full px-4 py-2 text-sm
                ${company.id === currentCompany ? 'bg-accent' : 'hover:bg-accent'}
                ${company.id === companies[0].id ? 'rounded-t-lg' : ''}
                ${company.id === companies[companies.length - 1].id ? 'rounded-b-lg' : ''}
              `}
            >
              <span>{company.name}</span>
              {company.id === currentCompany && <Check size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 