# Apex Telecom Enterprise CRM System

> **A Secure, High-Performance, Cloud-Ready Customer Relationship Management Platform for Telecommunications Operators.** Built with **React 18 (Vite + Tailwind CSS)**, **Java 27 & Spring Boot 3.3.4**, and **MySQL 8.0 with Flyway Migrations**. Engineered for 50–100 concurrent internal enterprise operators, managers, executives, and field engineers.

---

## 1. System Overview & Key Highlights

Apex Telecom CRM is an enterprise-grade web application tailored for modern telecommunication companies. The system manages subscriber lifecycles, SIM and eSIM connections, telecom tariff plans, sales opportunities and conversion pipelines, customer complaint tickets with strict SLA tracking, 18% GST-compliant billing & invoices, circle branch operations, and management analytics.

- **Dual-Mode Persistence Architecture**: Out-of-the-box local development using zero-configuration in-memory H2 (with full MySQL compatibility dialect), and production-grade MySQL 8.0 with Flyway automated migrations (`V1` schema, `V2` seed data).
- **Stateless RBAC Security**: Spring Security with JWT tokens, BCrypt password hashing, and role-based authorization for 6 distinct enterprise roles.
- **Regulatory Compliance**: Tailored for Indian telecommunications standards, including **DoT (Department of Telecommunications)**, **TRAI** guidelines, and **DPDPA 2023 (Digital Personal Data Protection Act)** with PII data masking and 730-day immutable audit trails.
- **Fail-Safe Frontend Integration**: Reactive modern interface with dynamic Recharts visualizations, interactive Kanban lead pipeline, customizable data tables, and an integrated mock fallback engine enabling complete UI exploration even during backend maintenance.

---

## 2. Technology Stack

### Backend
- **Language**: Java 27 (`Oracle OpenJDK 27`, compiled with `--release 21` for maximum framework stability)
- **Framework**: Spring Boot 3.3.4
- **Security**: Spring Security, JWT (io.jsonwebtoken `0.11.5`), BCrypt
- **Persistence**: Spring Data JPA, Hibernate 6.x
- **Database**: MySQL 8.0 & H2 In-Memory (`dev` profile)
- **Migrations**: Flyway 10.x (`V1__init_schema.sql`, `V2__seed_data.sql`)
- **API Documentation**: Springdoc OpenAPI / Swagger UI 3 (OpenAPI 3.0)
- **Validation**: Jakarta Bean Validation (`@Valid`, `@NotNull`, `@Pattern`, `@Size`)

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom telecom navy/blue palette, responsive grid layouts, and glassmorphic badges
- **Routing**: React Router v6
- **Data Visualization**: Recharts (Area, Bar, Pie charts)
- **Icons**: Lucide React
- **HTTP Client**: Axios with automatic JWT interceptors and mock fallback

### DevOps & Cloud
- **Containers**: Docker Multi-stage builds (`Dockerfile.backend`, `Dockerfile.frontend`, `docker-compose.yml`)
- **Web Server**: Nginx Alpine reverse proxy
- **Cloud Infrastructure**: AWS S3 + CloudFront (Frontend), ALB + EC2 Graviton (Backend), Amazon RDS Multi-AZ MySQL, CloudWatch Logs

---

## 3. User Roles & Default Test Credentials

All pre-seeded test accounts use the default password: **`password123`**

| Role | Username | Password | Full Name | Permitted Scope & Modules |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin` | `password123` | Aakash Khurana (COO) | Complete system access, audit logs, branch & role assignments, global settings |
| **CRM Manager** | `manager_del` | `password123` | Priyanshu Sharma | Customers, leads, complaints, reports, employee re-assignments, performance monitoring |
| **Sales Executive** | `sales_exec1` | `password123` | Rohit Verma | Lead pipeline (Kanban), lead conversions, subscriber onboarding, follow-up calendar |
| **Customer Support** | `support_exec1` | `password123` | Ananya Sengupta | Complaints, SLA ticket queues, troubleshooting notes, ticket escalations |
| **Billing Executive** | `billing_exec1` | `password123` | Kavita Nair | Invoices, 18% GST calculation, verified payment recording, revenue reports |
| **Field Technician** | `field_tech1` | `password123` | Suresh Kumar | Field service requests, tower visits, installation/repair resolution notes |

---

## 4. Main CRM Modules

1. **Executive Dashboard**: Real-time KPI summary cards (Total Customers, Active SIMs, Leads, Tickets, Revenue, Outstanding), monthly subscriber growth area chart, circle revenue bar charts, and plan popularity pie chart.
2. **Customer Management**: Complete subscriber records with DoT-compliant KYC status, customer classification (Individual vs. Business), search by mobile or name, and PII masking.
3. **Connections & SIM/eSIM Management**: Connection activation/deactivation, SIM IMSI/ICCID references, renewal countdowns, and plan assignments.
4. **Telecom Plans Catalog**: 5G/4G prepaid and postpaid tariff plans with validity periods, data quotas, unlimited voice calling flags, and OTT bundles.
5. **Sales Leads & Opportunities**: Interactive drag-and-drop Kanban board and tabular views with 7 lifecycle stages (`NEW` → `CONTACTED` → `QUALIFIED` → `PROPOSAL_SENT` → `NEGOTIATION` → `CONVERTED` / `LOST`), plus instant 1-click conversion to customer records.
6. **Customer Complaints & SLA Ticket Management**: Automated ticket ID generation (`TKT-2026-XXXX`), SLA breach timers, category classification (Network, Billing, SIM, Broadband), escalation workflows, and internal/public notes.
7. **Follow-ups & Task Management**: Calendar tracking for sales calls, KYC visits, tower maintenance, priority badges, and overdue alerts.
8. **Billing & Invoicing**: Automated invoice generation, 18% GST (9% CGST + 9% SGST) breakdown, partial and complete payment capture, payment idempotency tracking, and printable PDF statements.
9. **Employees & Circle Branches**: Multi-circle branch tracking (Delhi NCR, Mumbai West, Karnataka Bangalore, etc.), designation hierarchy, and sales target tracking.
10. **Reports & Analytics**: Tabular and graphical reports for Customer Registration, Lead Conversion, Circle Revenue, and SLA Compliance with instant CSV export.
11. **Settings & DoT/TRAI Compliance**: System parameters, DPDPA data retention controls, SMS gateway configurations, and audit trail viewing.

---

## 5. Quick Start (Run Locally)

### Prerequisites
- **Java**: JDK 21 or Java 27 (`java -version`)
- **Maven**: Version 3.8+ (`mvn -version`)
- **Node.js**: Version 18+ or 20+ (`node -v`)
- **MySQL**: (Optional for local testing; default `dev` profile uses H2 in-memory)

---

### Method A: Running Backend (Spring Boot)

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Run unit and integration tests (Verifies Flyway schema & database logic)
mvn test

# 3. Launch the Spring Boot development server (Starts on port 8080 with H2 dev profile)
mvn spring-boot:run
```

*The backend starts at `http://localhost:8080`.*
- **Swagger / OpenAPI Documentation**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON Spec**: `http://localhost:8080/v3/api-docs`
- **H2 Database Console**: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:telecom_crm;DB_CLOSE_DELAY=-1;MODE=MySQL`, User: `sa`, Password: *blank*)

---

### Method B: Running Frontend (React Vite)

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies (if not already installed)
npm install

# 3. Start Vite development server
npm run dev
```

*The frontend opens at `http://localhost:5173`.*

---

### Method C: Running Complete Stack with Docker Compose

To launch the full production-like environment with MySQL 8.0, Spring Boot, and Nginx in Docker:

```bash
# From the project root (where docker/ is located):
docker compose -f docker/docker-compose.yml up --build -d
```

- **Frontend Application**: `http://localhost:80`
- **Backend API**: `http://localhost:8080/api/v1`
- **Swagger Documentation**: `http://localhost:80/swagger-ui/index.html`

To stop and remove containers:
```bash
docker compose -f docker/docker-compose.yml down -v
```

---

## 6. IDE Setup Guide

### Running in IntelliJ IDEA
1. Open IntelliJ IDEA -> `File` -> `Open...` -> Select `d:/ATC_CRM`.
2. IntelliJ will detect both `backend` (Maven) and `frontend` (Node.js).
3. Under **Project Structure** -> **Project SDK**, select your installed **JDK 21 or JDK 27**.
4. Open [backend/src/main/java/com/telecom/crm/TelecomCrmApplication.java](file:///d:/ATC_CRM/backend/src/main/java/com/telecom/crm/TelecomCrmApplication.java).
5. Right-click and choose **Run 'TelecomCrmApplication'**.
6. For frontend: Open the built-in terminal, run `cd frontend && npm run dev`.

### Running in Eclipse IDE
1. Open Eclipse -> `File` -> `Import...` -> `Existing Maven Projects`.
2. Select root directory `d:/ATC_CRM/backend` and finish import.
3. Ensure installed JRE is configured to Java 21 or 27 (`Window` -> `Preferences` -> `Java` -> `Installed JREs`).
4. Right-click project `backend` -> `Run As` -> `Spring Boot App` (or `Java Application` -> `TelecomCrmApplication`).

### Running in Visual Studio Code
1. Open VS Code in `d:/ATC_CRM`.
2. Recommended extensions:
   - *Extension Pack for Java* (Microsoft)
   - *Spring Boot Extension Pack* (VMware)
   - *Tailwind CSS IntelliSense*
3. Press `F5` or click **Run Java** on `TelecomCrmApplication.java`.
4. Open a split terminal in VS Code and run `cd frontend && npm run dev`.

---

## 7. REST API Endpoints Reference

All endpoints are prefixed with `/api/v1`:

### Authentication (`/api/v1/auth`)
- `POST /auth/login` — Authenticate and receive JWT Bearer token
- `POST /auth/refresh` — Refresh access token
- `POST /auth/logout` — Invalidate user session

### Customers (`/api/v1/customers`)
- `GET /customers` — Paginated list of subscribers with query filters
- `GET /customers/{id}` — Detailed customer profile with KYC & circle metadata
- `POST /customers` — Register new customer record
- `PUT /customers/{id}` — Update existing customer profile
- `PATCH /customers/{id}/status` — Activate/Suspend/Archive customer status

### Telecom Connections & Plans (`/api/v1/connections`, `/api/v1/plans`)
- `GET /connections` — List subscriber SIM/eSIM connections
- `POST /connections` — Provision and activate new telecom connection
- `PATCH /connections/{id}/status` — Change SIM status (ACTIVE, SUSPENDED, DEACTIVATED)
- `GET /plans` — List active 4G/5G tariff plans
- `POST /plans` — Create new tariff plan (Admin only)

### Sales Leads (`/api/v1/leads`)
- `GET /leads` — List leads with status, source, and sales executive filters
- `POST /leads` — Create new sales prospect
- `PUT /leads/{id}` — Update lead details and stage
- `POST /leads/{id}/activities` — Record call/meeting activity
- `POST /leads/{id}/convert` — Convert qualified lead directly into customer record

### Support Tickets (`/api/v1/tickets`)
- `GET /tickets` — List customer complaint tickets
- `POST /tickets` — Create new complaint ticket
- `PATCH /tickets/{id}/assign` — Assign ticket to support executive
- `PATCH /tickets/{id}/status` — Update ticket progress (IN_PROGRESS, RESOLVED, CLOSED)
- `POST /tickets/{id}/comments` — Add internal note or customer comment

### Billing & Payments (`/api/v1/invoices`, `/api/v1/payments`)
- `GET /invoices` — List invoices with payment status filter
- `POST /invoices` — Generate new 18% GST telecom invoice
- `GET /payments` — View payment transaction history
- `POST /payments` — Record verified payment against an invoice

### Dashboard & Analytics (`/api/v1/dashboard`, `/api/v1/reports`)
- `GET /dashboard/summary` — Key KPI metrics and summary figures
- `GET /dashboard/sales` — Sales pipeline performance metrics
- `GET /dashboard/support` — Complaint resolution and SLA metrics
- `GET /reports/customer-registration` — Customer acquisition report
- `GET /reports/revenue` — Circle revenue breakdown

### Public Website & Portal Integration (`/api/v1/public/website`)
- `POST /public/website/inquiry` — Inbound webhook for external marketing websites to submit leads
- `GET /public/website/plans` — Live 5G/4G tariff plans catalog for public website display
- `GET /public/website/ticket-status/{ticketCode}` — Subscriber self-care ticket tracking
- **Full Guide**: See [docs/WEBSITE_INTEGRATION_GUIDE.md](file:///d:/ATC_CRM/docs/WEBSITE_INTEGRATION_GUIDE.md) for copy-paste HTML widgets and reverse proxy instructions.

---

## 8. Database Architecture

The normalized schema comprises 22 tables managed through Flyway versioned scripts:

- **Entity Documentation**: See [docs/ER_DIAGRAM.md](file:///d:/ATC_CRM/docs/ER_DIAGRAM.md) for Mermaid diagrams and data dictionary.
- **Migration Scripts**:
  - `V1__init_schema.sql`: Full DDL defining 22 tables, foreign keys, indexes, and constraints.
  - `V2__seed_data.sql`: Seed data for telecom plans, branch circles, default users, test subscribers, and realistic mock records.

---

## 9. AWS Cloud Deployment & Production Operations

- **Production Cloud Architecture Guide**: Refer to [`docs/AWS_DEPLOYMENT.md`](file:///d:/ATC_CRM/docs/AWS_DEPLOYMENT.md) for full architecture details, cost analysis, and disaster recovery plans.
- **Terraform Infrastructure as Code**: Complete IaC provisioner in [`aws/terraform/`](file:///d:/ATC_CRM/aws/terraform) (VPC, Multi-AZ RDS MySQL, EC2 Graviton ASG, ALB, S3, CloudFront OAC, CloudWatch).
- **Turnkey Deployment Scripts**:
  - Full-Stack Deploy: `.\aws\scripts\deploy-all.ps1` (or `bash aws/scripts/deploy-all.sh`)
  - Backend Only: `.\aws\scripts\deploy-backend.ps1` (or `bash aws/scripts/deploy-backend.sh`)
  - Frontend Only: `.\aws\scripts\deploy-frontend.ps1` (or `bash aws/scripts/deploy-frontend.sh`)
- **Automated CI/CD**: Production pipeline configured in [`.github/workflows/aws-deploy.yml`](file:///d:/ATC_CRM/.github/workflows/aws-deploy.yml) for automated testing, S3 upload, CloudFront invalidation, and zero-downtime ASG rolling refresh.
- **Topology**: React SPA on S3 + CloudFront; Spring Boot on multi-AZ EC2 Graviton behind an Application Load Balancer; Amazon RDS MySQL 8.0 Multi-AZ in isolated private subnets.
- **Estimated Monthly Cost (in INR)**: **₹23,359 / month (~$276.45 USD)** covering high availability, automated daily backups, 730-day regulatory audit logs, and sub-second failover.

---

## 10. License & Maintenance

Developed for telecommunication network operators. Complies with industry security standards and regional telecom regulations.
