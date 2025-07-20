-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS compliance_records;
DROP TABLE IF EXISTS equity_grants;
DROP TABLE IF EXISTS funding_rounds;
DROP TABLE IF EXISTS share_transactions;
DROP TABLE IF EXISTS stakeholders;
DROP TABLE IF EXISTS share_classes;

-- Create tables
CREATE TABLE share_classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    rights TEXT,
    voting_rights TEXT,
    dividend_rights TEXT,
    liquidation_preference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stakeholders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    type VARCHAR(50),
    shares INTEGER,
    share_class UUID REFERENCES share_classes(id),
    join_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE share_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    from_stakeholder UUID REFERENCES stakeholders(id),
    to_stakeholder UUID REFERENCES stakeholders(id),
    quantity INTEGER,
    share_class UUID REFERENCES share_classes(id),
    price DECIMAL(15,2),
    date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE funding_rounds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    type VARCHAR(50),
    date DATE,
    amount DECIMAL(15,2),
    valuation DECIMAL(15,2),
    investors TEXT[],
    status VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE equity_grants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company VARCHAR(255) NOT NULL,
    recipient UUID REFERENCES stakeholders(id),
    type VARCHAR(50),
    quantity INTEGER,
    grant_date DATE,
    vesting_schedule TEXT,
    exercise_price DECIMAL(15,2),
    status VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE compliance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    due_date DATE,
    status VARCHAR(50),
    description TEXT,
    assigned_to UUID REFERENCES stakeholders(id),
    priority VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_stakeholders_company ON stakeholders(company);
CREATE INDEX idx_stakeholders_email ON stakeholders(email);
CREATE INDEX idx_share_classes_company ON share_classes(company);
CREATE INDEX idx_share_transactions_company ON share_transactions(company);
CREATE INDEX idx_funding_rounds_company ON funding_rounds(company);
CREATE INDEX idx_equity_grants_company ON equity_grants(company);
CREATE INDEX idx_compliance_records_company ON compliance_records(company);

-- Create stored procedures
CREATE OR REPLACE FUNCTION create_share_class(
    p_company VARCHAR(255),
    p_name VARCHAR(255),
    p_rights TEXT,
    p_voting_rights TEXT,
    p_dividend_rights TEXT,
    p_liquidation_preference TEXT
) RETURNS share_classes AS $$
DECLARE
    v_result share_classes;
BEGIN
    INSERT INTO share_classes (company, name, rights, voting_rights, dividend_rights, liquidation_preference)
    VALUES (p_company, p_name, p_rights, p_voting_rights, p_dividend_rights, p_liquidation_preference)
    RETURNING * INTO v_result;
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION create_stakeholder(
    p_company VARCHAR(255),
    p_name VARCHAR(255),
    p_email VARCHAR(255),
    p_type VARCHAR(50),
    p_shares INTEGER,
    p_share_class UUID,
    p_join_date DATE
) RETURNS stakeholders AS $$
DECLARE
    v_result stakeholders;
BEGIN
    INSERT INTO stakeholders (company, name, email, type, shares, share_class, join_date)
    VALUES (p_company, p_name, p_email, p_type, p_shares, p_share_class, p_join_date)
    RETURNING * INTO v_result;
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION create_transaction(
    p_company VARCHAR(255),
    p_type VARCHAR(50),
    p_from_stakeholder UUID,
    p_to_stakeholder UUID,
    p_quantity INTEGER,
    p_share_class UUID,
    p_price DECIMAL(15,2),
    p_date DATE
) RETURNS share_transactions AS $$
DECLARE
    v_result share_transactions;
BEGIN
    INSERT INTO share_transactions (company, type, from_stakeholder, to_stakeholder, quantity, share_class, price, date)
    VALUES (p_company, p_type, p_from_stakeholder, p_to_stakeholder, p_quantity, p_share_class, p_price, p_date)
    RETURNING * INTO v_result;
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION create_funding_round(
    p_company VARCHAR(255),
    p_name VARCHAR(255),
    p_type VARCHAR(50),
    p_date DATE,
    p_amount DECIMAL(15,2),
    p_valuation DECIMAL(15,2),
    p_investors TEXT[],
    p_status VARCHAR(50)
) RETURNS funding_rounds AS $$
DECLARE
    v_result funding_rounds;
BEGIN
    INSERT INTO funding_rounds (company, name, type, date, amount, valuation, investors, status)
    VALUES (p_company, p_name, p_type, p_date, p_amount, p_valuation, p_investors, p_status)
    RETURNING * INTO v_result;
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION create_equity_grant(
    p_company VARCHAR(255),
    p_recipient UUID,
    p_type VARCHAR(50),
    p_quantity INTEGER,
    p_grant_date DATE,
    p_vesting_schedule TEXT,
    p_exercise_price DECIMAL(15,2),
    p_status VARCHAR(50)
) RETURNS equity_grants AS $$
DECLARE
    v_result equity_grants;
BEGIN
    INSERT INTO equity_grants (company, recipient, type, quantity, grant_date, vesting_schedule, exercise_price, status)
    VALUES (p_company, p_recipient, p_type, p_quantity, p_grant_date, p_vesting_schedule, p_exercise_price, p_status)
    RETURNING * INTO v_result;
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION create_compliance_record(
    p_company VARCHAR(255),
    p_type VARCHAR(50),
    p_due_date DATE,
    p_status VARCHAR(50),
    p_description TEXT,
    p_assigned_to UUID,
    p_priority VARCHAR(20)
) RETURNS compliance_records AS $$
DECLARE
    v_result compliance_records;
BEGIN
    INSERT INTO compliance_records (company, type, due_date, status, description, assigned_to, priority)
    VALUES (p_company, p_type, p_due_date, p_status, p_description, p_assigned_to, p_priority)
    RETURNING * INTO v_result;
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions to service role
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Grant permissions to anon role
ALTER TABLE share_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE stakeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE funding_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE equity_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON share_classes FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON share_classes FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON share_classes FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON share_classes FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON stakeholders FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON stakeholders FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON stakeholders FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON stakeholders FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON share_transactions FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON share_transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON share_transactions FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON share_transactions FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON funding_rounds FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON funding_rounds FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON funding_rounds FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON funding_rounds FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON equity_grants FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON equity_grants FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON equity_grants FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON equity_grants FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON compliance_records FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON compliance_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON compliance_records FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON compliance_records FOR DELETE USING (true);

-- Insert sample data for NexTech Ventures
INSERT INTO share_classes (company, name, rights, voting_rights, dividend_rights, liquidation_preference)
VALUES 
('nextech-ventures', 'Common A', 'Standard common stock rights', '1 vote per share', 'Pro rata participation', '1x'),
('nextech-ventures', 'Preferred A', 'Enhanced rights', '1.5 votes per share', 'Priority distribution', '1.5x');

INSERT INTO stakeholders (company, name, email, type, shares, share_class)
SELECT 
    'nextech-ventures',
    'John Smith',
    'john@nextech.com',
    'Founder',
    500000,
    id
FROM share_classes 
WHERE company = 'nextech-ventures' AND name = 'Common A';

-- Insert sample data for GreenLeaf Biotech
INSERT INTO share_classes (company, name, rights, voting_rights, dividend_rights, liquidation_preference)
VALUES 
('greenleaf-biotech', 'Common A', 'Standard common stock rights', '1 vote per share', 'Pro rata participation', '1x'),
('greenleaf-biotech', 'Preferred A', 'Enhanced rights', '1.5 votes per share', 'Priority distribution', '1.5x');

INSERT INTO stakeholders (company, name, email, type, shares, share_class)
SELECT 
    'greenleaf-biotech',
    'Sarah Johnson',
    'sarah@greenleaf.com',
    'Founder',
    600000,
    id
FROM share_classes 
WHERE company = 'greenleaf-biotech' AND name = 'Common A';

-- Now create indexes after all tables and data are created
CREATE INDEX idx_stakeholders_type ON stakeholders(type);
CREATE INDEX idx_share_transactions_date ON share_transactions(date);
CREATE INDEX idx_funding_rounds_status ON funding_rounds(status);
CREATE INDEX idx_equity_grants_status ON equity_grants(status);
CREATE INDEX idx_compliance_records_due_date ON compliance_records(due_date);
CREATE INDEX idx_compliance_records_status ON compliance_records(status); 