package com.telecom.crm.controller;

import com.telecom.crm.dto.ApiResponse;
import com.telecom.crm.repository.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import com.telecom.crm.entity.AuditLog;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/reports")
@Tag(name = "Reports & Analytics", description = "Management reports, SLA compliance, and CSV export")
public class ReportController {

    private final CustomerRepository customerRepository;
    private final CustomerConnectionRepository connectionRepository;
    private final LeadRepository leadRepository;
    private final SupportTicketRepository ticketRepository;
    private final InvoiceRepository invoiceRepository;
    private final BranchRepository branchRepository;
    private final AuditLogRepository auditLogRepository;

    public ReportController(CustomerRepository customerRepository,
                            CustomerConnectionRepository connectionRepository,
                            LeadRepository leadRepository,
                            SupportTicketRepository ticketRepository,
                            InvoiceRepository invoiceRepository,
                            BranchRepository branchRepository,
                            AuditLogRepository auditLogRepository) {
        this.customerRepository = customerRepository;
        this.connectionRepository = connectionRepository;
        this.leadRepository = leadRepository;
        this.ticketRepository = ticketRepository;
        this.invoiceRepository = invoiceRepository;
        this.branchRepository = branchRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @GetMapping("/summary")
    @Operation(summary = "Get aggregated analytics report across all telecom operations")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getReportsSummary() {
        Map<String, Object> reports = new HashMap<>();

        reports.put("totalCustomers", customerRepository.count());
        reports.put("activeConnections", connectionRepository.countByConnectionStatus("ACTIVE"));
        reports.put("suspendedConnections", connectionRepository.countByConnectionStatus("SUSPENDED"));
        reports.put("totalLeads", leadRepository.count());
        reports.put("convertedLeads", leadRepository.countByLeadStatus("CONVERTED"));
        reports.put("openTickets", ticketRepository.countByTicketStatus("OPEN") + ticketRepository.countByTicketStatus("IN_PROGRESS"));
        reports.put("totalBilled", invoiceRepository.sumTotalBilled());
        reports.put("totalCollected", invoiceRepository.sumTotalCollected());
        reports.put("totalBranches", branchRepository.count());

        // Branch-wise performance
        List<Map<String, Object>> branchStats = List.of(
                Map.of("branch", "Mumbai West Circle HQ", "activeSubs", 12450, "revenueLakhs", 142.5, "openTickets", 18),
                Map.of("branch", "Delhi NCR Capital Hub", "activeSubs", 11200, "revenueLakhs", 128.0, "openTickets", 14),
                Map.of("branch", "Bengaluru Tech Circle", "activeSubs", 9800, "revenueLakhs", 115.2, "openTickets", 8),
                Map.of("branch", "Hyderabad Cyberabad Hub", "activeSubs", 7400, "revenueLakhs", 89.4, "openTickets", 6)
        );
        reports.put("branchPerformance", branchStats);

        return ResponseEntity.ok(ApiResponse.ok(reports));
    }

    @GetMapping("/export/csv")
    @Operation(summary = "Export operational report to CSV")
    public ResponseEntity<byte[]> exportCsv(@RequestParam(defaultValue = "customers") String type) {
        StringBuilder csv = new StringBuilder();
        String filename = type + "_report.csv";

        if ("customers".equalsIgnoreCase(type)) {
            csv.append("CustomerCode,Name,Mobile,Type,Category,Status,RegisteredAt\n");
            customerRepository.findAll().forEach(c ->
                csv.append(String.format("%s,\"%s\",%s,%s,%s,%s,%s\n",
                    c.getCustomerCode(), c.getDisplayName(), c.getMobileNumber(),
                    c.getCustomerType(), c.getCategory(), c.getStatus(), c.getRegisteredAt()))
            );
        } else if ("invoices".equalsIgnoreCase(type)) {
            csv.append("InvoiceNumber,Customer,InvoiceDate,DueDate,TotalAmount,PaidAmount,OutstandingAmount,Status\n");
            invoiceRepository.findAll().forEach(i ->
                csv.append(String.format("%s,\"%s\",%s,%s,%s,%s,%s,%s\n",
                    i.getInvoiceNumber(), i.getCustomer().getDisplayName(), i.getInvoiceDate(),
                    i.getDueDate(), i.getTotalAmount(), i.getPaidAmount(), i.getOutstandingAmount(), i.getStatus()))
            );
        } else {
            csv.append("LeadCode,ProspectName,Mobile,Company,Status,EstimatedValue\n");
            leadRepository.findAll().forEach(l ->
                csv.append(String.format("%s,\"%s\",%s,\"%s\",%s,%s\n",
                    l.getLeadCode(), l.getProspectName(), l.getMobileNumber(),
                    l.getCompanyName() != null ? l.getCompanyName() : "", l.getLeadStatus(), l.getEstimatedValue()))
            );
        }

        byte[] output = csv.toString().getBytes();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(output);
    }

    @GetMapping("/audit-logs")
    @Operation(summary = "Get recent security and operational audit logs (DoT/TRAI compliance)")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getAuditLogs(
            @RequestParam(defaultValue = "50") int limit) {
        Pageable pageable = PageRequest.of(0, Math.min(limit, 100));
        return ResponseEntity.ok(ApiResponse.ok("Audit logs retrieved", auditLogRepository.findAllByOrderByCreatedAtDesc(pageable).getContent()));
    }
}
