package com.telecom.crm.controller;

import com.telecom.crm.dto.ApiResponse;
import com.telecom.crm.dto.PlanRequestDto;
import com.telecom.crm.dto.PlanResponseDto;
import com.telecom.crm.service.PlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/plans")
@Tag(name = "Telecom Plans", description = "Tariff catalog, prepaid/postpaid plans, and pricing benefits")
public class PlanController {

    private final PlanService planService;

    public PlanController(PlanService planService) {
        this.planService = planService;
    }

    @GetMapping
    @Operation(summary = "Get list of available telecom plans")
    public ResponseEntity<ApiResponse<List<PlanResponseDto>>> getPlans(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type) {
        List<PlanResponseDto> plans = planService.getAllPlans(status, type);
        return ResponseEntity.ok(ApiResponse.ok(plans));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get specific telecom plan details")
    public ResponseEntity<ApiResponse<PlanResponseDto>> getPlanById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(planService.getPlanById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CRM_MANAGER')")
    @Operation(summary = "Create and publish new telecom plan")
    public ResponseEntity<ApiResponse<PlanResponseDto>> createPlan(@Valid @RequestBody PlanRequestDto request) {
        PlanResponseDto created = planService.createPlan(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Plan created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CRM_MANAGER')")
    @Operation(summary = "Update telecom plan pricing and entitlements")
    public ResponseEntity<ApiResponse<PlanResponseDto>> updatePlan(
            @PathVariable Long id,
            @Valid @RequestBody PlanRequestDto request) {
        PlanResponseDto updated = planService.updatePlan(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Plan updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CRM_MANAGER')")
    @Operation(summary = "Deactivate/retire telecom plan")
    public ResponseEntity<ApiResponse<String>> deletePlan(@PathVariable Long id) {
        planService.deletePlan(id);
        return ResponseEntity.ok(ApiResponse.ok("Plan retired successfully", null));
    }
}
