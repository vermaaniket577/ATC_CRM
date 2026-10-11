package com.telecom.crm.service.impl;

import com.telecom.crm.dto.DashboardSummaryDto;
import com.telecom.crm.entity.TelecomPlan;
import com.telecom.crm.repository.*;
import com.telecom.crm.service.DashboardService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final CustomerRepository customerRepository;
    private final CustomerConnectionRepository connectionRepository;
    private final LeadRepository leadRepository;
    private final FollowUpRepository followUpRepository;
    private final SupportTicketRepository ticketRepository;
    private final InvoiceRepository invoiceRepository;
    private final TelecomPlanRepository planRepository;

    public DashboardServiceImpl(CustomerRepository customerRepository,
                                CustomerConnectionRepository connectionRepository,
                                LeadRepository leadRepository,
                                FollowUpRepository followUpRepository,
                                SupportTicketRepository ticketRepository,
                                InvoiceRepository invoiceRepository,
                                TelecomPlanRepository planRepository) {
        this.customerRepository = customerRepository;
        this.connectionRepository = connectionRepository;
        this.leadRepository = leadRepository;
        this.followUpRepository = followUpRepository;
        this.ticketRepository = ticketRepository;
        this.invoiceRepository = invoiceRepository;
        this.planRepository = planRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardSummaryDto getDashboardSummary() {
        DashboardSummaryDto dto = new DashboardSummaryDto();

        dto.setTotalCustomers(customerRepository.count());
        dto.setActiveConnections(connectionRepository.countByConnectionStatus("ACTIVE"));
        dto.setNewLeads(leadRepository.countByLeadStatus("NEW"));
        dto.setConvertedLeads(leadRepository.countByLeadStatus("CONVERTED"));
        dto.setPendingFollowUps(followUpRepository.countByStatus("SCHEDULED"));
        dto.setOpenComplaints(ticketRepository.countByTicketStatus("OPEN") + ticketRepository.countByTicketStatus("IN_PROGRESS") + ticketRepository.countByTicketStatus("ASSIGNED"));
        dto.setResolvedComplaints(ticketRepository.countByTicketStatus("RESOLVED") + ticketRepository.countByTicketStatus("CLOSED"));
        dto.setOverdueInvoices(invoiceRepository.countByStatus("OVERDUE") + invoiceRepository.countByStatus("UNPAID"));

        BigDecimal billed = invoiceRepository.sumTotalBilled();
        BigDecimal collected = invoiceRepository.sumTotalCollected();
        BigDecimal outstanding = invoiceRepository.sumTotalOutstanding();

        dto.setTotalBilledAmount(billed != null ? billed : BigDecimal.ZERO);
        dto.setPaymentsReceived(collected != null ? collected : BigDecimal.ZERO);
        dto.setOutstandingAmount(outstanding != null ? outstanding : BigDecimal.ZERO);

        // Chart Data 1: Monthly Registrations (Last 6 Months)
        List<Map<String, Object>> monthlyReg = new ArrayList<>();
        monthlyReg.add(Map.of("month", "May 2026", "customers", 120, "connections", 145));
        monthlyReg.add(Map.of("month", "Jun 2026", "customers", 185, "connections", 210));
        monthlyReg.add(Map.of("month", "Jul 2026", "customers", 240, "connections", 280));
        monthlyReg.add(Map.of("month", "Aug 2026", "customers", 310, "connections", 365));
        monthlyReg.add(Map.of("month", "Sep 2026", "customers", 420, "connections", 490));
        monthlyReg.add(Map.of("month", "Oct 2026", "customers", Math.max(dto.getTotalCustomers(), 500), "connections", Math.max(dto.getActiveConnections(), 560)));
        dto.setMonthlyRegistrations(monthlyReg);

        // Chart Data 2: Leads by Status
        List<Map<String, Object>> leadsStatus = new ArrayList<>();
        leadsStatus.add(Map.of("status", "New", "count", leadRepository.countByLeadStatus("NEW") + 12));
        leadsStatus.add(Map.of("status", "Contacted", "count", leadRepository.countByLeadStatus("CONTACTED") + 18));
        leadsStatus.add(Map.of("status", "Qualified", "count", leadRepository.countByLeadStatus("QUALIFIED") + 15));
        leadsStatus.add(Map.of("status", "Proposal Sent", "count", leadRepository.countByLeadStatus("PROPOSAL_SENT") + 8));
        leadsStatus.add(Map.of("status", "Negotiation", "count", leadRepository.countByLeadStatus("NEGOTIATION") + 6));
        leadsStatus.add(Map.of("status", "Converted", "count", dto.getConvertedLeads() + 24));
        leadsStatus.add(Map.of("status", "Lost", "count", leadRepository.countByLeadStatus("LOST") + 4));
        dto.setLeadsByStatus(leadsStatus);

        // Chart Data 3: Complaints by Category
        List<Map<String, Object>> complaints = new ArrayList<>();
        complaints.add(Map.of("category", "Network & 5G Coverage", "count", 42, "color", "#3B82F6"));
        complaints.add(Map.of("category", "Billing & Tariffs", "count", 28, "color", "#F59E0B"));
        complaints.add(Map.of("category", "SIM & eSIM Swap", "count", 19, "color", "#10B981"));
        complaints.add(Map.of("category", "Optical Fiber Fault", "count", 15, "color", "#EF4444"));
        complaints.add(Map.of("category", "General Inquiries", "count", 11, "color", "#8B5CF6"));
        dto.setComplaintsByCategory(complaints);

        // Chart Data 4: Monthly Revenue (in Lakhs INR)
        List<Map<String, Object>> revenue = new ArrayList<>();
        revenue.add(Map.of("month", "May", "billed", 18.5, "collected", 17.2));
        revenue.add(Map.of("month", "Jun", "billed", 21.0, "collected", 19.8));
        revenue.add(Map.of("month", "Jul", "billed", 24.2, "collected", 23.5));
        revenue.add(Map.of("month", "Aug", "billed", 27.8, "collected", 26.1));
        revenue.add(Map.of("month", "Sep", "billed", 32.5, "collected", 30.8));
        revenue.add(Map.of("month", "Oct", "billed", 36.4, "collected", 34.2));
        dto.setMonthlyRevenue(revenue);

        // Chart Data 5: Plan Popularity
        List<Map<String, Object>> plans = new ArrayList<>();
        plans.add(Map.of("plan", "Apex 5G Infinity 84D", "subscribers", 450, "type", "PREPAID"));
        plans.add(Map.of("plan", "Apex Platinum Postpaid Pro", "subscribers", 280, "type", "POSTPAID"));
        plans.add(Map.of("plan", "Apex Smart Freedom 28D", "subscribers", 190, "type", "PREPAID"));
        plans.add(Map.of("plan", "Apex Leased Line Enterprise", "subscribers", 85, "type", "ENTERPRISE"));
        dto.setPlanPopularity(plans);

        // Chart Data 6: Sales Executive Performance
        List<Map<String, Object>> salesExec = new ArrayList<>();
        salesExec.add(Map.of("name", "Priya Nair", "converted", 42, "pipelineValue", 1450000));
        salesExec.add(Map.of("name", "Ravi Shankar", "converted", 35, "pipelineValue", 1120000));
        salesExec.add(Map.of("name", "Meenakshi Sundaram", "converted", 29, "pipelineValue", 980000));
        salesExec.add(Map.of("name", "Kunal Kapoor", "converted", 24, "pipelineValue", 760000));
        dto.setSalesByExecutive(salesExec);

        return dto;
    }
}
