package com.telecom.crm.controller;

import com.telecom.crm.dto.ApiResponse;
import com.telecom.crm.dto.PageResponse;
import com.telecom.crm.dto.TicketCommentDto;
import com.telecom.crm.dto.TicketRequestDto;
import com.telecom.crm.dto.TicketResponseDto;
import com.telecom.crm.security.SecurityUser;
import com.telecom.crm.service.TicketService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/tickets")
@Tag(name = "Customer Complaints & SLA Tickets", description = "Ticket logging, SLA prioritization, technician assignments, and comments")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping
    @Operation(summary = "Search and list support tickets with SLA filters")
    public ResponseEntity<ApiResponse<PageResponse<TicketResponseDto>>> getTickets(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String[] sort) {

        Sort sorting = Sort.by(Sort.Direction.fromString(sort.length > 1 ? sort[1] : "desc"), sort[0]);
        Pageable pageable = PageRequest.of(page, size, sorting);

        PageResponse<TicketResponseDto> result = ticketService.getTickets(query, status, priority, category, pageable);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single support ticket with details")
    public ResponseEntity<ApiResponse<TicketResponseDto>> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(ticketService.getTicketById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CRM_MANAGER', 'SUPPORT_EXECUTIVE', 'SALES_EXECUTIVE')")
    @Operation(summary = "Log new customer complaint or technical incident")
    public ResponseEntity<ApiResponse<TicketResponseDto>> createTicket(@Valid @RequestBody TicketRequestDto request) {
        TicketResponseDto created = ticketService.createTicket(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Ticket created successfully", created));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CRM_MANAGER', 'SUPPORT_EXECUTIVE')")
    @Operation(summary = "Assign ticket to support executive or field technician")
    public ResponseEntity<ApiResponse<TicketResponseDto>> assignTicket(
            @PathVariable Long id,
            @RequestBody Map<String, Long> body) {
        Long employeeId = body.get("employeeId");
        TicketResponseDto updated = ticketService.assignTicket(id, employeeId);
        return ResponseEntity.ok(ApiResponse.ok("Ticket assigned successfully", updated));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CRM_MANAGER', 'SUPPORT_EXECUTIVE', 'FIELD_TECHNICIAN')")
    @Operation(summary = "Update ticket resolution status (OPEN, IN_PROGRESS, RESOLVED, CLOSED)")
    public ResponseEntity<ApiResponse<TicketResponseDto>> updateTicketStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal SecurityUser user) {
        String status = body.get("status");
        String resolutionNotes = body.get("resolutionNotes");
        Long userId = user != null ? user.getId() : null;

        TicketResponseDto updated = ticketService.updateTicketStatus(id, status, resolutionNotes, userId);
        return ResponseEntity.ok(ApiResponse.ok("Ticket status updated to " + status, updated));
    }

    @PostMapping("/{id}/comments")
    @Operation(summary = "Add internal note or customer comment to ticket thread")
    public ResponseEntity<ApiResponse<TicketCommentDto>> addComment(
            @PathVariable Long id,
            @Valid @RequestBody TicketCommentDto commentDto,
            @AuthenticationPrincipal SecurityUser user) {
        Long userId = user != null ? user.getId() : 1L;
        TicketCommentDto created = ticketService.addComment(id, commentDto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Comment added successfully", created));
    }

    @GetMapping("/{id}/comments")
    @Operation(summary = "Get comments thread for a ticket")
    public ResponseEntity<ApiResponse<List<TicketCommentDto>>> getComments(
            @PathVariable Long id,
            @RequestParam(defaultValue = "true") boolean includeInternal) {
        return ResponseEntity.ok(ApiResponse.ok(ticketService.getComments(id, includeInternal)));
    }
}
