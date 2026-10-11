# Entity Relationship (ER) Diagram & Data Dictionary

## 1. Relational Database Overview

The Telecom CRM uses a normalized (3NF) relational design designed for high data integrity, strict auditability, and fast search indexing across millions of subscriber rows.

The schema spans 22 distinct tables:
1. `users` — System logins & authentication credentials
2. `roles` — RBAC permission groups
3. `user_roles` — Many-to-many role mappings
4. `branches` — Telecom regional circles and service offices
5. `employees` — Staff directory with manager hierarchy
6. `customers` — Subscribers (Individual & Enterprise)
7. `customer_addresses` — Billing and installation addresses
8. `telecom_plans` — Product catalog (prepaid/postpaid tariffs)
9. `customer_connections` — Subscribed MSISDN numbers, SIM/eSIM references, KYC status
10. `leads` — Prospective sales leads & deals
11. `lead_activities` — Interaction logs for leads
12. `follow_ups` — Scheduled meetings and call reminders
13. `tasks` — Work assignments and internal to-dos
14. `support_tickets` — Customer complaints and technical service requests
15. `ticket_comments` — Internal notes and customer-visible comments
16. `ticket_history` — Status transitions and SLA timestamps
17. `invoices` — Billing statements and balances
18. `invoice_items` — Itemized charges and taxes
19. `payments` — Transaction logs and gateway receipts
20. `notifications` — In-app alerts and notifications
21. `audit_logs` — Immutable regulatory audit trail
22. `company_settings` — Tenant configuration and parameters

---

## 2. Mermaid Entity-Relationship Diagram

```mermaid
erDiagram
    ROLES ||--o{ USER_ROLES : "assigned to"
    USERS ||--o{ USER_ROLES : "has"
    USERS ||--o| EMPLOYEES : "associated with"
    BRANCHES ||--o{ EMPLOYEES : "employs"
    BRANCHES ||--o{ CUSTOMER_CONNECTIONS : "services"

    EMPLOYEES ||--o{ CUSTOMERS : "manages/assigned"
    EMPLOYEES ||--o{ LEADS : "owns"
    EMPLOYEES ||--o{ TASKS : "assigned to"
    EMPLOYEES ||--o{ SUPPORT_TICKETS : "assigned technician"
    EMPLOYEES ||--o{ FOLLOW_UPS : "performs"

    CUSTOMERS ||--o{ CUSTOMER_ADDRESSES : "has"
    CUSTOMERS ||--o{ CUSTOMER_CONNECTIONS : "owns"
    CUSTOMERS ||--o{ SUPPORT_TICKETS : "raises"
    CUSTOMERS ||--o{ INVOICES : "billed to"

    TELECOM_PLANS ||--o{ CUSTOMER_CONNECTIONS : "applied on"
    CUSTOMER_CONNECTIONS ||--o{ SUPPORT_TICKETS : "concerns"

    LEADS ||--o{ LEAD_ACTIVITIES : "has logs"
    LEADS ||--o{ FOLLOW_UPS : "schedules"
    LEADS ||--o| CUSTOMERS : "converted into"

    SUPPORT_TICKETS ||--o{ TICKET_COMMENTS : "contains"
    SUPPORT_TICKETS ||--o{ TICKET_HISTORY : "tracks"

    INVOICES ||--o{ INVOICE_ITEMS : "details"
    INVOICES ||--o{ PAYMENTS : "settled via"

    USERS ||--o{ AUDIT_LOGS : "triggered by"
    USERS ||--o{ NOTIFICATIONS : "receives"

    USERS {
        bigint id PK
        varchar username UK
        varchar password_hash
        varchar email UK
        boolean is_active
        datetime last_login_at
        datetime created_at
        datetime updated_at
    }

    ROLES {
        bigint id PK
        varchar name UK
        varchar description
    }

    EMPLOYEES {
        bigint id PK
        varchar employee_code UK
        varchar first_name
        varchar last_name
        varchar email UK
        varchar phone
        varchar department
        varchar designation
        bigint branch_id FK
        bigint manager_id FK
        bigint user_id FK
        varchar status
        datetime created_at
    }

    BRANCHES {
        bigint id PK
        varchar branch_code UK
        varchar name
        varchar city
        varchar state
        varchar pin_code
        varchar contact_phone
        varchar status
    }

    CUSTOMERS {
        bigint id PK
        varchar customer_code UK
        varchar first_name
        varchar last_name
        varchar mobile_number
        varchar email
        varchar customer_type
        varchar company_name
        date dob
        varchar category
        varchar acquisition_source
        bigint assigned_employee_id FK
        varchar status
        datetime registered_at
    }

    CUSTOMER_CONNECTIONS {
        bigint id PK
        varchar connection_code UK
        bigint customer_id FK
        varchar mobile_number UK
        varchar sim_iccid UK
        varchar connection_type
        varchar operator_brand
        bigint plan_id FK
        datetime activation_date
        datetime expiry_date
        varchar connection_status
        varchar kyc_status
        bigint branch_id FK
    }

    TELECOM_PLANS {
        bigint id PK
        varchar plan_code UK
        varchar name
        varchar plan_type
        decimal price
        int validity_days
        decimal data_gb_per_day
        varchar voice_benefit
        int sms_per_day
        boolean is_5g_enabled
        varchar status
    }

    LEADS {
        bigint id PK
        varchar lead_code UK
        varchar prospect_name
        varchar mobile_number
        varchar email
        varchar company_name
        varchar lead_source
        varchar interested_service
        decimal estimated_value
        varchar priority
        bigint assigned_employee_id FK
        datetime next_follow_up_date
        varchar lead_status
        varchar lost_reason
    }

    SUPPORT_TICKETS {
        bigint id PK
        varchar ticket_code UK
        bigint customer_id FK
        bigint connection_id FK
        varchar category
        varchar subject
        text description
        varchar priority
        bigint assigned_employee_id FK
        datetime sla_deadline
        varchar ticket_status
        text resolution_notes
        datetime closed_at
    }

    INVOICES {
        bigint id PK
        varchar invoice_number UK
        bigint customer_id FK
        date invoice_date
        date due_date
        decimal subtotal
        decimal tax_amount
        decimal discount_amount
        decimal total_amount
        decimal paid_amount
        decimal outstanding_amount
        varchar status
    }

    PAYMENTS {
        bigint id PK
        varchar transaction_ref UK
        bigint invoice_id FK
        datetime payment_date
        decimal amount
        varchar payment_method
        varchar gateway_status
        varchar idempotency_key UK
    }

    AUDIT_LOGS {
        bigint id PK
        bigint user_id FK
        varchar action
        varchar entity_name
        bigint entity_id
        text old_value
        text new_value
        varchar ip_address
        datetime created_at
    }
```

---

## 3. High-Performance Indexing Strategy

To guarantee rapid queries for 50–100 concurrent operators, the following composite and single-column indexes are defined in migration scripts:

| Table | Index Columns | Purpose |
| :--- | :--- | :--- |
| `customers` | `mobile_number`, `status` | Lightning-fast caller lookup during customer contact |
| `customer_connections` | `mobile_number`, `sim_iccid` | Instant SIM activation / lifecycle validation |
| `leads` | `assigned_employee_id`, `lead_status` | Sales executive pipeline filtering & Kanban load |
| `support_tickets` | `ticket_status`, `assigned_employee_id`, `sla_deadline` | Real-time SLA breach alarms and desk triage |
| `invoices` | `customer_id`, `status`, `due_date` | Dunning and accounts-receivable reports |
| `payments` | `invoice_id`, `idempotency_key` | Duplicate charge prevention and audit verification |
| `audit_logs` | `entity_name`, `entity_id`, `created_at` | Rapid regulatory inspection trail retrieval |
