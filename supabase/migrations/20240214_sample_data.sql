-- Insert sample share classes for each company
INSERT INTO share_classes (company, name, rights, voting_rights, dividend_rights, liquidation_preference) VALUES
    ('rovamo', 'Common A', 'Standard common stock rights', '1 vote per share', 'Pro rata participation', '1x'),
    ('rovamo', 'Preferred A', 'Enhanced rights', '1.5 votes per share', 'Priority distribution', '1.5x'),
    ('nextech-ventures', 'Common A', 'Standard common stock rights', '1 vote per share', 'Pro rata participation', '1x'),
    ('nextech-ventures', 'Preferred A', 'Enhanced rights', '1.5 votes per share', 'Priority distribution', '1.5x'),
    ('greenleaf-biotech', 'Common A', 'Standard common stock rights', '1 vote per share', 'Pro rata participation', '1x'),
    ('greenleaf-biotech', 'Preferred A', 'Enhanced rights', '1.5 votes per share', 'Priority distribution', '1.5x');

-- Insert sample stakeholders for each company
WITH share_class_ids AS (
    SELECT id, company, name FROM share_classes
)
INSERT INTO stakeholders (company, name, email, type, shares, share_class, join_date) 
SELECT 
    sc.company,
    CASE sc.company
        WHEN 'rovamo' THEN 'Alex Chen'
        WHEN 'nextech-ventures' THEN 'John Smith'
        WHEN 'greenleaf-biotech' THEN 'Sarah Johnson'
    END,
    CASE sc.company
        WHEN 'rovamo' THEN 'alex@rovamo.com'
        WHEN 'nextech-ventures' THEN 'john@nextech.com'
        WHEN 'greenleaf-biotech' THEN 'sarah@greenleaf.com'
    END,
    'Founder',
    CASE sc.company
        WHEN 'rovamo' THEN 500000
        WHEN 'nextech-ventures' THEN 400000
        WHEN 'greenleaf-biotech' THEN 600000
    END,
    sc.id,
    '2020-01-01'::DATE
FROM share_class_ids sc
WHERE sc.name = 'Common A';

-- Insert sample funding rounds for each company
INSERT INTO funding_rounds (company, name, type, date, amount, valuation, investors, status) VALUES
    ('rovamo', 'Seed Round', 'Seed', '2020-06-01', 1000000, 5000000, ARRAY['Angel Investor 1', 'Angel Investor 2'], 'Completed'),
    ('nextech-ventures', 'Series A', 'Series A', '2020-08-01', 2000000, 10000000, ARRAY['VC Fund 1', 'VC Fund 2'], 'Completed'),
    ('greenleaf-biotech', 'Seed Round', 'Seed', '2020-07-01', 1500000, 7500000, ARRAY['Bio Ventures', 'Green Fund'], 'Completed');

-- Insert sample share transactions for each company
WITH stakeholder_ids AS (
    SELECT id, company FROM stakeholders
)
INSERT INTO share_transactions (company, type, from_stakeholder, to_stakeholder, quantity, share_class, price, date)
SELECT 
    s.company,
    'Initial Issuance',
    NULL,
    s.id,
    CASE s.company
        WHEN 'rovamo' THEN 100000
        WHEN 'nextech-ventures' THEN 80000
        WHEN 'greenleaf-biotech' THEN 120000
    END,
    (SELECT id FROM share_classes WHERE company = s.company AND name = 'Common A' LIMIT 1),
    0.00,
    '2020-01-01'::DATE
FROM stakeholder_ids s;

-- Insert sample equity grants for each company
WITH stakeholder_ids AS (
    SELECT id, company FROM stakeholders
)
INSERT INTO equity_grants (company, recipient, type, quantity, grant_date, vesting_schedule, exercise_price, status)
SELECT 
    s.company,
    s.id,
    'Stock Options',
    CASE s.company
        WHEN 'rovamo' THEN 50000
        WHEN 'nextech-ventures' THEN 40000
        WHEN 'greenleaf-biotech' THEN 60000
    END,
    '2020-01-01'::DATE,
    '4 year vesting with 1 year cliff',
    1.00,
    'Active'
FROM stakeholder_ids s;

-- Insert sample compliance records for each company
WITH stakeholder_ids AS (
    SELECT id, company FROM stakeholders
)
INSERT INTO compliance_records (company, type, due_date, status, description, assigned_to, priority)
SELECT 
    s.company,
    'Annual Filing',
    '2024-12-31'::DATE,
    'Pending',
    'Annual corporate compliance filing',
    s.id,
    'High'
FROM stakeholder_ids s; 