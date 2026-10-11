package com.telecom.crm.controller;

import com.telecom.crm.dto.ApiResponse;
import com.telecom.crm.dto.LeadRequestDto;
import com.telecom.crm.dto.LeadResponseDto;
import com.telecom.crm.entity.AuditLog;
import com.telecom.crm.entity.SupportTicket;
import com.telecom.crm.entity.TelecomPlan;
import com.telecom.crm.repository.AuditLogRepository;
import com.telecom.crm.repository.SupportTicketRepository;
import com.telecom.crm.repository.TelecomPlanRepository;
import com.telecom.crm.service.LeadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Public REST Controller enabling external marketing websites, eCommerce landing pages,
 * and customer self-care portals to link directly with the Apex Telecom CRM.
 */
@RestController
@RequestMapping("/api/v1/public/website")
@Tag(name = "Public Website & Portal Integration", description = "Endpoints for linking public telecom websites, lead capture forms, and subscriber self-care portals")
public class PublicWebsiteController {

    private final LeadService leadService;
    private final TelecomPlanRepository planRepository;
    private final SupportTicketRepository ticketRepository;
    private final AuditLogRepository auditLogRepository;

    public PublicWebsiteController(LeadService leadService,
                                   TelecomPlanRepository planRepository,
                                   SupportTicketRepository ticketRepository,
                                   AuditLogRepository auditLogRepository) {
        this.leadService = leadService;
        this.planRepository = planRepository;
        this.ticketRepository = ticketRepository;
        this.auditLogRepository = auditLogRepository;
    }

    /**
     * Webhook / Lead Capture Endpoint for external websites.
     * External websites can submit "Contact Us", "Request 5G SIM", or "Corporate Inquiry" forms here.
     */
    @PostMapping("/inquiry")
    @Operation(summary = "Submit a public website inquiry / lead into the CRM pipeline")
    public ResponseEntity<ApiResponse<Map<String, Object>>> submitWebsiteInquiry(
            @Valid @RequestBody LeadRequestDto request,
            @RequestHeader(value = "X-Website-Origin", required = false) String websiteOrigin,
            HttpServletRequest httpRequest) {

        if (request.getLeadSource() == null || request.getLeadSource().isEmpty()) {
            request.setLeadSource("WEBSITE");
        }

        LeadResponseDto createdLead = leadService.createLead(request);

        // Record audit trail of the inbound website submission
        try {
            AuditLog log = new AuditLog();
            log.setUsername("WEBSITE_VISITOR");
            log.setAction("WEBSITE_INQUIRY_CAPTURED");
            log.setEntityName("LEAD");
            log.setEntityId(createdLead.getId());
            log.setNewValue("Inquiry from " + (websiteOrigin != null ? websiteOrigin : "Official Website") + ": " + createdLead.getProspectName());
            log.setIpAddress(extractClientIp(httpRequest));
            log.setUserAgent(httpRequest.getHeader("User-Agent"));
            log.setCreatedAt(LocalDateTime.now());
            auditLogRepository.save(log);
        } catch (Exception ignored) {}

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("leadCode", createdLead.getLeadCode());
        responseData.put("prospectName", createdLead.getProspectName());
        responseData.put("status", "RECEIVED");
        responseData.put("message", "Inquiry registered. A telecom relationship manager will contact you shortly.");

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Thank you for contacting Apex Telecom. Your inquiry has been received.", responseData));
    }

    /**
     * Public Telecom Plans Catalog.
     * External websites can display live 5G/4G plans directly synchronized from the CRM catalog.
     */
    @GetMapping("/plans")
    @Operation(summary = "Fetch active telecom plans for public website catalog display")
    public ResponseEntity<ApiResponse<List<TelecomPlan>>> getPublicPlans(
            @RequestParam(required = false) String planType) {
        List<TelecomPlan> plans = planType != null
                ? planRepository.findByPlanTypeAndStatus(planType.toUpperCase(), "ACTIVE")
                : planRepository.findByStatus("ACTIVE");
        return ResponseEntity.ok(ApiResponse.ok("Active telecom plans retrieved", plans));
    }

    /**
     * Public Support Ticket Status Tracker.
     * Allows subscribers to check their complaint status on the public website via Ticket Code.
     */
    @GetMapping("/ticket-status/{ticketCode}")
    @Operation(summary = "Check support ticket status from public customer portal")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkTicketStatus(
            @PathVariable String ticketCode) {
        SupportTicket ticket = ticketRepository.findByTicketCode(ticketCode.trim().toUpperCase())
                .orElse(null);

        if (ticket == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Ticket #" + ticketCode + " not found. Please verify the ticket code."));
        }

        Map<String, Object> statusData = new HashMap<>();
        statusData.put("ticketCode", ticket.getTicketCode());
        statusData.put("category", ticket.getCategory());
        statusData.put("subject", ticket.getSubject());
        statusData.put("ticketStatus", ticket.getTicketStatus());
        statusData.put("priority", ticket.getPriority());
        statusData.put("createdAt", ticket.getCreatedAt());
        statusData.put("slaDeadline", ticket.getSlaDeadline());
        statusData.put("resolutionNotes", ticket.getResolutionNotes());

        return ResponseEntity.ok(ApiResponse.ok("Ticket status retrieved successfully", statusData));
    }

    private String extractClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty() || "unknown".equalsIgnoreCase(xfHeader)) {
            return request.getRemoteAddr() != null ? request.getRemoteAddr() : "127.0.0.1";
        }
        return xfHeader.split(",")[0].trim();
    }
}
