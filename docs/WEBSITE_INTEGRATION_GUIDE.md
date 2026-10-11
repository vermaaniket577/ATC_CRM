# Guide: How to Link Your Website to the Apex Telecom CRM

This guide documents the end-to-end process of linking an external marketing website, eCommerce landing page, or customer self-care portal to the **Apex Telecom Enterprise CRM System**.

---

## 1. System Integration Architecture

```
   [ Public Marketing Website / Landing Page ]
     (e.g., www.apextelecom.in / WordPress / Next.js)
                         │
                         ├── 1. Inbound Leads ("Request 5G SIM / Enterprise Line")
                         │      POST /api/v1/public/website/inquiry
                         │
                         ├── 2. Dynamic 5G Tariff Plans Catalog
                         │      GET /api/v1/public/website/plans
                         │
                         └── 3. Self-Care Complaint Ticket Tracker
                                GET /api/v1/public/website/ticket-status/{ticketNumber}
                                         │
                                         ▼
                      [ Apex Telecom CRM Gateway (Port 8080) ]
                                         │
                ┌────────────────────────┼────────────────────────┐
                ▼                        ▼                        ▼
      [ Sales Leads Pipeline ]  [ Audit Trail Log ]   [ SMS Notification ]
        Stage: NEW (Kanban)       Action: CAPTURED      Dispatched to Lead
```

---

## 2. Process 1: Embedding the Lead Capture Widget (Ready-to-Use HTML Snippet)

You can copy and paste this standalone HTML/JavaScript widget directly into any webpage, CMS (WordPress, Webflow, Wix), or landing page.

```html
<!-- ============================================================== -->
<!-- Apex Telecom Website Lead Capture Form Widget                    -->
<!-- ============================================================== -->
<div id="telecom-lead-widget" style="max-width: 480px; margin: 20px auto; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
    <div style="width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #EF4444, #F97316); display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: bold; font-size: 18px;">
      📡
    </div>
    <div>
      <h3 style="margin: 0; font-size: 18px; color: #0f172a; font-weight: 800;">Get Apex 5G Connection</h3>
      <p style="margin: 0; font-size: 12px; color: #64748b;">Ultra-fast 5G SIMs & Enterprise Leased Lines</p>
    </div>
  </div>

  <form id="apexLeadForm" style="display: flex; flex-direction: column; gap: 12px;">
    <div>
      <label style="display: block; font-size: 11px; font-weight: 700; color: #334155; margin-bottom: 4px;">Full Name *</label>
      <input type="text" id="prospectName" required placeholder="e.g. Rahul Sharma" style="width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px;">
    </div>

    <div>
      <label style="display: block; font-size: 11px; font-weight: 700; color: #334155; margin-bottom: 4px;">Mobile Number *</label>
      <input type="tel" id="mobileNumber" required placeholder="+91 98765 43210" style="width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px;">
    </div>

    <div>
      <label style="display: block; font-size: 11px; font-weight: 700; color: #334155; margin-bottom: 4px;">Email Address</label>
      <input type="email" id="email" placeholder="rahul@example.com" style="width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px;">
    </div>

    <div>
      <label style="display: block; font-size: 11px; font-weight: 700; color: #334155; margin-bottom: 4px;">Interested Service</label>
      <select id="interestedService" style="width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; background: #fff;">
        <option value="5G Postpaid Corporate Line">5G Postpaid Corporate Line</option>
        <option value="5G Unlimited Prepaid SIM">5G Unlimited Prepaid SIM</option>
        <option value="High-Speed Fiber Broadband (1 Gbps)">High-Speed Fiber Broadband (1 Gbps)</option>
        <option value="eSIM Enterprise Fleet">eSIM Enterprise Fleet</option>
      </select>
    </div>

    <div>
      <label style="display: block; font-size: 11px; font-weight: 700; color: #334155; margin-bottom: 4px;">City</label>
      <input type="text" id="city" placeholder="Mumbai, Delhi, Bengaluru..." style="width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px;">
    </div>

    <button type="submit" id="submitBtn" style="margin-top: 8px; padding: 12px; border: none; border-radius: 10px; background: linear-gradient(135deg, #EF4444 0%, #F97316 100%); color: #ffffff; font-size: 14px; font-weight: 800; cursor: pointer; transition: opacity 0.2s;">
      Request 5G Connection
    </button>

    <div id="responseMessage" style="display: none; padding: 10px; border-radius: 8px; font-size: 12px; margin-top: 6px;"></div>
  </form>
</div>

<script>
  document.getElementById('apexLeadForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const msg = document.getElementById('responseMessage');
    btn.disabled = true;
    btn.innerText = 'Submitting to CRM...';

    // Point to your Apex Telecom CRM Endpoint
    const CRM_ENDPOINT = 'http://localhost:8080/api/v1/public/website/inquiry';

    const payload = {
      prospectName: document.getElementById('prospectName').value,
      mobileNumber: document.getElementById('mobileNumber').value,
      email: document.getElementById('email').value,
      interestedService: document.getElementById('interestedService').value,
      city: document.getElementById('city').value || 'Mumbai',
      state: 'Maharashtra',
      leadSource: 'WEBSITE',
      estimatedValue: 15000,
      priority: 'HIGH',
      notes: 'Submitted via public website widget'
    };

    try {
      const res = await fetch(CRM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Website-Origin': window.location.origin
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      msg.style.display = 'block';
      if (res.ok && data.success) {
        msg.style.background = '#ECFDF5';
        msg.style.color = '#065F46';
        msg.style.border = '1px solid #A7F3D0';
        msg.innerText = '✓ ' + (data.data.message || 'Inquiry received! Reference Code: ' + data.data.leadCode);
        document.getElementById('apexLeadForm').reset();
      } else {
        msg.style.background = '#FEF2F2';
        msg.style.color = '#991B1B';
        msg.style.border = '1px solid #FECACA';
        msg.innerText = '✕ Error: ' + (data.message || 'Could not submit inquiry');
      }
    } catch (err) {
      msg.style.display = 'block';
      msg.style.background = '#FEF2F2';
      msg.style.color = '#991B1B';
      msg.innerText = '✕ Network error: Could not reach CRM server';
    } finally {
      btn.disabled = false;
      btn.innerText = 'Request 5G Connection';
    }
  });
</script>
```

---

## 3. Process 2: REST API & Webhook Integration

### Endpoint: Submit Website Inquiry
`POST /api/v1/public/website/inquiry`

#### Headers:
- `Content-Type: application/json`
- `X-Website-Origin: https://www.yourdomain.com` (Optional origin tracking)

#### Request JSON Payload:
```json
{
  "prospectName": "Anand Mehra",
  "mobileNumber": "+91 98200 44556",
  "email": "anand.mehra@techcorp.in",
  "companyName": "TechCorp Solutions",
  "city": "Bengaluru",
  "state": "Karnataka",
  "interestedService": "5G Enterprise Fleet SIMs",
  "estimatedValue": 250000,
  "priority": "HIGH",
  "leadSource": "WEBSITE",
  "notes": "Requested 50 enterprise connections"
}
```

#### Successful Response (`HTTP 201 Created`):
```json
{
  "success": true,
  "message": "Thank you for contacting Apex Telecom. Your inquiry has been received.",
  "data": {
    "leadCode": "LD-2026-1005",
    "prospectName": "Anand Mehra",
    "status": "RECEIVED",
    "message": "Inquiry registered. A telecom relationship manager will contact you shortly."
  },
  "timestamp": "2026-10-11T14:56:00"
}
```

---

## 4. Process 3: Dynamic 5G Tariff Plans Display

Instead of hardcoding plan prices on your marketing website, fetch the active catalog dynamically from the CRM:

### Endpoint:
`GET /api/v1/public/website/plans?planType=PREPAID` *(or `POSTPAID`)*

#### Frontend JavaScript Fetch Example:
```javascript
async function loadWebsitePlans() {
  const response = await fetch('http://localhost:8080/api/v1/public/website/plans');
  const result = await response.json();
  
  if (result.success) {
    const plans = result.data;
    console.log("Live Telecom Plans:", plans);
    // Render plans dynamically onto your pricing cards
  }
}
loadWebsitePlans();
```

---

## 5. Process 4: Public Complaint Ticket Status Tracker

Subscribers can check the status of their service requests directly on your website using their Ticket Number (e.g. `TKT-2026-101`):

### Endpoint:
`GET /api/v1/public/website/ticket-status/TKT-2026-101`

#### Response:
```json
{
  "success": true,
  "message": "Ticket status retrieved successfully",
  "data": {
    "ticketNumber": "TKT-2026-101",
    "category": "NETWORK_COVERAGE",
    "subject": "Weak 5G Signal in Bandra Kurla Complex",
    "ticketStatus": "IN_PROGRESS",
    "priority": "HIGH",
    "slaDeadline": "2026-10-11T16:00:00",
    "resolutionDetails": "Technician dispatched to local cell tower."
  }
}
```

---

## 6. Process 5: Domain Linking & Production Reverse Proxy

To link your public website domain (e.g., `https://www.apextelecom.in`) with your CRM backend (e.g., `https://crm.apextelecom.in`):

### Step A: DNS Setup (AWS Route 53 or Cloudflare)
1. Point your main domain `www.apextelecom.in` to your web server or S3/CloudFront.
2. Create a Subdomain record for the CRM:
   - **Type**: `CNAME`
   - **Name**: `crm.apextelecom.in`
   - **Target**: Your AWS Application Load Balancer (ALB) or EC2 Elastic IP.

### Step B: Nginx Reverse Proxy (Forward `/api/` to CRM)
If your website and CRM are hosted on the same domain, configure Nginx to proxy API calls:
```nginx
server {
    listen 443 ssl;
    server_name www.apextelecom.in;

    # 1. Marketing Website (Static HTML or Next.js)
    location / {
        root /var/www/website;
        try_files $uri $uri/ /index.html;
    }

    # 2. Proxied Lead Webhook directly to Spring Boot Backend
    location /api/v1/public/ {
        proxy_pass http://localhost:8080/api/v1/public/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Website-Origin $http_origin;
    }
}
```

### Step C: Update `.env` CORS Allowed Origins
In `backend/src/main/resources/application.yml` or `.env`:
```properties
app.cors.allowed-origins=http://localhost:5173,https://www.apextelecom.in,https://apextelecom.in
```
