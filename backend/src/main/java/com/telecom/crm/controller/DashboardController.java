package com.telecom.crm.controller;

import com.telecom.crm.dto.ApiResponse;
import com.telecom.crm.dto.DashboardSummaryDto;
import com.telecom.crm.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/dashboard")
@Tag(name = "Dashboard & Analytics", description = "Summary statistics, charts, and executive reporting aggregates")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    @Operation(summary = "Get executive dashboard KPIs and chart datasets")
    public ResponseEntity<ApiResponse<DashboardSummaryDto>> getDashboardSummary() {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.getDashboardSummary()));
    }

    @GetMapping("/sales")
    @Operation(summary = "Get sales-focused metrics and pipeline stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSalesDashboard() {
        DashboardSummaryDto summary = dashboardService.getDashboardSummary();
        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "newLeads", summary.getNewLeads(),
                "convertedLeads", summary.getConvertedLeads(),
                "leadsByStatus", summary.getLeadsByStatus(),
                "salesByExecutive", summary.getSalesByExecutive()
        )));
    }

    @GetMapping("/support")
    @Operation(summary = "Get customer support complaints and SLA metrics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSupportDashboard() {
        DashboardSummaryDto summary = dashboardService.getDashboardSummary();
        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "openComplaints", summary.getOpenComplaints(),
                "resolvedComplaints", summary.getResolvedComplaints(),
                "complaintsByCategory", summary.getComplaintsByCategory()
        )));
    }
}
