package com.telecom.crm.controller;

import com.telecom.crm.dto.ApiResponse;
import com.telecom.crm.dto.CustomerRequestDto;
import com.telecom.crm.dto.CustomerResponseDto;
import com.telecom.crm.dto.PageResponse;
import com.telecom.crm.service.CustomerService;
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
@RequestMapping("/api/v1/customers")
@Tag(name = "Customer Management", description = "Subscriber directory, registration, search, and status lifecycle")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    @Operation(summary = "Search and list customer subscribers with pagination")
    public ResponseEntity<ApiResponse<PageResponse<CustomerResponseDto>>> getCustomers(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String[] sort) {

        Sort sorting = Sort.by(Sort.Direction.fromString(sort.length > 1 ? sort[1] : "desc"), sort[0]);
        Pageable pageable = PageRequest.of(page, size, sorting);

        PageResponse<CustomerResponseDto> result = customerService.getCustomers(query, status, type, pageable);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single subscriber profile by customer ID")
    public ResponseEntity<ApiResponse<CustomerResponseDto>> getCustomerById(@PathVariable Long id) {
        CustomerResponseDto customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(ApiResponse.ok(customer));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CRM_MANAGER', 'SALES_EXECUTIVE')")
    @Operation(summary = "Register new customer record")
    public ResponseEntity<ApiResponse<CustomerResponseDto>> createCustomer(@Valid @RequestBody CustomerRequestDto request) {
        CustomerResponseDto created = customerService.createCustomer(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Customer registered successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CRM_MANAGER', 'SALES_EXECUTIVE', 'SUPPORT_EXECUTIVE')")
    @Operation(summary = "Update customer record details")
    public ResponseEntity<ApiResponse<CustomerResponseDto>> updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody CustomerRequestDto request) {
        CustomerResponseDto updated = customerService.updateCustomer(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Customer updated successfully", updated));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CRM_MANAGER')")
    @Operation(summary = "Update customer operational status (ACTIVE, SUSPENDED, ARCHIVED)")
    public ResponseEntity<ApiResponse<CustomerResponseDto>> updateCustomerStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        CustomerResponseDto updated = customerService.updateCustomerStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Customer status updated to " + status, updated));
    }
}
