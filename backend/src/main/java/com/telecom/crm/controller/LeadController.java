package com.telecom.crm.controller;

import com.telecom.crm.dto.*;
import com.telecom.crm.service.LeadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/leads")
@Tag(name = "Lead Management", description = "Sales leads pipeline, Kanban status transitions, activities, and conversion")
public class LeadController {

    private final LeadService leadService;

    public LeadController(LeadService leadService) {
        this.leadService = leadService;
    }

    @GetMapping
    @Operation(summary = "Search and list sales opportunities with pipeline filters")
    public ResponseEntity<ApiResponse<PageResponse<LeadResponseDto>>> getLeads(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) Long employeeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "id,desc") String[] sort) {

        Sort sorting = Sort.by(Sort.Direction.fromString(sort.length > 1 ? sort[1] : "desc"), sort[0]);
        Pageable pageable = PageRequest.of(page, size, sorting);

        PageResponse<LeadResponseDto> result = leadService.getLeads(query, status, priority, employeeId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get lead opportunity details by ID")
    public ResponseEntity<ApiResponse<LeadResponseDto>> getLeadById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(leadService.getLeadById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CRM_MANAGER', 'SALES_EXECUTIVE')")
    @Operation(summary = "Register new sales lead opportunity")
    public ResponseEntity<ApiResponse<LeadResponseDto>> createLead(@Valid @RequestBody LeadRequestDto request) {
        LeadResponseDto created = leadService.createLead(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Lead registered successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CRM_MANAGER', 'SALES_EXECUTIVE')")
    @Operation(summary = "Update lead details")
    public ResponseEntity<ApiResponse<LeadResponseDto>> updateLead(
            @PathVariable Long id,
            @Valid @RequestBody LeadRequestDto request) {
        LeadResponseDto updated = leadService.updateLead(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Lead updated successfully", updated));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CRM_MANAGER', 'SALES_EXECUTIVE')")
    @Operation(summary = "Update lead stage (Kanban card drag/drop status transition)")
    public ResponseEntity<ApiResponse<LeadResponseDto>> updateLeadStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        String lostReason = body.get("lostReason");
        LeadResponseDto updated = leadService.updateLeadStatus(id, status, lostReason);
        return ResponseEntity.ok(ApiResponse.ok("Lead status updated to " + status, updated));
    }

    @PostMapping("/{id}/activities")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CRM_MANAGER', 'SALES_EXECUTIVE')")
    @Operation(summary = "Log an interaction activity (call, email, demo, meeting) against lead")
    public ResponseEntity<ApiResponse<LeadActivityDto>> addActivity(
            @PathVariable Long id,
            @Valid @RequestBody LeadActivityDto activityDto) {
        LeadActivityDto created = leadService.addActivity(id, activityDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Activity logged successfully", created));
    }

    @GetMapping("/{id}/activities")
    @Operation(summary = "Get all activity history for a lead")
    public ResponseEntity<ApiResponse<List<LeadActivityDto>>> getActivities(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(leadService.getLeadActivities(id)));
    }

    @PostMapping("/{id}/convert")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CRM_MANAGER', 'SALES_EXECUTIVE')")
    @Operation(summary = "Convert qualified lead into permanent customer subscriber")
    public ResponseEntity<ApiResponse<CustomerResponseDto>> convertLead(
            @PathVariable Long id,
            @RequestBody LeadConvertDto convertDto) {
        CustomerResponseDto customer = leadService.convertLeadToCustomer(id, convertDto);
        return ResponseEntity.ok(ApiResponse.ok("Lead converted to customer successfully", customer));
    }
}
