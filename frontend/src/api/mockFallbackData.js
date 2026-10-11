export const mockDashboardData = {
  totalCustomers: 5420,
  activeConnections: 5180,
  newLeads: 48,
  convertedLeads: 126,
  pendingFollowUps: 14,
  openComplaints: 23,
  resolvedComplaints: 184,
  overdueInvoices: 38,
  totalBilledAmount: 3640000.00,
  paymentsReceived: 3420000.00,
  outstandingAmount: 220000.00,
  monthlyRegistrations: [
    { month: "May 2026", customers: 410, connections: 480 },
    { month: "Jun 2026", customers: 580, connections: 640 },
    { month: "Jul 2026", customers: 720, connections: 810 },
    { month: "Aug 2026", customers: 890, connections: 980 },
    { month: "Sep 2026", customers: 1120, connections: 1250 },
    { month: "Oct 2026", customers: 1450, connections: 1610 }
  ],
  leadsByStatus: [
    { status: "New", count: 48 },
    { status: "Contacted", count: 62 },
    { status: "Qualified", count: 35 },
    { status: "Proposal Sent", count: 28 },
    { status: "Negotiation", count: 19 },
    { status: "Converted", count: 126 },
    { status: "Lost", count: 15 }
  ],
  complaintsByCategory: [
    { category: "Network & 5G Coverage", count: 42, color: "#2563EB" },
    { category: "Billing & Tariffs", count: 28, color: "#F59E0B" },
    { category: "SIM & eSIM Swap", count: 19, color: "#10B981" },
    { category: "Optical Fiber Fault", count: 15, color: "#EF4444" },
    { category: "General Inquiries", count: 11, color: "#8B5CF6" }
  ],
  monthlyRevenue: [
    { month: "May", billed: 22.5, collected: 21.0 },
    { month: "Jun", billed: 25.8, collected: 24.2 },
    { month: "Jul", billed: 28.4, collected: 27.5 },
    { month: "Aug", billed: 31.2, collected: 29.8 },
    { month: "Sep", billed: 34.6, collected: 32.9 },
    { month: "Oct", billed: 36.4, collected: 34.2 }
  ],
  planPopularity: [
    { plan: "Apex 5G Infinity 84D", subscribers: 1840, type: "PREPAID" },
    { plan: "Apex Platinum Postpaid Pro", subscribers: 1420, type: "POSTPAID" },
    { plan: "Apex Smart Freedom 28D", subscribers: 980, type: "PREPAID" },
    { plan: "Apex Leased Line Enterprise", subscribers: 340, type: "ENTERPRISE" }
  ],
  salesByExecutive: [
    { name: "Priya Nair", converted: 48, pipelineValue: 1850000 },
    { name: "Ravi Shankar", converted: 39, pipelineValue: 1420000 },
    { name: "Meenakshi Sundaram", converted: 31, pipelineValue: 1180000 },
    { name: "Kunal Kapoor", converted: 26, pipelineValue: 890000 }
  ]
};

export const mockCustomers = [
  {
    id: 1,
    customerCode: "CUST-IND-2001",
    firstName: "Ananya",
    lastName: "Deshmukh",
    fullName: "Ananya Deshmukh",
    mobileNumber: "+91 98201 11223",
    alternatePhone: "+91 98201 99887",
    email: "ananya.deshmukh@gmail.com",
    customerType: "INDIVIDUAL",
    category: "VIP",
    acquisitionSource: "ONLINE",
    status: "ACTIVE",
    registeredAt: "2026-02-01T10:30:00",
    primaryAddress: "Flat 1402, Sea Green Heights, Worli Sea Face, Mumbai - 400018",
    assignedEmployeeName: "Priya Nair"
  },
  {
    id: 2,
    customerCode: "CUST-CORP-2002",
    firstName: "Vikramaditya",
    lastName: "Singhania",
    fullName: "Vikramaditya Textiles Ltd",
    mobileNumber: "+91 98100 44556",
    alternatePhone: "+91 11 2345 6789",
    email: "procurement@vikramadityatex.com",
    customerType: "BUSINESS",
    companyName: "Vikramaditya Textiles Ltd",
    category: "CORPORATE",
    acquisitionSource: "TELESALES",
    status: "ACTIVE",
    registeredAt: "2026-01-15T11:00:00",
    primaryAddress: "Corp Tower B, 7th Floor, Okhla Industrial Area Phase III, New Delhi - 110020",
    assignedEmployeeName: "Priya Nair"
  },
  {
    id: 3,
    customerCode: "CUST-IND-2003",
    firstName: "Rohan",
    lastName: "Mehta",
    fullName: "Rohan Mehta",
    mobileNumber: "+91 98300 77889",
    email: "rohan.mehta@yahoo.co.in",
    customerType: "INDIVIDUAL",
    category: "STANDARD",
    acquisitionSource: "STORE",
    status: "ACTIVE",
    registeredAt: "2026-03-01T14:15:00",
    primaryAddress: "44/2 Lake View Apartments, Salt Lake Sector 5, Kolkata - 700091",
    assignedEmployeeName: "Ravi Shankar"
  },
  {
    id: 4,
    customerCode: "CUST-CORP-2004",
    firstName: "Kavita",
    lastName: "Krishnamurthy",
    fullName: "CloudScale Infotech Pvt Ltd",
    mobileNumber: "+91 98400 33221",
    alternatePhone: "+91 44 2828 1000",
    email: "telecom.admin@cloudscale.in",
    customerType: "BUSINESS",
    companyName: "CloudScale Infotech Pvt Ltd",
    category: "CORPORATE",
    acquisitionSource: "REFERRAL",
    status: "ACTIVE",
    registeredAt: "2026-01-10T09:00:00",
    primaryAddress: "CloudScale Tech Park, Campus 2, Whitefield Main Road, Bengaluru - 560066",
    assignedEmployeeName: "Priya Nair"
  }
];

export const mockConnections = [
  {
    id: 1,
    connectionCode: "CONN-5G-1001",
    customerId: 1,
    customerName: "Ananya Deshmukh",
    mobileNumber: "+91 98201 11223",
    simIccid: "89910010012345678912",
    connectionType: "POSTPAID",
    operatorBrand: "Apex Telecom",
    planName: "Apex Platinum Postpaid Pro",
    connectionStatus: "ACTIVE",
    kycStatus: "VERIFIED",
    branchName: "Mumbai West Circle HQ",
    notes: "eSIM profile activated on iPhone 17 Pro",
    activationDate: "2026-02-01T10:30:00"
  },
  {
    id: 2,
    connectionCode: "CONN-5G-1002",
    customerId: 2,
    customerName: "Vikramaditya Textiles Ltd",
    mobileNumber: "+91 98100 44556",
    simIccid: "89910010012345678913",
    connectionType: "POSTPAID",
    operatorBrand: "Apex Telecom",
    planName: "Apex Platinum Postpaid Pro",
    connectionStatus: "ACTIVE",
    kycStatus: "VERIFIED",
    branchName: "Delhi NCR Capital Hub",
    notes: "Corporate primary billing anchor connection",
    activationDate: "2026-01-15T11:00:00"
  },
  {
    id: 3,
    connectionCode: "CONN-4G-1003",
    customerId: 3,
    customerName: "Rohan Mehta",
    mobileNumber: "+91 98300 77889",
    simIccid: "89910010012345678914",
    connectionType: "PREPAID",
    operatorBrand: "Apex Telecom",
    planName: "Apex 5G Infinity 84D",
    connectionStatus: "ACTIVE",
    kycStatus: "VERIFIED",
    branchName: "Mumbai West Circle HQ",
    notes: "Physical 5G Triple-Cut SIM",
    activationDate: "2026-03-01T14:15:00"
  },
  {
    id: 4,
    connectionCode: "CONN-FBR-1004",
    customerId: 4,
    customerName: "CloudScale Infotech Pvt Ltd",
    mobileNumber: "+91 98400 33221",
    simIccid: "89910010012345678915",
    connectionType: "POSTPAID",
    operatorBrand: "Apex Telecom",
    planName: "Apex Leased Line Enterprise 1Gbps",
    connectionStatus: "ACTIVE",
    kycStatus: "VERIFIED",
    branchName: "Bengaluru Tech Circle",
    notes: "1Gbps 1:1 Leased Circuit with /29 Subnet",
    activationDate: "2026-01-10T09:00:00"
  }
];

export const mockPlans = [
  {
    id: 1,
    planCode: "PLAN-5G-ULTRA",
    name: "Apex 5G Infinity 84D",
    planType: "PREPAID",
    price: 799.00,
    validityDays: 84,
    dataGbPerDay: 2.50,
    voiceBenefit: "Truly Unlimited All-India",
    smsPerDay: 100,
    roamingBenefit: "Free National Roaming",
    additionalBenefits: "Unlimited 5G Data, Disney+ Hotstar Mobile 3M, Wynk Music",
    is5gEnabled: true,
    status: "ACTIVE"
  },
  {
    id: 2,
    planCode: "PLAN-5G-POST-ELITE",
    name: "Apex Platinum Postpaid Pro",
    planType: "POSTPAID",
    price: 1199.00,
    validityDays: 30,
    dataGbPerDay: 5.00,
    voiceBenefit: "Truly Unlimited All-India",
    smsPerDay: 100,
    roamingBenefit: "Free Pan-India + 200 Int. Mins",
    additionalBenefits: "200GB Rollover, Netflix + Prime 1Y, 2 Family Add-ons",
    is5gEnabled: true,
    status: "ACTIVE"
  },
  {
    id: 3,
    planCode: "PLAN-PRE-SAVER",
    name: "Apex Smart Freedom 28D",
    planType: "PREPAID",
    price: 299.00,
    validityDays: 28,
    dataGbPerDay: 1.50,
    voiceBenefit: "Truly Unlimited All-India",
    smsPerDay: 100,
    roamingBenefit: "Free National Roaming",
    additionalBenefits: "Standard 4G/5G Access, Free Hello Tunes",
    is5gEnabled: true,
    status: "ACTIVE"
  },
  {
    id: 4,
    planCode: "PLAN-ENT-FIBER",
    name: "Apex Leased Line Enterprise 1Gbps",
    planType: "ENTERPRISE",
    price: 4999.00,
    validityDays: 30,
    dataGbPerDay: 0.00,
    voiceBenefit: "SIP Trunking 30 Channels",
    smsPerDay: 500,
    roamingBenefit: "SLA 99.95% Guaranteed",
    additionalBenefits: "Static IPv4 /29 Subnet, 24/7 Dedicated Account Manager",
    is5gEnabled: true,
    status: "ACTIVE"
  }
];

export const mockLeads = [
  {
    id: 1,
    leadCode: "LEAD-2026-01",
    prospectName: "Sunil Narang",
    mobileNumber: "+91 98765 43210",
    email: "sunil@nexuslogistics.in",
    companyName: "Nexus Logistics India",
    city: "Mumbai",
    state: "Maharashtra",
    leadSource: "CAMPAIGN",
    interestedService: "Corporate Fleet 5G SIMs",
    estimatedValue: 450000.00,
    priority: "HIGH",
    leadStatus: "NEGOTIATION",
    assignedEmployeeName: "Priya Nair",
    nextFollowUpDate: "2026-10-15T15:00:00",
    notes: "Requires 250 GPS-enabled IoT SIMs and 30 executive lines"
  },
  {
    id: 2,
    leadCode: "LEAD-2026-02",
    prospectName: "Dr. Meera Swaminathan",
    mobileNumber: "+91 97654 32109",
    email: "dr.meera@swaminathanclinic.org",
    companyName: "Swaminathan Health Care",
    city: "Chennai",
    state: "Tamil Nadu",
    leadSource: "WEBSITE",
    interestedService: "High-Speed Clinic Fiber",
    estimatedValue: 48000.00,
    priority: "MEDIUM",
    leadStatus: "QUALIFIED",
    assignedEmployeeName: "Priya Nair",
    nextFollowUpDate: "2026-10-14T11:30:00",
    notes: "Interested in tele-health fiber line with guaranteed 99.9% uptime"
  },
  {
    id: 3,
    leadCode: "LEAD-2026-03",
    prospectName: "Ramesh Chandak",
    mobileNumber: "+91 96543 21098",
    email: "ramesh@chandakexports.com",
    companyName: "Chandak Global Exports",
    city: "Surat",
    state: "Gujarat",
    leadSource: "REFERRAL",
    interestedService: "International Roaming Pack",
    estimatedValue: 120000.00,
    priority: "URGENT",
    leadStatus: "PROPOSAL_SENT",
    assignedEmployeeName: "Priya Nair",
    nextFollowUpDate: "2026-10-12T16:00:00",
    notes: "Commercial proposal sent for multi-country executive travel bundle"
  },
  {
    id: 4,
    leadCode: "LEAD-2026-04",
    prospectName: "Harish Goel",
    mobileNumber: "+91 95432 10987",
    email: "harish@goelsteel.com",
    companyName: "Goel Steel & Forgings",
    city: "Pune",
    state: "Maharashtra",
    leadSource: "INBOUND_CALL",
    interestedService: "5G Postpaid Corporate",
    estimatedValue: 95000.00,
    priority: "LOW",
    leadStatus: "NEW",
    assignedEmployeeName: "Priya Nair",
    nextFollowUpDate: "2026-10-20T10:00:00",
    notes: "Requested commercial brochure and tariff plan comparison"
  }
];

export const mockTickets = [
  {
    id: 1,
    ticketCode: "TKT-2026-101",
    customerName: "Ananya Deshmukh",
    customerPhone: "+91 98201 11223",
    connectionPhone: "+91 98201 11223",
    category: "NETWORK_COVERAGE",
    subject: "Intermittent 5G Uplink Degradation at Worli",
    description: "Subscriber reported cellular speeds dropping to under 10 Mbps indoors on 35th floor during peak hours",
    priority: "HIGH",
    assignedEmployeeName: "Amit Verma",
    slaDeadline: "2026-10-12T18:00:00",
    ticketStatus: "IN_PROGRESS",
    createdAt: "2026-10-10T12:00:00"
  },
  {
    id: 2,
    ticketCode: "TKT-2026-102",
    customerName: "Vikramaditya Textiles Ltd",
    customerPhone: "+91 98100 44556",
    connectionPhone: "+91 98100 44556",
    category: "BILLING_DISPUTE",
    subject: "Clarification on Corporate Roaming Charges",
    description: "Customer noted ₹1,450 roaming line item billed on executive trip to Singapore",
    priority: "MEDIUM",
    assignedEmployeeName: "Amit Verma",
    slaDeadline: "2026-10-14T12:00:00",
    ticketStatus: "ASSIGNED",
    createdAt: "2026-10-09T15:30:00"
  },
  {
    id: 3,
    ticketCode: "TKT-2026-103",
    customerName: "CloudScale Infotech Pvt Ltd",
    customerPhone: "+91 98400 33221",
    connectionPhone: "+91 98400 33221",
    category: "BROADBAND_FAULT",
    subject: "Secondary Optical Route Latency Spike",
    description: "Automated network alarm: ping latency rose to 45ms on redundant route",
    priority: "CRITICAL",
    assignedEmployeeName: "Vikram Singh",
    slaDeadline: "2026-10-11T20:00:00",
    ticketStatus: "OPEN",
    createdAt: "2026-10-11T09:15:00"
  }
];

export const mockInvoices = [
  {
    id: 1,
    invoiceNumber: "INV-2026-09-001",
    customerName: "Ananya Deshmukh",
    customerMobile: "+91 98201 11223",
    connectionPhone: "+91 98201 11223",
    billingPeriodStart: "2026-09-01",
    billingPeriodEnd: "2026-09-30",
    invoiceDate: "2026-10-01",
    dueDate: "2026-10-15",
    subtotal: 1199.00,
    taxAmount: 215.82,
    totalAmount: 1414.82,
    paidAmount: 1414.82,
    outstandingAmount: 0.00,
    status: "PAID",
    items: [
      { id: 1, description: "Monthly Subscription - Apex Platinum Postpaid Pro", quantity: 1, unitPrice: 1199.00, taxRatePercent: 18.00, totalPrice: 1414.82 }
    ]
  },
  {
    id: 2,
    invoiceNumber: "INV-2026-09-002",
    customerName: "Vikramaditya Textiles Ltd",
    customerMobile: "+91 98100 44556",
    connectionPhone: "+91 98100 44556",
    billingPeriodStart: "2026-09-01",
    billingPeriodEnd: "2026-09-30",
    invoiceDate: "2026-10-01",
    dueDate: "2026-10-20",
    subtotal: 25400.00,
    taxAmount: 4572.00,
    totalAmount: 28972.00,
    paidAmount: 0.00,
    outstandingAmount: 28972.00,
    status: "UNPAID",
    items: [
      { id: 2, description: "Corporate Group Fleet Plan (45 Active Lines)", quantity: 1, unitPrice: 24000.00, taxRatePercent: 18.00, totalPrice: 28320.00 },
      { id: 3, description: "Value Added Security Firewall Addon", quantity: 1, unitPrice: 1400.00, taxRatePercent: 18.00, totalPrice: 1652.00 }
    ]
  },
  {
    id: 3,
    invoiceNumber: "INV-2026-09-003",
    customerName: "CloudScale Infotech Pvt Ltd",
    customerMobile: "+91 98400 33221",
    connectionPhone: "+91 98400 33221",
    billingPeriodStart: "2026-09-01",
    billingPeriodEnd: "2026-09-30",
    invoiceDate: "2026-10-01",
    dueDate: "2026-10-18",
    subtotal: 4999.00,
    taxAmount: 899.82,
    totalAmount: 5898.82,
    paidAmount: 5898.82,
    outstandingAmount: 0.00,
    status: "PAID",
    items: [
      { id: 4, description: "Enterprise Optical Leased Circuit 1Gbps (1:1 Dedicated)", quantity: 1, unitPrice: 4999.00, taxRatePercent: 18.00, totalPrice: 5898.82 }
    ]
  }
];

export const mockFollowUps = [
  {
    id: 1,
    title: "Final contract review with Nexus Logistics Legal",
    leadName: "Sunil Narang (Nexus Logistics)",
    assignedEmployeeName: "Priya Nair",
    scheduledAt: "2026-10-15T15:00:00",
    priority: "HIGH",
    status: "SCHEDULED",
    notes: "Review master service agreement clause on SLA penalties"
  },
  {
    id: 2,
    title: "Site readiness confirmation for Dr. Meera clinic",
    leadName: "Dr. Meera Swaminathan",
    assignedEmployeeName: "Priya Nair",
    scheduledAt: "2026-10-14T11:30:00",
    priority: "MEDIUM",
    status: "SCHEDULED",
    notes: "Confirm internal router rack room readiness before fiber drop"
  },
  {
    id: 3,
    title: "Follow-up on Postpaid plan renewal for Vikramaditya Tex",
    customerName: "Vikramaditya Textiles Ltd",
    assignedEmployeeName: "Priya Nair",
    scheduledAt: "2026-10-18T10:00:00",
    priority: "MEDIUM",
    status: "SCHEDULED",
    notes: "Annual renewal discussion and 5G upgrade review"
  }
];

export const mockTasks = [
  {
    id: 1,
    taskCode: "TSK-501",
    title: "Deliver replacement 5G SIM to Bandra store",
    description: "Customer requested priority SIM dispatch for VIP line +91 98201 11223",
    customerName: "Ananya Deshmukh",
    assignedEmployeeName: "Vikram Singh",
    dueDate: "2026-10-12T17:00:00",
    priority: "HIGH",
    status: "IN_PROGRESS"
  },
  {
    id: 2,
    taskCode: "TSK-502",
    title: "Prepare Q4 Corporate Telecom Consumption Report",
    description: "Consolidate bandwidth and voice minutes for CloudScale Infotech",
    customerName: "CloudScale Infotech Pvt Ltd",
    assignedEmployeeName: "Sneha Kulkarni",
    dueDate: "2026-10-16T18:00:00",
    priority: "MEDIUM",
    status: "PENDING"
  },
  {
    id: 3,
    taskCode: "TSK-503",
    title: "Perform RF Drive Test near BKC Metro Station",
    description: "Investigate reported 5G beam coverage drop during peak evening hours",
    assignedEmployeeName: "Vikram Singh",
    dueDate: "2026-10-13T14:00:00",
    priority: "HIGH",
    status: "PENDING"
  }
];

export const mockEmployees = [
  {
    id: 1,
    employeeCode: "EMP-1001",
    firstName: "Aakash",
    lastName: "Khurana",
    workEmail: "admin@apextelecom.in",
    workPhone: "+91 98200 00001",
    department: "Executive Management",
    designation: "Chief Operating Officer",
    employmentStatus: "ACTIVE",
    branch: { name: "Mumbai West Circle HQ" }
  },
  {
    id: 2,
    employeeCode: "EMP-1002",
    firstName: "Rajesh",
    lastName: "Sharma",
    workEmail: "manager@apextelecom.in",
    workPhone: "+91 98200 00002",
    department: "CRM Operations",
    designation: "General Manager CRM",
    employmentStatus: "ACTIVE",
    branch: { name: "Mumbai West Circle HQ" }
  },
  {
    id: 3,
    employeeCode: "EMP-1003",
    firstName: "Priya",
    lastName: "Nair",
    workEmail: "sales@apextelecom.in",
    workPhone: "+91 98200 00003",
    department: "Enterprise Sales",
    designation: "Senior Key Account Manager",
    employmentStatus: "ACTIVE",
    branch: { name: "Bengaluru Tech Circle" }
  },
  {
    id: 4,
    employeeCode: "EMP-1004",
    firstName: "Amit",
    lastName: "Verma",
    workEmail: "support@apextelecom.in",
    workPhone: "+91 98200 00004",
    department: "Customer Care",
    designation: "Escalations Specialist",
    employmentStatus: "ACTIVE",
    branch: { name: "Delhi NCR Capital Hub" }
  },
  {
    id: 5,
    employeeCode: "EMP-1005",
    firstName: "Sneha",
    lastName: "Kulkarni",
    workEmail: "billing@apextelecom.in",
    workPhone: "+91 98200 00005",
    department: "Finance & Billing",
    designation: "Lead Billing Analyst",
    employmentStatus: "ACTIVE",
    branch: { name: "Mumbai West Circle HQ" }
  },
  {
    id: 6,
    employeeCode: "EMP-1006",
    firstName: "Vikram",
    lastName: "Singh",
    workEmail: "tech@apextelecom.in",
    workPhone: "+91 98200 00006",
    department: "Field Engineering",
    designation: "Lead RF Field Engineer",
    employmentStatus: "ACTIVE",
    branch: { name: "Hyderabad Cyberabad Hub" }
  }
];

export const mockBranches = [
  {
    id: 1,
    branchCode: "BR-MUM-01",
    name: "Mumbai West Circle HQ",
    addressLine: "Tower 3, Bandra-Kurla Complex (BKC)",
    city: "Mumbai",
    state: "Maharashtra",
    pinCode: "400051",
    contactPhone: "+91 22 6678 1000",
    status: "ACTIVE"
  },
  {
    id: 2,
    branchCode: "BR-DEL-01",
    name: "Delhi NCR Capital Hub",
    addressLine: "Barakhamba Road, Connaught Place",
    city: "New Delhi",
    state: "Delhi",
    pinCode: "110001",
    contactPhone: "+91 11 4455 2000",
    status: "ACTIVE"
  },
  {
    id: 3,
    branchCode: "BR-BLR-01",
    name: "Bengaluru Tech Circle",
    addressLine: "100ft Road, Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
    pinCode: "560038",
    contactPhone: "+91 80 2525 3000",
    status: "ACTIVE"
  },
  {
    id: 4,
    branchCode: "BR-HYD-01",
    name: "Hyderabad Cyberabad Hub",
    addressLine: "Financial District, Gachibowli",
    city: "Hyderabad",
    state: "Telangana",
    pinCode: "500032",
    contactPhone: "+91 40 6789 4000",
    status: "ACTIVE"
  }
];
