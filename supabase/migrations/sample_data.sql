-- Add more share classes
INSERT INTO share_classes (name, rights, voting_rights, dividend_rights, liquidation_preference) VALUES
    ('Common B', ARRAY['Dividends'], false, true, 1),
    ('Preferred B', ARRAY['Voting', 'Dividends', 'Anti-dilution'], true, true, 2)
ON CONFLICT (name) DO NOTHING;

-- Add stakeholders for different companies
INSERT INTO stakeholders (name, email, type, shares, share_class, join_date) VALUES
    -- NexTech Ventures stakeholders
    ('Sarah Johnson', 'sarah@nextech.com', 'founder', 800000, 'Common A', '2019-01-15'),
    ('Michael Chen', 'michael@nextech.com', 'employee', 50000, 'Common B', '2019-03-01'),
    ('Venture Capital X', 'vcx@investors.com', 'investor', 200000, 'Preferred A', '2019-06-15'),
    
    -- GreenLeaf Biotech stakeholders
    ('Emily Brown', 'emily@greenleaf.com', 'founder', 1000000, 'Common A', '2018-05-20'),
    ('David Wilson', 'david@greenleaf.com', 'employee', 75000, 'Common B', '2018-07-01'),
    ('Bio Investments Ltd', 'bio@investors.com', 'investor', 300000, 'Preferred A', '2018-12-10')
ON CONFLICT DO NOTHING;

-- Add share transactions
INSERT INTO share_transactions (type, from_stakeholder_id, to_stakeholder_id, quantity, share_class, price, date) VALUES
    -- NexTech Ventures transactions
    ('issuance', NULL, (SELECT id FROM stakeholders WHERE email = 'sarah@nextech.com'), 800000, 'Common A', 0.10, '2019-01-15'),
    ('issuance', NULL, (SELECT id FROM stakeholders WHERE email = 'michael@nextech.com'), 50000, 'Common B', 0.50, '2019-03-01'),
    ('issuance', NULL, (SELECT id FROM stakeholders WHERE email = 'vcx@investors.com'), 200000, 'Preferred A', 2.50, '2019-06-15'),
    
    -- GreenLeaf Biotech transactions
    ('issuance', NULL, (SELECT id FROM stakeholders WHERE email = 'emily@greenleaf.com'), 1000000, 'Common A', 0.05, '2018-05-20'),
    ('issuance', NULL, (SELECT id FROM stakeholders WHERE email = 'david@greenleaf.com'), 75000, 'Common B', 0.25, '2018-07-01'),
    ('issuance', NULL, (SELECT id FROM stakeholders WHERE email = 'bio@investors.com'), 300000, 'Preferred A', 1.75, '2018-12-10')
ON CONFLICT DO NOTHING;

-- Add funding rounds
INSERT INTO funding_rounds (name, type, date, amount, valuation, investors, status) VALUES
    -- NexTech Ventures funding rounds
    ('Seed Round', 'Equity', '2019-06-15', 500000, 2000000, ARRAY['Venture Capital X'], 'closed'),
    ('Series A', 'Equity', '2020-03-01', 2000000, 8000000, ARRAY['Venture Capital X', 'Angel Group Y'], 'closed'),
    
    -- GreenLeaf Biotech funding rounds
    ('Seed Round', 'Equity', '2018-12-10', 750000, 3000000, ARRAY['Bio Investments Ltd'], 'closed'),
    ('Series A', 'Equity', '2019-08-15', 3000000, 12000000, ARRAY['Bio Investments Ltd', 'Healthcare Fund Z'], 'closed'),
    ('Series B', 'Equity', '2020-06-01', 5000000, 25000000, ARRAY['Global Biotech Ventures'], 'active')
ON CONFLICT DO NOTHING;

-- Add equity grants
INSERT INTO equity_grants (recipient, type, quantity, grant_date, vesting_schedule, exercise_price, status) VALUES
    -- NexTech Ventures grants
    ('Michael Chen', 'option', 50000, '2019-03-01', '4 years with 1 year cliff', 0.50, 'active'),
    ('Alex Thompson', 'rsu', 25000, '2019-09-15', '4 years quarterly vesting', 0.00, 'active'),
    
    -- GreenLeaf Biotech grants
    ('David Wilson', 'option', 75000, '2018-07-01', '4 years with 1 year cliff', 0.25, 'active'),
    ('Rachel Adams', 'rsu', 30000, '2019-01-15', '4 years quarterly vesting', 0.00, 'active')
ON CONFLICT DO NOTHING;

-- Add compliance records
INSERT INTO compliance_records (type, due_date, status, description, assigned_to, priority) VALUES
    -- NexTech Ventures compliance records
    ('Annual Filing', '2024-03-31', 'pending', 'Annual company return filing', 'Sarah Johnson', 'high'),
    ('Board Meeting', '2024-02-28', 'pending', 'Q1 2024 Board Meeting', 'Sarah Johnson', 'medium'),
    
    -- GreenLeaf Biotech compliance records
    ('Annual Filing', '2024-03-31', 'pending', 'Annual company return filing', 'Emily Brown', 'high'),
    ('Share Certificate', '2024-02-15', 'pending', 'Issue new share certificates for Series B investors', 'Emily Brown', 'medium'),
    ('Board Meeting', '2024-03-15', 'pending', 'Q1 2024 Board Meeting', 'Emily Brown', 'medium')
ON CONFLICT DO NOTHING; 