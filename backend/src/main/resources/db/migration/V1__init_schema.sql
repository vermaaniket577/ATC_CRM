-- ==============================================================================
-- Flyway Migration V1: Complete Telecom CRM Schema (22 Tables)
-- Compatible with MySQL 8.x and H2 2.x
-- ==============================================================================

-- 1. ROLES
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. USERS
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. USER_ROLES
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
);

-- 4. BRANCHES
CREATE TABLE IF NOT EXISTS branches (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    address_line VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pin_code VARCHAR(20) NOT NULL,
    contact_phone VARCHAR(30),
    contact_email VARCHAR(150),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. EMPLOYEES
CREATE TABLE IF NOT EXISTS employees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_code VARCHAR(30) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    work_email VARCHAR(150) NOT NULL UNIQUE,
    work_phone VARCHAR(30) NOT NULL,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    branch_id BIGINT,
    manager_id BIGINT,
    user_id BIGINT UNIQUE,
    employment_status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_emp_branch FOREIGN KEY (branch_id) REFERENCES branches (id) ON DELETE SET NULL,
    CONSTRAINT fk_emp_manager FOREIGN KEY (manager_id) REFERENCES employees (id) ON DELETE SET NULL,
    CONSTRAINT fk_emp_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);

-- 6. CUSTOMERS
CREATE TABLE IF NOT EXISTS customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_code VARCHAR(30) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    mobile_number VARCHAR(30) NOT NULL,
    alternate_phone VARCHAR(30),
    email VARCHAR(150),
    customer_type VARCHAR(30) NOT NULL DEFAULT 'INDIVIDUAL', -- INDIVIDUAL, BUSINESS
    company_name VARCHAR(200),
    dob DATE,
    category VARCHAR(50) DEFAULT 'STANDARD', -- VIP, STANDARD, CORPORATE
    acquisition_source VARCHAR(50), -- ONLINE, STORE, TELESALES, REFERRAL
    assigned_employee_id BIGINT,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, SUSPENDED, ARCHIVED
    internal_remarks VARCHAR(500),
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cust_emp FOREIGN KEY (assigned_employee_id) REFERENCES employees (id) ON DELETE SET NULL
);

-- 7. CUSTOMER_ADDRESSES
CREATE TABLE IF NOT EXISTS customer_addresses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    address_type VARCHAR(30) NOT NULL DEFAULT 'BILLING', -- BILLING, INSTALLATION, PERMANENT
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pin_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    is_primary BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_addr_cust FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
);

-- 8. TELECOM_PLANS
CREATE TABLE IF NOT EXISTS telecom_plans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    plan_code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    plan_type VARCHAR(30) NOT NULL, -- PREPAID, POSTPAID, ENTERPRISE, FIBER
    price DECIMAL(10, 2) NOT NULL,
    validity_days INT NOT NULL,
    data_gb_per_day DECIMAL(6, 2) DEFAULT 0.00,
    voice_benefit VARCHAR(100) DEFAULT 'Truly Unlimited',
    sms_per_day INT DEFAULT 100,
    roaming_benefit VARCHAR(100) DEFAULT 'Free National Roaming',
    additional_benefits VARCHAR(500),
    is_5g_enabled BOOLEAN DEFAULT TRUE,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, RETIRED
    effective_start_date DATE NOT NULL,
    effective_end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. CUSTOMER_CONNECTIONS
CREATE TABLE IF NOT EXISTS customer_connections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    connection_code VARCHAR(30) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    mobile_number VARCHAR(30) NOT NULL UNIQUE,
    sim_iccid VARCHAR(50) NOT NULL UNIQUE,
    connection_type VARCHAR(30) NOT NULL, -- PREPAID, POSTPAID
    operator_brand VARCHAR(50) NOT NULL DEFAULT 'Apex Telecom',
    plan_id BIGINT,
    activation_date TIMESTAMP NULL,
    expiry_date TIMESTAMP NULL,
    connection_status VARCHAR(30) NOT NULL DEFAULT 'PENDING_ACTIVATION', -- PENDING_ACTIVATION, ACTIVE, SUSPENDED, DEACTIVATED
    kyc_status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- PENDING, VERIFIED, REJECTED
    assigned_branch_id BIGINT,
    notes VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_conn_cust FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE RESTRICT,
    CONSTRAINT fk_conn_plan FOREIGN KEY (plan_id) REFERENCES telecom_plans (id) ON DELETE SET NULL,
    CONSTRAINT fk_conn_branch FOREIGN KEY (assigned_branch_id) REFERENCES branches (id) ON DELETE SET NULL
);

-- 10. LEADS
CREATE TABLE IF NOT EXISTS leads (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lead_code VARCHAR(30) NOT NULL UNIQUE,
    prospect_name VARCHAR(150) NOT NULL,
    mobile_number VARCHAR(30) NOT NULL,
    email VARCHAR(150),
    company_name VARCHAR(200),
    city VARCHAR(100),
    state VARCHAR(100),
    lead_source VARCHAR(50) NOT NULL, -- WEBSITE, REFERRAL, INBOUND_CALL, CAMPAIGN
    interested_service VARCHAR(100), -- 5G_POSTPAID, ENTERPRISE_LEASED_LINE, CORPORATE_FLEET
    estimated_value DECIMAL(12, 2) DEFAULT 0.00,
    priority VARCHAR(30) NOT NULL DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, URGENT
    assigned_employee_id BIGINT,
    next_follow_up_date TIMESTAMP NULL,
    lead_status VARCHAR(30) NOT NULL DEFAULT 'NEW', -- NEW, CONTACTED, QUALIFIED, PROPOSAL_SENT, NEGOTIATION, CONVERTED, LOST
    lost_reason VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_lead_emp FOREIGN KEY (assigned_employee_id) REFERENCES employees (id) ON DELETE SET NULL
);

-- 11. LEAD_ACTIVITIES
CREATE TABLE IF NOT EXISTS lead_activities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lead_id BIGINT NOT NULL,
    employee_id BIGINT,
    activity_type VARCHAR(50) NOT NULL, -- CALL, EMAIL, MEETING, DEMO, NOTE
    summary VARCHAR(255) NOT NULL,
    details TEXT,
    activity_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_lact_lead FOREIGN KEY (lead_id) REFERENCES leads (id) ON DELETE CASCADE,
    CONSTRAINT fk_lact_emp FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE SET NULL
);

-- 12. FOLLOW_UPS
CREATE TABLE IF NOT EXISTS follow_ups (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    lead_id BIGINT,
    customer_id BIGINT,
    assigned_employee_id BIGINT NOT NULL,
    scheduled_at TIMESTAMP NOT NULL,
    priority VARCHAR(30) DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH
    status VARCHAR(30) DEFAULT 'SCHEDULED', -- SCHEDULED, COMPLETED, CANCELLED, OVERDUE
    notes TEXT,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fol_lead FOREIGN KEY (lead_id) REFERENCES leads (id) ON DELETE CASCADE,
    CONSTRAINT fk_fol_cust FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE,
    CONSTRAINT fk_fol_emp FOREIGN KEY (assigned_employee_id) REFERENCES employees (id) ON DELETE RESTRICT
);

-- 13. TASKS
CREATE TABLE IF NOT EXISTS tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    task_code VARCHAR(30) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    customer_id BIGINT,
    lead_id BIGINT,
    assigned_employee_id BIGINT NOT NULL,
    due_date TIMESTAMP NOT NULL,
    priority VARCHAR(30) DEFAULT 'MEDIUM',
    status VARCHAR(30) DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, COMPLETED, CANCELLED
    notes TEXT,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_task_cust FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE SET NULL,
    CONSTRAINT fk_task_lead FOREIGN KEY (lead_id) REFERENCES leads (id) ON DELETE SET NULL,
    CONSTRAINT fk_task_emp FOREIGN KEY (assigned_employee_id) REFERENCES employees (id) ON DELETE RESTRICT
);

-- 14. SUPPORT_TICKETS
CREATE TABLE IF NOT EXISTS support_tickets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_code VARCHAR(30) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    connection_id BIGINT,
    category VARCHAR(50) NOT NULL, -- NETWORK_COVERAGE, BILLING_DISPUTE, SIM_SWAP, BROADBAND_FAULT, GENERAL_QUERY
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(30) NOT NULL DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, CRITICAL
    assigned_employee_id BIGINT,
    sla_deadline TIMESTAMP NOT NULL,
    ticket_status VARCHAR(30) NOT NULL DEFAULT 'OPEN', -- OPEN, ASSIGNED, IN_PROGRESS, WAITING_FOR_CUSTOMER, ESCALATED, RESOLVED, CLOSED
    resolution_notes TEXT,
    closure_date TIMESTAMP NULL,
    customer_feedback_rating INT,
    customer_feedback_comments VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tkt_cust FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE RESTRICT,
    CONSTRAINT fk_tkt_conn FOREIGN KEY (connection_id) REFERENCES customer_connections (id) ON DELETE SET NULL,
    CONSTRAINT fk_tkt_emp FOREIGN KEY (assigned_employee_id) REFERENCES employees (id) ON DELETE SET NULL
);

-- 15. TICKET_COMMENTS
CREATE TABLE IF NOT EXISTS ticket_comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    comment_text TEXT NOT NULL,
    is_internal_only BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tcom_tkt FOREIGN KEY (ticket_id) REFERENCES support_tickets (id) ON DELETE CASCADE,
    CONSTRAINT fk_tcom_usr FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT
);

-- 16. TICKET_HISTORY
CREATE TABLE IF NOT EXISTS ticket_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_id BIGINT NOT NULL,
    changed_by_user_id BIGINT,
    previous_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    change_reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_thist_tkt FOREIGN KEY (ticket_id) REFERENCES support_tickets (id) ON DELETE CASCADE,
    CONSTRAINT fk_thist_usr FOREIGN KEY (changed_by_user_id) REFERENCES users (id) ON DELETE SET NULL
);

-- 17. INVOICES
CREATE TABLE IF NOT EXISTS invoices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    connection_id BIGINT,
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    discount_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    paid_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    outstanding_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(30) NOT NULL DEFAULT 'UNPAID', -- UNPAID, PARTIALLY_PAID, PAID, OVERDUE, CANCELLED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inv_cust FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE RESTRICT,
    CONSTRAINT fk_inv_conn FOREIGN KEY (connection_id) REFERENCES customer_connections (id) ON DELETE SET NULL
);

-- 18. INVOICE_ITEMS
CREATE TABLE IF NOT EXISTS invoice_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT NOT NULL,
    description VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    tax_rate_percent DECIMAL(5, 2) NOT NULL DEFAULT 18.00, -- GST standard
    total_price DECIMAL(12, 2) NOT NULL,
    CONSTRAINT fk_item_inv FOREIGN KEY (invoice_id) REFERENCES invoices (id) ON DELETE CASCADE
);

-- 19. PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_ref VARCHAR(100) NOT NULL UNIQUE,
    invoice_id BIGINT NOT NULL,
    payment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- UPI, CREDIT_CARD, DEBIT_CARD, NET_BANKING, CASH_COUNTER, CHEQUE
    gateway_status VARCHAR(30) NOT NULL DEFAULT 'SUCCESS', -- SUCCESS, PENDING, FAILED, REFUNDED
    idempotency_key VARCHAR(100) UNIQUE,
    gateway_response_code VARCHAR(100),
    received_by_user_id BIGINT,
    notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pay_inv FOREIGN KEY (invoice_id) REFERENCES invoices (id) ON DELETE RESTRICT,
    CONSTRAINT fk_pay_usr FOREIGN KEY (received_by_user_id) REFERENCES users (id) ON DELETE SET NULL
);

-- 20. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL, -- SLA_BREACH, NEW_LEAD, TICKET_ASSIGNED, PAYMENT_RECEIVED, SYSTEM
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    reference_link VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_usr FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- 21. AUDIT_LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    username VARCHAR(100),
    action VARCHAR(100) NOT NULL, -- CREATE, UPDATE, DELETE, STATUS_CHANGE, KYC_VERIFY, SIM_SWAP
    entity_name VARCHAR(100) NOT NULL,
    entity_id BIGINT,
    old_value TEXT,
    new_value TEXT,
    ip_address VARCHAR(50),
    user_agent VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 22. COMPANY_SETTINGS
CREATE TABLE IF NOT EXISTS company_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value VARCHAR(500) NOT NULL,
    description VARCHAR(255),
    category VARCHAR(50) DEFAULT 'GENERAL',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- INDEX DEFINITIONS (Optimized for 50-100 Concurrent Telecom Operators)
-- ==============================================================================

CREATE INDEX idx_customers_mobile ON customers(mobile_number);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_type ON customers(customer_type);
CREATE INDEX idx_connections_mobile ON customer_connections(mobile_number);
CREATE INDEX idx_connections_iccid ON customer_connections(sim_iccid);
CREATE INDEX idx_connections_status ON customer_connections(connection_status);
CREATE INDEX idx_leads_status ON leads(lead_status);
CREATE INDEX idx_leads_employee ON leads(assigned_employee_id);
CREATE INDEX idx_tickets_status ON support_tickets(ticket_status);
CREATE INDEX idx_tickets_employee ON support_tickets(assigned_employee_id);
CREATE INDEX idx_tickets_sla ON support_tickets(sla_deadline);
CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due ON invoices(due_date);
CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_name, entity_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);
CREATE INDEX idx_notif_user_read ON notifications(user_id, is_read);
