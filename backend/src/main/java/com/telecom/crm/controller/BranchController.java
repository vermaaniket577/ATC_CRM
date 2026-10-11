package com.telecom.crm.controller;

import com.telecom.crm.dto.ApiResponse;
import com.telecom.crm.entity.Branch;
import com.telecom.crm.service.BranchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/branches")
@Tag(name = "Branch Circles", description = "Telecom regional circles and operational stores")
public class BranchController {

    private final BranchService branchService;

    public BranchController(BranchService branchService) {
        this.branchService = branchService;
    }

    @GetMapping
    @Operation(summary = "List all telecom regional branches")
    public ResponseEntity<ApiResponse<List<Branch>>> getBranches() {
        return ResponseEntity.ok(ApiResponse.ok(branchService.getAllBranches()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get branch details by ID")
    public ResponseEntity<ApiResponse<Branch>> getBranchById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(branchService.getBranchById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Create new circle/branch office")
    public ResponseEntity<ApiResponse<Branch>> createBranch(@RequestBody Branch branch) {
        Branch created = branchService.createBranch(branch);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Branch created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Update branch details")
    public ResponseEntity<ApiResponse<Branch>> updateBranch(@PathVariable Long id, @RequestBody Branch branch) {
        Branch updated = branchService.updateBranch(id, branch);
        return ResponseEntity.ok(ApiResponse.ok("Branch updated successfully", updated));
    }
}
