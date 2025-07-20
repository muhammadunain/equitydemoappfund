-- Create companies table
CREATE TABLE companies (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(255) NOT NULL,
    founded VARCHAR(4) NOT NULL,
    total_shares INTEGER NOT NULL,
    valuation DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better query performance
CREATE INDEX idx_companies_name ON companies(name);

-- Insert sample companies
INSERT INTO companies (id, name, industry, founded, total_shares, valuation) VALUES
    ('rovamo', 'Rovamo', 'Technology', '2020', 1000000, 5000000),
    ('nextech-ventures', 'NexTech Ventures', 'Software', '2019', 800000, 4200000),
    ('greenleaf-biotech', 'GreenLeaf Biotech', 'Biotechnology', '2018', 1200000, 7500000),
    ('quantum-dynamics', 'Quantum Dynamics', 'Quantum Computing', '2021', 600000, 3800000),
    ('solar-solutions', 'Solar Solutions', 'Renewable Energy', '2017', 900000, 5500000),
    ('ai-innovations', 'AI Innovations', 'Artificial Intelligence', '2020', 750000, 4800000),
    ('medtech-plus', 'MedTech Plus', 'Healthcare Technology', '2019', 850000, 5200000),
    ('fintech-global', 'FinTech Global', 'Financial Technology', '2018', 950000, 6100000),
    ('cyber-shield', 'Cyber Shield', 'Cybersecurity', '2020', 700000, 4500000),
    ('space-tech', 'Space Tech', 'Aerospace', '2021', 550000, 3500000),
    ('eco-systems', 'Eco Systems', 'Environmental Technology', '2019', 800000, 4900000);

-- Grant permissions
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON companies FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON companies FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON companies FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON companies FOR DELETE USING (true);

-- Grant permissions to service role
GRANT ALL ON companies TO service_role; 