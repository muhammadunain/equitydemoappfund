import './styles/forms.css';
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  FileText, 
  Users, 
  Shield, 
  Briefcase,
  ChevronDown,
  Calendar,
  Download,
  Menu,
  X,
  Plus,
  Trash2,
  LayoutDashboard,
  LogOut
} from 'lucide-react';
import { Table } from './components/Table';
import { PageHeader } from './components/PageHeader';
import { Badge } from './components/Badge';
import { Dashboard } from './components/Dashboard';
import { useAsync } from './hooks/useAsync';
import {
  stakeholderService,
  shareClassService,
  transactionService,
  fundingRoundService,
  equityGrantService,
  complianceService,
  companyService
} from './services/database';
import { initializeSampleData } from './services/initSampleData';
import type {
  Stakeholder,
  ShareClass,
  ShareTransaction,
  FundingRound,
  EquityGrant,
  ComplianceRecord,
  Company
} from './types/database';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { Modal } from './components/Modal';
import { StakeholderForm } from './components/forms/StakeholderForm';
import { TransactionForm } from './components/forms/TransactionForm';
import { ShareClassForm } from './components/forms/ShareClassForm';
import { FundingRoundForm } from './components/forms/FundingRoundForm';
import { EquityGrantForm } from './components/forms/EquityGrantForm';
import { ComplianceForm } from './components/forms/ComplianceForm';
import { LoginPage } from './components/LoginPage';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';
import { CompanySwitcher } from './components/CompanySwitcher';
import { Toast } from './components/Toast';
import { ConfirmationModal } from './components/ConfirmationModal';

type StakeholderFormData = Omit<Stakeholder, 'id' | 'created_at' | 'company'>;
type TransactionFormData = Omit<ShareTransaction, 'id' | 'created_at' | 'company'>;
type ShareClassFormData = Omit<ShareClass, 'id' | 'created_at' | 'company'>;
type FundingRoundFormData = Omit<FundingRound, 'id' | 'created_at' | 'company'>;
type EquityGrantFormData = Omit<EquityGrant, 'id' | 'created_at' | 'company'>;
type ComplianceFormData = Omit<ComplianceRecord, 'id' | 'created_at' | 'company'>;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const auth = localStorage.getItem('auth');
    const isAuth = auth ? JSON.parse(auth).authenticated : false;
    console.log('Initial authentication state:', isAuth);
    return isAuth;
  });
  
  const [currentCompany, setCurrentCompany] = useState(() => {
    const auth = localStorage.getItem('auth');
    const companyId = auth ? JSON.parse(auth).companyId : '';
    console.log('Initial company ID state:', companyId);
    return companyId;
  });
  
  const [currentCompanyData, setCurrentCompanyData] = useState<Company | null>(null);
  
  const [currentUser, setCurrentUser] = useState(() => {
    const auth = localStorage.getItem('auth');
    return auth ? JSON.parse(auth).user : '';
  });
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    content: React.ReactNode;
  } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Data fetching hooks
  const stakeholders = useAsync(stakeholderService.getAll);
  const shareClasses = useAsync(shareClassService.getAll);
  const transactions = useAsync(transactionService.getAll);
  const fundingRounds = useAsync(fundingRoundService.getAll);
  const equityGrants = useAsync(equityGrantService.getAll);
  const complianceRecords = useAsync(complianceService.getAll);

  // Load all data on mount only if authenticated
  useEffect(() => {
    console.log('Authentication state changed:', isAuthenticated);
    if (isAuthenticated) {
      console.log('Executing data fetching...');
      stakeholders.execute();
      shareClasses.execute();
      transactions.execute();
      fundingRounds.execute();
      equityGrants.execute().then(() => {
        console.log('Equity Grants Data:', equityGrants.data);
      });
      complianceRecords.execute();
    }
  }, [isAuthenticated]);

  // Load company data when currentCompany changes
  useEffect(() => {
    if (currentCompany) {
      companyService.getById(currentCompany).then(data => {
        console.log('Loaded company data:', data);
        setCurrentCompanyData(data);
      });
    }
  }, [currentCompany]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleDelete = async (section: string, id: string) => {
    setConfirmationModal({
      isOpen: true,
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      onConfirm: async () => {
        try {
          switch (section) {
            case 'stakeholders':
              await stakeholderService.delete(id);
              stakeholders.execute();
              break;
            case 'share-classes':
              await shareClassService.delete(id);
              shareClasses.execute();
              break;
            case 'transactions':
              await transactionService.delete(id);
              transactions.execute();
              break;
            case 'funding-rounds':
              await fundingRoundService.delete(id);
              fundingRounds.execute();
              break;
            case 'equity-grants':
              await equityGrantService.delete(id);
              equityGrants.execute();
              break;
            case 'compliance':
              await complianceService.delete(id);
              complianceRecords.execute();
              break;
          }
          setToast({ message: 'Item deleted successfully', type: 'success' });
        } catch (error) {
          console.error('Error deleting item:', error);
          setToast({ message: 'Error deleting item', type: 'error' });
        }
      },
    });
  };

  const handleAddStakeholder = async (data: StakeholderFormData) => {
    try {
      // Log the data being sent to the database
      console.log('Adding Stakeholder Data:', { ...data, company: currentCompany });

      await stakeholderService.create({ ...data, company: currentCompany });
      stakeholders.execute();
      setIsModalOpen(false);
      setToast({ message: 'Stakeholder added successfully', type: 'success' });
    } catch (error) {
      console.error('Error adding stakeholder:', error);
      setToast({ message: 'Error adding stakeholder', type: 'error' });
    }
  };

  // Function to validate UUID
  const isValidUUID = (uuid: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  const handleAddTransaction = async (data: TransactionFormData) => {
    try {
      await transactionService.create({ ...data, company: currentCompany });
      transactions.execute();
      setIsModalOpen(false);
      setToast({ message: 'Transaction added successfully', type: 'success' });
    } catch (error) {
      console.error('Error adding transaction:', error);
      setToast({ message: 'Error adding transaction', type: 'error' });
    }
  };

  const handleAddShareClass = async (data: ShareClassFormData) => {
    try {
      await shareClassService.create({ ...data, company: currentCompany });
      shareClasses.execute();
      setIsModalOpen(false);
      setToast({ message: 'Share class added successfully', type: 'success' });
    } catch (error) {
      console.error('Error adding share class:', error);
      setToast({ message: 'Error adding share class', type: 'error' });
    }
  };

  const handleAddFundingRound = async (data: FundingRoundFormData) => {
    try {
      console.log("Adding funding round with data:", data);
      await fundingRoundService.create({ ...data, company: currentCompany });
      fundingRounds.execute();
      setIsModalOpen(false);
      setToast({ message: 'Funding round added successfully', type: 'success' });
    } catch (error) {
      console.error('Error adding funding round:', error);
      setToast({ message: 'Error adding funding round', type: 'error' });
    }
  };

  const handleAddEquityGrant = async (data: EquityGrantFormData) => {
    try {
      console.log("Adding equity grant with data:", data);
      await equityGrantService.create({ ...data, company: currentCompany });
      equityGrants.execute();
      setIsModalOpen(false);
      setToast({ message: 'Equity grant added successfully', type: 'success' });
    } catch (error) {
      console.error('Error adding equity grant:', error);
      setToast({ message: 'Error adding equity grant', type: 'error' });
    }
  };

  const handleAddComplianceRecord = async (data: ComplianceFormData) => {
    try {
      await complianceService.create({ ...data, company: currentCompany });
      complianceRecords.execute();
      setIsModalOpen(false);
      setToast({ message: 'Compliance record added successfully', type: 'success' });
    } catch (error) {
      console.error('Error adding compliance record:', error);
      setToast({ message: 'Error adding compliance record', type: 'error' });
    }
  };

  const openAddStakeholderModal = () => {
    setModalContent({
      title: 'Add New Stakeholder',
      content: (
        <StakeholderForm
          onSubmit={handleAddStakeholder}
          shareClasses={shareClasses.data || []}
          onCancel={() => setIsModalOpen(false)}
        />
      ),
    });
    setIsModalOpen(true);
  };

  const openAddTransactionModal = () => {
    setModalContent({
      title: 'Add New Transaction',
      content: (
        <TransactionForm
          onSubmit={handleAddTransaction}
          stakeholders={stakeholders.data || []}
          shareClasses={(shareClasses.data || []).map(sc => sc.name)}
          onCancel={() => setIsModalOpen(false)}
        />
      ),
    });
    setIsModalOpen(true);
  };

  const openAddShareClassModal = () => {
    setModalContent({
      title: 'Add New Share Class',
      content: (
        <ShareClassForm
          onSubmit={handleAddShareClass}
          onCancel={() => setIsModalOpen(false)}
        />
      ),
    });
    setIsModalOpen(true);
  };

  const openAddFundingRoundModal = () => {
    setModalContent({
      title: 'Add New Funding Round',
      content: (
        <FundingRoundForm
          onSubmit={handleAddFundingRound}
          onCancel={() => setIsModalOpen(false)}
        />
      ),
    });
    setIsModalOpen(true);
  };

  const openAddEquityGrantModal = () => {
    setModalContent({
      title: 'Add New Equity Grant',
      content: (
        <EquityGrantForm
          onSubmit={handleAddEquityGrant}
          stakeholders={stakeholders.data || []}
          onCancel={() => setIsModalOpen(false)}
        />
      ),
    });
    setIsModalOpen(true);
  };

  const openAddComplianceModal = () => {
    setModalContent({
      title: 'Add New Compliance Record',
      content: (
        <ComplianceForm
          onSubmit={handleAddComplianceRecord}
          stakeholders={stakeholders.data || []}
          onCancel={() => setIsModalOpen(false)}
        />
      ),
    });
    setIsModalOpen(true);
  };

  const handleLogin = (company: Company, username: string, password: string) => {
    console.log('Attempting to log in with:', { company, username, password });
    if (username === 'user' && password === 'user') {
        setIsAuthenticated(true);
        setCurrentCompany(company.id);
        localStorage.setItem('auth', JSON.stringify({
            authenticated: true,
            companyId: company.id,
            user: username
        }));
    } else {
        alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentCompany('');
    setCurrentUser('');
    setActiveSection('dashboard');
    localStorage.removeItem('auth');
  };

  const handleCompanyChange = (company: Company) => {
    console.log('Changing company to:', company);
    setCurrentCompany(company.id);
    setCurrentCompanyData(company);
    localStorage.setItem('auth', JSON.stringify({
      authenticated: true,
      companyId: company.id,
      user: currentUser
    }));
    // Reset data and fetch new company data
    stakeholders.execute();
    shareClasses.execute();
    transactions.execute();
    fundingRounds.execute();
    equityGrants.execute();
    complianceRecords.execute();
  };

  const getRecipientName = (recipientId: string) => {
    const recipient = stakeholders.data?.find(stakeholder => stakeholder.id === recipientId);
    return recipient ? recipient.name : 'Unknown Recipient';
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <>
            <PageHeader 
              title={currentCompanyData?.name || 'Loading...'} 
              description="Key metrics and equity overview"
            />
            {stakeholders.loading || transactions.loading || fundingRounds.loading || 
             equityGrants.loading || complianceRecords.loading ? (
              <LoadingSpinner message="Loading dashboard data..." />
            ) : stakeholders.error || transactions.error || fundingRounds.error || 
                equityGrants.error || complianceRecords.error ? (
              <ErrorMessage message="Error loading dashboard data. Please make sure the database is properly set up." />
            ) : (
              <Dashboard 
                stakeholders={stakeholders.data || []}
                transactions={transactions.data || []}
                fundingRounds={fundingRounds.data || []}
                equityGrants={equityGrants.data || []}
                complianceRecords={complianceRecords.data || []}
              />
            )}
          </>
        );

      case 'stakeholders':
        return (
          <>
            <PageHeader 
              title={currentCompanyData?.name || 'Loading...'} 
              description="Manage company stakeholders and their equity holdings"
            >
              <button
                onClick={openAddStakeholderModal}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
              >
                <Plus size={16} />
                Add Stakeholder
              </button>
            </PageHeader>
            {stakeholders.loading ? (
              <LoadingSpinner message="Loading stakeholders..." />
            ) : stakeholders.error ? (
              <ErrorMessage message={stakeholders.error.message} />
            ) : (
              <Table
                columns={[
                  { header: 'Name', accessor: 'name', sortable: true },
                  { header: 'Email', accessor: 'email', sortable: true },
                  { header: 'Type', accessor: 'type', sortable: true, render: (value) => (
                    <Badge variant={value === 'founder' ? 'success' : 'default'}>
                      {value}
                    </Badge>
                  )},
                  { header: 'Shares', accessor: 'shares', sortable: true },
                  { header: 'Share Class', accessor: 'share_class', sortable: true, render: (value) => value?.name || '-' },
                  { header: 'Join Date', accessor: 'join_date', sortable: true },
                  { header: 'Actions', accessor: 'id', sortable: false, render: (value) => (
                    <button
                      onClick={() => handleDelete('stakeholders', value)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                ]}
                data={stakeholders.data || []}
              />
            )}
          </>
        );

      case 'transactions':
        return (
          <>
            <PageHeader 
              title={currentCompanyData?.name || 'Loading...'} 
              description="Track all Rovamo share transfers and issuances"
            >
              <button
                onClick={openAddTransactionModal}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
              >
                <Plus size={16} />
                New Transaction
              </button>
            </PageHeader>
            <Table
              columns={[
                { header: 'Date', accessor: 'date', sortable: true },
                { header: 'Type', accessor: 'type', sortable: true, render: (value) => (
                  <Badge variant={value === 'issuance' ? 'success' : 'default'}>
                    {value}
                  </Badge>
                )},
                { header: 'From', accessor: 'from_stakeholder', sortable: true, render: (value) => value?.name || '-' },
                { header: 'To', accessor: 'to_stakeholder', sortable: true, render: (value) => value?.name || '-' },
                { header: 'Quantity', accessor: 'quantity', sortable: true },
                { header: 'Share Class', accessor: 'share_class', sortable: true, render: (value) => value?.name || '-' },
                { header: 'Price', accessor: 'price', sortable: true, render: (value) => `$${value}` },
                { header: 'Actions', accessor: 'id', sortable: false, render: (value) => (
                  <button
                    onClick={() => handleDelete('transactions', value)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              ]}
              data={transactions.data || []}
            />
          </>
        );

      case 'share-classes':
        return (
          <>
            <PageHeader 
              title={currentCompanyData?.name || 'Loading...'} 
              description="Manage different types of shares and their rights"
            >
              <button
                onClick={openAddShareClassModal}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
              >
                <Plus size={16} />
                Add Share Class
              </button>
            </PageHeader>
            <Table
              columns={[
                { header: 'Name', accessor: 'name', sortable: true },
                { header: 'Rights', accessor: 'rights', sortable: true },
                { header: 'Voting Rights', accessor: 'voting_rights', sortable: true },
                { header: 'Dividend Rights', accessor: 'dividend_rights', sortable: true },
                { header: 'Liquidation Preference', accessor: 'liquidation_preference', sortable: true },
                { header: 'Actions', accessor: 'id', sortable: false, render: (value) => (
                  <button
                    onClick={() => handleDelete('share-classes', value)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              ]}
              data={shareClasses.data || []}
            />
          </>
        );

      case 'funding-rounds':
        return (
          <>
            <PageHeader 
              title={currentCompanyData?.name || 'Loading...'} 
              description="Track company financing rounds and valuations"
            >
              <button
                onClick={openAddFundingRoundModal}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
              >
                <Plus size={16} />
                New Round
              </button>
            </PageHeader>
            <Table
              columns={[
                { header: 'Name', accessor: 'name', sortable: true },
                { header: 'Type', accessor: 'type', sortable: true },
                { header: 'Date', accessor: 'date', sortable: true },
                { header: 'Amount', accessor: 'amount', sortable: true, render: (value) => `$${value.toLocaleString()}` },
                { header: 'Valuation', accessor: 'valuation', sortable: true, render: (value) => `$${value.toLocaleString()}` },
                { header: 'Status', accessor: 'status', sortable: true, render: (value) => (
                  <Badge variant={
                    value === 'closed' ? 'success' : 
                    value === 'active' ? 'warning' : 
                    'default'
                  }>
                    {value}
                  </Badge>
                )},
                { header: 'Actions', accessor: 'id', sortable: false, render: (value) => (
                  <button
                    onClick={() => handleDelete('funding-rounds', value)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              ]}
              data={fundingRounds.data || []}
            />
          </>
        );

      case 'equity-grants':
        return (
          <>
            <PageHeader 
              title={currentCompanyData?.name || 'Loading...'} 
              description="Manage employee stock options and RSU grants"
            >
              <button
                onClick={openAddEquityGrantModal}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
              >
                <Plus size={16} />
                New Grant
              </button>
            </PageHeader>
            <Table
              columns={[
                { header: 'Recipient', accessor: 'recipientId', sortable: true, render: (value) => getRecipientName(value) },
                { header: 'Type', accessor: 'type', sortable: true, render: (value) => (
                  <Badge variant="default">{value}</Badge>
                )},
                { header: 'Quantity', accessor: 'quantity', sortable: true },
                { header: 'Grant Date', accessor: 'grantDate', sortable: true },
                { header: 'Vesting Schedule', accessor: 'vestingSchedule', sortable: true },
                { header: 'Exercise Price', accessor: 'exercisePrice', sortable: true, render: (value) => `$${value || 0}` },
                { header: 'Status', accessor: 'status', sortable: true, render: (value) => (
                  <Badge variant={
                    value === 'active' ? 'success' : 
                    value === 'exercised' ? 'warning' : 
                    'error'
                  }>
                    {value}
                  </Badge>
                )},
                { header: 'Actions', accessor: 'id', sortable: false, render: (value) => (
                  <button
                    onClick={() => handleDelete('equity-grants', value)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              ]}
              data={equityGrants.data || []}
            />
          </>
        );

      case 'compliance':
        return (
          <>
            <PageHeader 
              title={currentCompany} 
              description="Track regulatory compliance and corporate filings"
            >
              <button
                onClick={openAddComplianceModal}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
              >
                <Plus size={16} />
                Add Record
              </button>
            </PageHeader>
            <Table
              columns={[
                { header: 'Type', accessor: 'type', sortable: true },
                { header: 'Due Date', accessor: 'dueDate', sortable: true },
                { header: 'Status', accessor: 'status', sortable: true, render: (value) => (
                  <Badge variant={
                    value === 'completed' ? 'success' : 
                    value === 'pending' ? 'warning' : 
                    'error'
                  }>
                    {value}
                  </Badge>
                )},
                { header: 'Description', accessor: 'description', sortable: true },
                { header: 'Assigned To', accessor: 'assignedTo', sortable: true },
                { header: 'Priority', accessor: 'priority', sortable: true, render: (value) => (
                  <Badge variant={
                    value === 'low' ? 'default' : 
                    value === 'medium' ? 'warning' : 
                    'error'
                  }>
                    {value}
                  </Badge>
                )},
                { header: 'Actions', accessor: 'id', sortable: false, render: (value) => (
                  <button
                    onClick={() => handleDelete('compliance', value)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              ]}
              data={complianceRecords.data || []}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <ThemeProvider>
      {!isAuthenticated ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <div className="flex h-screen bg-background text-foreground">
          {/* Mobile Overlay */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-20 lg:hidden"
              onClick={toggleSidebar}
            />
          )}

          {/* Sidebar */}
          <aside className={`
            fixed lg:static inset-y-0 left-0 w-64 bg-card border-r border-border
            flex flex-col z-30 transform transition-transform duration-200 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">Equity Vantage</h1>
              </div>
              <button 
                className="lg:hidden p-1 hover:bg-accent rounded-lg"
                onClick={toggleSidebar}
              >
                <X size={20} />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto">
              <div className="border-b border-border">
                <button
                  onClick={() => {
                    setActiveSection('dashboard');
                    if (window.innerWidth < 1024) {
                      toggleSidebar();
                    }
                  }}
                  className={`flex items-center gap-3 w-full p-4 text-left hover:bg-accent ${
                    activeSection === 'dashboard' ? 'bg-accent' : ''
                  }`}
                >
                  <LayoutDashboard size={20} />
                  <span className="font-medium gradient-text">Dashboard</span>
                </button>
              </div>

              <div className="border-b border-border">
                <button
                  onClick={() => {
                    setActiveSection('stakeholders');
                    if (window.innerWidth < 1024) {
                      toggleSidebar();
                    }
                  }}
                  className={`flex items-center gap-3 w-full p-4 text-left hover:bg-accent ${
                    activeSection === 'stakeholders' ? 'bg-accent' : ''
                  }`}
                >
                  <Users size={20} />
                  <span className="font-medium gradient-text">Stakeholders</span>
                </button>
              </div>

              <div className="border-b border-border">
                <button
                  onClick={() => {
                    setActiveSection('transactions');
                    if (window.innerWidth < 1024) {
                      toggleSidebar();
                    }
                  }}
                  className={`flex items-center gap-3 w-full p-4 text-left hover:bg-accent ${
                    activeSection === 'transactions' ? 'bg-accent' : ''
                  }`}
                >
                  <BarChart3 size={20} />
                  <span className="font-medium">Share Transactions</span>
                </button>
              </div>

              <div className="border-b border-border">
                <button
                  onClick={() => {
                    setActiveSection('share-classes');
                    if (window.innerWidth < 1024) {
                      toggleSidebar();
                    }
                  }}
                  className={`flex items-center gap-3 w-full p-4 text-left hover:bg-accent ${
                    activeSection === 'share-classes' ? 'bg-accent' : ''
                  }`}
                >
                  <FileText size={20} />
                  <span className="font-medium">Share Classes</span>
                </button>
              </div>

              <div className="border-b border-border">
                <button
                  onClick={() => {
                    setActiveSection('funding-rounds');
                    if (window.innerWidth < 1024) {
                      toggleSidebar();
                    }
                  }}
                  className={`flex items-center gap-3 w-full p-4 text-left hover:bg-accent ${
                    activeSection === 'funding-rounds' ? 'bg-accent' : ''
                  }`}
                >
                  <Briefcase size={20} />
                  <span className="font-medium">Funding Rounds</span>
                </button>
              </div>

              <div className="border-b border-border">
                <button
                  onClick={() => {
                    setActiveSection('equity-grants');
                    if (window.innerWidth < 1024) {
                      toggleSidebar();
                    }
                  }}
                  className={`flex items-center gap-3 w-full p-4 text-left hover:bg-accent ${
                    activeSection === 'equity-grants' ? 'bg-accent' : ''
                  }`}
                >
                  <FileText size={20} />
                  <span className="font-medium">Equity Grants</span>
                </button>
              </div>

              <div className="border-b border-border">
                <button
                  onClick={() => {
                    setActiveSection('compliance');
                    if (window.innerWidth < 1024) {
                      toggleSidebar();
                    }
                  }}
                  className={`flex items-center gap-3 w-full p-4 text-left hover:bg-accent ${
                    activeSection === 'compliance' ? 'bg-accent' : ''
                  }`}
                >
                  <Shield size={20} />
                  <span className="font-medium">Compliance</span>
                </button>
              </div>
            </nav>

            <div className="p-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                    {currentUser ? currentUser[0].toUpperCase() : '?'}
                  </div>
                  <div>
                    <p className="font-medium">{currentUser || 'Guest'}</p>
                    <p className="text-sm text-muted-foreground">Administrator</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-auto w-full">
            {/* Header */}
            <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 border-b border-border">
              <div className="flex items-center justify-between px-4 py-4">
                <div className="flex items-center gap-4">
                  <button 
                    className="lg:hidden p-2 hover:bg-accent rounded-lg"
                    onClick={toggleSidebar}
                  >
                    <Menu size={20} />
                  </button>
                  <CompanySwitcher 
                    currentCompany={currentCompany}
                    onCompanyChange={handleCompanyChange}
                  />
                </div>
                <div className="flex items-center gap-4">
                  {/* Add Sample Data button commented out
                  <button
                    onClick={async () => {
                      try {
                        setToast({ message: 'Adding sample data...', type: 'info' });
                        await initializeSampleData(currentCompany);
                        // Refresh all data
                        stakeholders.execute();
                        shareClasses.execute();
                        transactions.execute();
                        fundingRounds.execute();
                        equityGrants.execute();
                        complianceRecords.execute();
                        setToast({ message: 'Sample data added successfully', type: 'success' });
                      } catch (error) {
                        console.error('Error initializing sample data:', error);
                        setToast({ message: 'Error adding sample data', type: 'error' });
                      }
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Sample Data
                  </button>
                  */}
                  <ThemeToggle />
                </div>
              </div>
            </header>

            {/* Content */}
            <div className="p-6">
              {renderContent()}
            </div>
          </main>

          {/* Modal */}
          {modalContent && (
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title={modalContent.title}
            >
              {modalContent.content}
            </Modal>
          )}

          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
          
          <ConfirmationModal
            isOpen={confirmationModal.isOpen}
            onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
            onConfirm={confirmationModal.onConfirm}
            title={confirmationModal.title}
            message={confirmationModal.message}
          />
        </div>
      )}
    </ThemeProvider>
  );
}

export default App;