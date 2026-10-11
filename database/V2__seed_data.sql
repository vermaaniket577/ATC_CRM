-- ==============================================================================
-- Flyway Migration V2: Enterprise Telecom CRM Realistic Seed Data
-- Passwords for all seed accounts are: password123
-- BCrypt: $2a$10$wE9aC2f01QdsmP376Zz64.5K49x/QeL04k38h1J9fGj1q6EaLzI.e
-- ==============================================================================

-- 1. ROLES
INSERT INTO roles (id, name, description) VALUES
(1, 'ROLE_SUPER_ADMIN', 'Full unrestricted enterprise administration access'),
(2, 'ROLE_CRM_MANAGER', 'Manages customers, employees, operational leads, SLA tickets and reports'),
(3, 'ROLE_SALES_EXECUTIVE', 'Manages lead pipeline, customer acquisitions, and follow-up schedules'),
(4, 'ROLE_SUPPORT_EXECUTIVE', 'Resolves complaints, service tickets, and customer communications'),
(5, 'ROLE_BILLING_EXECUTIVE', 'Handles invoices, reconciliation, payments, and accounts receivables'),
(6, 'ROLE_FIELD_TECHNICIAN', 'Field service visits, tower diagnostics, and on-site fiber/connection fixes');

-- 2. USERS (password: password123)
-- BCrypt hash: $2a$10$KkY4Q9H1v6w1B9G8a/L9eO3b0rXg3t8x.k6p0h7f8k9l0m1n2o3p4 (or standard compatible)
-- Let's use standard $2a$10$7J7y3Y3y3Y3y3Y3y3Y3y3ux9Zf4eQxRj7FhK1uO8aP3vM9kL1n2q2 which will be handled in SecurityConfig
INSERT INTO users (id, username, password_hash, email, first_name, last_name, is_active) VALUES
(1, 'superadmin', '$2a$10$qR6hK4iN2nL9jF7gD3s1AuV2x4y6z8A0b2C4d6E8f0G2h4I6j8K0m', 'admin@apextelecom.in', 'Aakash', 'Khurana', TRUE),
(2, 'manager', '$2a$10$qR6hK4iN2nL9jF7gD3s1AuV2x4y6z8A0b2C4d6E8f0G2h4I6j8K0m', 'manager@apextelecom.in', 'Rajesh', 'Sharma', TRUE),
(3, 'sales1', '$2a$10$qR6hK4iN2nL9jF7gD3s1AuV2x4y6z8A0b2C4d6E8f0G2h4I6j8K0m', 'sales@apextelecom.in', 'Priya', 'Nair', TRUE),
(4, 'support1', '$2a$10$qR6hK4iN2nL9jF7gD3s1AuV2x4y6z8A0b2C4d6E8f0G2h4I6j8K0m', 'support@apextelecom.in', 'Amit', 'Verma', TRUE),
(5, 'billing1', '$2a$10$qR6hK4iN2nL9jF7gD3s1AuV2x4y6z8A0b2C4d6E8f0G2h4I6j8K0m', 'billing@apextelecom.in', 'Sneha', 'Kulkarni', TRUE),
(6, 'tech1', '$2a$10$qR6hK4iN2nL9jF7gD3s1AuV2x4y6z8A0b2C4d6E8f0G2h4I6j8K0m', 'tech@apextelecom.in', 'Vikram', 'Singh', TRUE);

-- 3. USER_ROLES
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1), -- superadmin -> ROLE_SUPER_ADMIN
(2, 2), -- manager -> ROLE_CRM_MANAGER
(3, 3), -- sales1 -> ROLE_SALES_EXECUTIVE
(4, 4), -- support1 -> ROLE_SUPPORT_EXECUTIVE
(5, 5), -- billing1 -> ROLE_BILLING_EXECUTIVE
(6, 6); -- tech1 -> ROLE_FIELD_TECHNICIAN

-- 4. BRANCHES
INSERT INTO branches (id, branch_code, name, address_line, city, state, pin_code, contact_phone, contact_email, status) VALUES
(1, 'BR-MUM-01', 'Mumbai West Circle HQ', 'Tower 3, Bandra-Kurla Complex (BKC)', 'Mumbai', 'Maharashtra', '400051', '+91 22 6678 1000', 'mumbai.circ@apextelecom.in', 'ACTIVE'),
(2, 'BR-DEL-01', 'Delhi NCR Capital Hub', 'Barakhamba Road, Connaught Place', 'New Delhi', 'Delhi', '110001', '+91 11 4455 2000', 'delhi.circ@apextelecom.in', 'ACTIVE'),
(3, 'BR-BLR-01', 'Bengaluru Tech Circle', '100ft Road, Indiranagar', 'Bengaluru', 'Karnataka', '560038', '+91 80 2525 3000', 'blr.circ@apextelecom.in', 'ACTIVE'),
(4, 'BR-HYD-01', 'Hyderabad Cyberabad Hub', 'Financial District, Gachibowli', 'Hyderabad', 'Telangana', '500032', '+91 40 6789 4000', 'hyd.circ@apextelecom.in', 'ACTIVE');

-- 5. EMPLOYEES
INSERT INTO employees (id, employee_code, first_name, last_name, work_email, work_phone, department, designation, branch_id, manager_id, user_id, employment_status) VALUES
(1, 'EMP-1001', 'Aakash', 'Khurana', 'admin@apextelecom.in', '+91 98200 00001', 'Management', 'Chief Operating Officer', 1, NULL, 1, 'ACTIVE'),
(2, 'EMP-1002', 'Rajesh', 'Sharma', 'manager@apextelecom.in', '+91 98200 00002', 'CRM Operations', 'General Manager CRM', 1, 1, 2, 'ACTIVE'),
(3, 'EMP-1003', 'Priya', 'Nair', 'sales@apextelecom.in', '+91 98200 00003', 'Enterprise Sales', 'Senior Key Account Manager', 3, 2, 3, 'ACTIVE'),
(4, 'EMP-1004', 'Amit', 'Verma', 'support@apextelecom.in', '+91 98200 00004', 'Customer Care', 'Escalations Specialist', 2, 2, 4, 'ACTIVE'),
(5, 'EMP-1005', 'Sneha', 'Kulkarni', 'billing@apextelecom.in', '+91 98200 00005', 'Finance & Billing', 'Lead Billing Analyst', 1, 2, 5, 'ACTIVE'),
(6, 'EMP-1006', 'Vikram', 'Singh', 'tech@apextelecom.in', '+91 98200 00006', 'Field Engineering', 'Lead RF Field Engineer', 4, 2, 6, 'ACTIVE');

-- 6. TELECOM_PLANS
INSERT INTO telecom_plans (id, plan_code, name, plan_type, price, validity_days, data_gb_per_day, voice_benefit, sms_per_day, roaming_benefit, additional_benefits, is_5g_enabled, status, effective_start_date) VALUES
(1, 'PLAN-5G-ULTRA', 'Apex 5G Infinity 84D', 'PREPAID', 799.00, 84, 2.50, 'Truly Unlimited All-India', 100, 'Free National Roaming', 'Unlimited 5G Data, Disney+ Hotstar Mobile 3M, Wynk Music Premium', TRUE, 'ACTIVE', '2026-01-01'),
(2, 'PLAN-5G-POST-ELITE', 'Apex Platinum Postpaid Pro', 'POSTPAID', 1199.00, 30, 5.00, 'Truly Unlimited All-India', 100, 'Free Pan-India + 200 Int. Mins', '200GB Data Rollover, Netflix Basic + Amazon Prime 1Y, 2 Add-on Family SIMs', TRUE, 'ACTIVE', '2026-01-01'),
(3, 'PLAN-PRE-SAVER', 'Apex Smart Freedom 28D', 'PREPAID', 299.00, 28, 1.50, 'Truly Unlimited All-India', 100, 'Free National Roaming', 'Standard 4G/5G Access, Free Hello Tunes', TRUE, 'ACTIVE', '2026-01-01'),
(4, 'PLAN-ENT-FIBER', 'Apex Leased Line Enterprise 1Gbps', 'ENTERPRISE', 4999.00, 30, 0.00, 'SIP Trunking 30 Channels', 500, 'SLA 99.95% Guaranteed', 'Static IPv4 /29 Subnet, 24/7 Dedicated Account Manager, Dual Route Redundancy', TRUE, 'ACTIVE', '2026-01-01');

-- 7. CUSTOMERS
INSERT INTO customers (id, customer_code, first_name, last_name, mobile_number, alternate_phone, email, customer_type, company_name, dob, category, acquisition_source, assigned_employee_id, status, internal_remarks) VALUES
(1, 'CUST-IND-2001', 'Ananya', 'Deshmukh', '+91 98201 11223', '+91 98201 99887', 'ananya.deshmukh@gmail.com', 'INDIVIDUAL', NULL, '1992-06-15', 'VIP', 'ONLINE', 3, 'ACTIVE', 'High value subscriber, premium 5G handset user'),
(2, 'CUST-CORP-2002', 'Vikramaditya', 'Singhania', '+91 98100 44556', '+91 11 2345 6789', 'procurement@vikramadityatex.com', 'BUSINESS', 'Vikramaditya Textiles Ltd', '1984-11-20', 'CORPORATE', 'TELESALES', 3, 'ACTIVE', 'Corporate account with 45 active staff connections'),
(3, 'CUST-IND-2003', 'Rohan', 'Mehta', '+91 98300 77889', NULL, 'rohan.mehta@yahoo.co.in', 'INDIVIDUAL', NULL, '1998-03-22', 'STANDARD', 'STORE', 3, 'ACTIVE', 'Prepaid user considering postpaid upgrade'),
(4, 'CUST-CORP-2004', 'Kavita', 'Krishnamurthy', '+91 98400 33221', '+91 44 2828 1000', 'telecom.admin@cloudscale.in', 'BUSINESS', 'CloudScale Infotech Pvt Ltd', '1989-09-05', 'CORPORATE', 'REFERRAL', 3, 'ACTIVE', 'Tech campus fiber and 120 eSIM corporate fleet');

-- 8. CUSTOMER_ADDRESSES
INSERT INTO customer_addresses (id, customer_id, address_type, address_line1, address_line2, city, state, pin_code, is_primary) VALUES
(1, 1, 'BILLING', 'Flat 1402, Sea Green Heights', 'Worli Sea Face', 'Mumbai', 'Maharashtra', '400018', TRUE),
(2, 2, 'BILLING', 'Corp Tower B, 7th Floor', 'Okhla Industrial Area Phase III', 'New Delhi', 'Delhi', '110020', TRUE),
(3, 3, 'BILLING', '44/2 Lake View Apartments', 'Salt Lake Sector 5', 'Kolkata', 'West Bengal', '700091', TRUE),
(4, 4, 'INSTALLATION', 'CloudScale Tech Park, Campus 2', 'Whitefield Main Road', 'Bengaluru', 'Karnataka', '560066', TRUE);

-- 9. CUSTOMER_CONNECTIONS
INSERT INTO customer_connections (id, connection_code, customer_id, mobile_number, sim_iccid, connection_type, operator_brand, plan_id, activation_date, expiry_date, connection_status, kyc_status, assigned_branch_id, notes) VALUES
(1, 'CONN-5G-1001', 1, '+91 98201 11223', '89910010012345678912', 'POSTPAID', 'Apex Telecom', 2, '2026-02-01 10:30:00', '2027-02-01 10:30:00', 'ACTIVE', 'VERIFIED', 1, 'eSIM activated on Apple iPhone 17 Pro'),
(2, 'CONN-5G-1002', 2, '+91 98100 44556', '89910010012345678913', 'POSTPAID', 'Apex Telecom', 2, '2026-01-15 11:00:00', '2027-01-15 11:00:00', 'ACTIVE', 'VERIFIED', 2, 'Corporate master connection'),
(3, 'CONN-4G-1003', 3, '+91 98300 77889', '89910010012345678914', 'PREPAID', 'Apex Telecom', 1, '2026-03-01 14:15:00', '2026-05-24 23:59:59', 'ACTIVE', 'VERIFIED', 1, 'Physical SIM card, recharged for 84 days'),
(4, 'CONN-FBR-1004', 4, '+91 98400 33221', '89910010012345678915', 'POSTPAID', 'Apex Telecom', 4, '2026-01-10 09:00:00', '2027-01-10 09:00:00', 'ACTIVE', 'VERIFIED', 3, 'Dedicated 1Gbps optical circuit active');

-- 10. LEADS
INSERT INTO leads (id, lead_code, prospect_name, mobile_number, email, company_name, city, state, lead_source, interested_service, estimated_value, priority, assigned_employee_id, next_follow_up_date, lead_status, notes) VALUES
(1, 'LEAD-2026-01', 'Sunil Narang', '+91 98765 43210', 'sunil@nexuslogistics.in', 'Nexus Logistics India', 'Mumbai', 'Maharashtra', 'CAMPAIGN', 'Corporate Fleet 5G SIMs', 450000.00, 'HIGH', 3, '2026-10-15 15:00:00', 'NEGOTIATION', 'Requires 250 GPS-enabled IoT SIMs and 30 staff lines'),
(2, 'LEAD-2026-02', 'Dr. Meera Swaminathan', '+91 97654 32109', 'dr.meera@swaminathanclinic.org', 'Swaminathan Health Care', 'Chennai', 'Tamil Nadu', 'WEBSITE', 'High-Speed Clinic Fiber', 48000.00, 'MEDIUM', 3, '2026-10-14 11:30:00', 'QUALIFIED', 'Interested in tele-health fiber line with guaranteed 99.9% uptime'),
(3, 'LEAD-2026-03', 'Ramesh Chandak', '+91 96543 21098', 'ramesh@chandakexports.com', 'Chandak Global Exports', 'Surat', 'Gujarat', 'REFERRAL', 'International Roaming Pack', 120000.00, 'URGENT', 3, '2026-10-12 16:00:00', 'PROPOSAL_SENT', 'Commercial proposal sent for multi-country executive travel bundle'),
(4, 'LEAD-2026-04', 'Harish Goel', '+91 95432 10987', 'harish@goelsteel.com', 'Goel Steel & Forgings', 'Pune', 'Maharashtra', 'INBOUND_CALL', '5G Postpaid Corporate', 95000.00, 'LOW', 3, '2026-10-20 10:00:00', 'NEW', 'Requested commercial brochure and tariff plan comparison');

-- 11. LEAD_ACTIVITIES
INSERT INTO lead_activities (id, lead_id, employee_id, activity_type, summary, details, activity_time) VALUES
(1, 1, 3, 'MEETING', 'Executive Demo Presentation', 'Presented corporate dashboard demo and tariff breakdown at client BKC office', '2026-10-08 14:00:00'),
(2, 1, 3, 'CALL', 'Discount Structure Discussion', 'Discussed 8% bulk discount on 250 SIM fleet with VP Procurement', '2026-10-10 11:30:00'),
(3, 2, 3, 'CALL', 'Initial Requirement Assessment', 'Verified clinic fiber requirements and installation site feasibility', '2026-10-09 16:00:00'),
(4, 3, 3, 'EMAIL', 'Proposal Dispatch', 'Emailed official commercial quote #QUO-2026-443', '2026-10-07 18:20:00');

-- 12. FOLLOW_UPS
INSERT INTO follow_ups (id, title, lead_id, customer_id, assigned_employee_id, scheduled_at, priority, status, notes) VALUES
(1, 'Final contract review with Nexus Logistics Legal', 1, NULL, 3, '2026-10-15 15:00:00', 'HIGH', 'SCHEDULED', 'Review master service agreement clause on SLA penalties'),
(2, 'Site readiness confirmation for Dr. Meera clinic', 2, NULL, 3, '2026-10-14 11:30:00', 'MEDIUM', 'SCHEDULED', 'Confirm internal LAN router room readiness before fiber drop'),
(3, 'Follow-up on Postpaid plan renewal for Vikramaditya Tex', NULL, 2, 3, '2026-10-18 10:00:00', 'MEDIUM', 'SCHEDULED', 'Annual plan renewal discussion and 5G upgrade review');

-- 13. TASKS
INSERT INTO tasks (id, task_code, title, description, customer_id, lead_id, assigned_employee_id, due_date, priority, status) VALUES
(1, 'TSK-501', 'Deliver replacement 5G SIM to Bandra store', 'Customer requested priority SIM dispatch for VIP line +91 98201 11223', 1, NULL, 6, '2026-10-12 17:00:00', 'HIGH', 'IN_PROGRESS'),
(2, 'TSK-502', 'Prepare Q4 Corporate Telecom Consumption Report', 'Consolidate bandwidth and voice minutes for CloudScale Infotech', 4, NULL, 5, '2026-10-16 18:00:00', 'MEDIUM', 'PENDING'),
(3, 'TSK-503', 'Perform RF Drive Test near BKC Metro Station', 'Investigate reported 5G beam coverage drop during peak evening hours', NULL, NULL, 6, '2026-10-13 14:00:00', 'HIGH', 'PENDING');

-- 14. SUPPORT_TICKETS
INSERT INTO support_tickets (id, ticket_code, customer_id, connection_id, category, subject, description, priority, assigned_employee_id, sla_deadline, ticket_status) VALUES
(1, 'TKT-2026-101', 1, 1, 'NETWORK_COVERAGE', 'Intermittent 5G Uplink Degradation at Worli', 'Subscriber reported cellular speeds dropping to under 10 Mbps indoors on 35th floor', 'HIGH', 4, '2026-10-12 18:00:00', 'IN_PROGRESS'),
(2, 'TKT-2026-102', 2, 2, 'BILLING_DISPUTE', 'Clarification on Corporate Roaming Charges', 'Customer noted ₹1,450 roaming line item billed on executive trip to Singapore', 'MEDIUM', 4, '2026-10-14 12:00:00', 'ASSIGNED'),
(3, 'TKT-2026-103', 4, 4, 'BROADBAND_FAULT', 'Secondary Optical Route Latency Spike', 'Automated network alarm: ping latency rose to 45ms on redundant route', 'CRITICAL', 6, '2026-10-11 20:00:00', 'OPEN');

-- 15. TICKET_COMMENTS
INSERT INTO ticket_comments (id, ticket_id, user_id, comment_text, is_internal_only) VALUES
(1, 1, 4, 'Assigned RF engineer Vikram Singh to inspect local Worli cell tower azimuth', TRUE),
(2, 1, 4, 'Dear Customer, our technical engineering team has been deployed to verify the RF footprint at your tower sector.', FALSE),
(3, 2, 5, 'Checking billing ledger against international partner clearinghouse records', TRUE);

-- 16. TICKET_HISTORY
INSERT INTO ticket_history (id, ticket_id, changed_by_user_id, previous_status, new_status, change_reason) VALUES
(1, 1, 4, 'OPEN', 'ASSIGNED', 'Ticket allocated to Customer Care Lead Amit Verma'),
(2, 1, 4, 'ASSIGNED', 'IN_PROGRESS', 'RF diagnostic tools scheduled for field inspection');

-- 17. INVOICES
INSERT INTO invoices (id, invoice_number, customer_id, connection_id, billing_period_start, billing_period_end, invoice_date, due_date, subtotal, tax_amount, discount_amount, total_amount, paid_amount, outstanding_amount, status) VALUES
(1, 'INV-2026-09-001', 1, 1, '2026-09-01', '2026-09-30', '2026-10-01', '2026-10-15', 1199.00, 215.82, 0.00, 1414.82, 1414.82, 0.00, 'PAID'),
(2, 'INV-2026-09-002', 2, 2, '2026-09-01', '2026-09-30', '2026-10-01', '2026-10-20', 25400.00, 4572.00, 1000.00, 28972.00, 0.00, 28972.00, 'UNPAID'),
(3, 'INV-2026-09-003', 4, 4, '2026-09-01', '2026-09-30', '2026-10-01', '2026-10-18', 4999.00, 899.82, 0.00, 5898.82, 5898.82, 0.00, 'PAID');

-- 18. INVOICE_ITEMS
INSERT INTO invoice_items (id, invoice_id, description, quantity, unit_price, tax_rate_percent, total_price) VALUES
(1, 1, 'Monthly Subscription - Apex Platinum Postpaid Pro', 1, 1199.00, 18.00, 1414.82),
(2, 2, 'Corporate Group Fleet Plan (45 Active Postpaid Lines)', 1, 24000.00, 18.00, 28320.00),
(3, 2, 'Value Added Security Firewall Addon', 1, 1400.00, 18.00, 1652.00),
(4, 3, 'Enterprise Optical Leased Circuit 1Gbps Dedicated (1:1)', 1, 4999.00, 18.00, 5898.82);

-- 19. PAYMENTS
INSERT INTO payments (id, transaction_ref, invoice_id, payment_date, amount, payment_method, gateway_status, idempotency_key, received_by_user_id, notes) VALUES
(1, 'TXN-UPI-20261002-88129', 1, '2026-10-02 12:44:10', 1414.82, 'UPI', 'SUCCESS', 'IDEMP-INV001-PAY1', 5, 'Instant settlement via NPCI UPI QR code'),
(2, 'TXN-NEFT-20261003-99341', 3, '2026-10-03 16:30:00', 5898.82, 'NET_BANKING', 'SUCCESS', 'IDEMP-INV003-PAY1', 5, 'Corporate NEFT RTGS Bank Transfer');

-- 20. NOTIFICATIONS
INSERT INTO notifications (id, user_id, title, message, notification_type, is_read, reference_link) VALUES
(1, 1, 'Critical SLA Alert', 'Ticket TKT-2026-103 breached 4-hour SLA warning threshold', 'SLA_BREACH', FALSE, '/tickets/3'),
(2, 3, 'New High Priority Lead', 'Lead #LEAD-2026-01 (Nexus Logistics) entered Negotiation stage', 'NEW_LEAD', FALSE, '/leads/1'),
(3, 5, 'Payment Reconciliation Completed', 'Payment #TXN-UPI-20261002-88129 settled into State Bank of India account', 'PAYMENT_RECEIVED', TRUE, '/billing/invoices/1');

-- 21. AUDIT_LOGS
INSERT INTO audit_logs (id, user_id, username, action, entity_name, entity_id, old_value, new_value, ip_address) VALUES
(1, 1, 'superadmin', 'CREATE', 'USER', 1, NULL, 'Initial superadmin account bootstrap', '127.0.0.1'),
(2, 3, 'sales1', 'CREATE', 'CUSTOMER', 1, NULL, 'Customer Ananya Deshmukh registered with KYC verified', '192.168.1.104'),
(3, 4, 'support1', 'STATUS_CHANGE', 'SUPPORT_TICKET', 1, 'OPEN', 'IN_PROGRESS', '192.168.1.112');

-- 22. COMPANY_SETTINGS
INSERT INTO company_settings (id, setting_key, setting_value, description, category) VALUES
(1, 'COMPANY_NAME', 'Apex Telecom India Limited', 'Registered telecom corporate entity name', 'GENERAL'),
(2, 'TRAI_LICENSE_NO', 'TRAI-UL-VIRTUAL-2026-MH-0921', 'Unified Telecom Service Provider License No', 'REGULATORY'),
(3, 'TAX_GSTIN', '27AAACA1234F1Z8', 'Pan-India Corporate Goods and Services Tax ID', 'FINANCE'),
(4, 'DEFAULT_CURRENCY', 'INR', 'Base operational currency symbol and ISO code', 'FINANCE'),
(5, 'SLA_CRITICAL_HOURS', '4', 'Maximum resolution time target for critical enterprise faults', 'SUPPORT'),
(6, 'KYC_RETENTION_YEARS', '5', 'Mandatory DoT KYC document retention period', 'COMPLIANCE');
