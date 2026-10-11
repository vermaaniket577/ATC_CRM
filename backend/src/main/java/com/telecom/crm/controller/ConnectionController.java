package com.telecom.crm.controller;

import com.telecom.crm.dto.ApiResponse;
import com.telecom.crm.dto.ConnectionRequestDto;
import com.telecom.crm.dto.ConnectionResponseDto;
import com.telecom.crm.dto.PageResponse;
import com.telecom.crm.service.ConnectionService;
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

import java.util.Map;

@RestController
@RequestMapping("/api/v1/connections")
@Tag(name = "Connection & SIM Management", description = "Telecom MSISDN numbers, eSIM/SIM provisioning, and plan assignments")
public class ConnectionController {

    private final ConnectionService connectionService;

    public ConnectionController(ConnectionService connectionService) {
        this.connectionService = connectionService;
    }

    @GetMapping
    @Operation(summary = "Search and list subscriber telecom connections")
    public ResponseEntity<ApiResponse<PageResponse<ConnectionResponseDto>>> getConnections(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String[] sort) {

        Sort sorting = Sort.by(Sort.Direction.fromString(sort.length > 1 ? sort[1] : "desc"), sort[0]);
        Pageable pageable = PageRequest.of(page, size, sorting);

        PageResponse<ConnectionResponseDto> result = connectionService.getConnections(query, status, type, pageable);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get connection details by ID")
    public ResponseEntity<ApiResponse<ConnectionResponseDto>> getConnectionById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(connectionService.getConnectionById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CRM_MANAGER', 'SALES_EXECUTIVE')")
    @Operation(summary = "Provision and activate new telecom connection / SIM")
    public ResponseEntity<ApiResponse<ConnectionResponseDto>> createConnection(@Valid @RequestBody ConnectionRequestDto request) {
        ConnectionResponseDto created = connectionService.createConnection(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Connection provisioned successfully", created));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CRM_MANAGER', 'SUPPORT_EXECUTIVE', 'FIELD_TECHNICIAN')")
    @Operation(summary = "Update connection status (ACTIVE, SUSPENDED, DEACTIVATED)")
    public ResponseEntity<ApiResponse<ConnectionResponseDto>> updateConnectionStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        ConnectionResponseDto updated = connectionService.updateConnectionStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Connection status updated to " + status, updated));
    }

    @PatchMapping("/{id}/plan")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CRM_MANAGER', 'SALES_EXECUTIVE')")
    @Operation(summary = "Change or upgrade telecom tariff plan")
    public ResponseEntity<ApiResponse<ConnectionResponseDto>> updateConnectionPlan(
            @PathVariable Long id,
            @RequestBody Map<String, Long> body) {
        Long planId = body.get("planId");
        ConnectionResponseDto updated = connectionService.updateConnectionPlan(id, planId);
        return ResponseEntity.ok(ApiResponse.ok("Plan updated successfully", updated));
    }
}
