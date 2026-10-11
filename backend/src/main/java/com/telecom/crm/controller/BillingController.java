package com.telecom.crm.controller;

import com.telecom.crm.dto.*;
import com.telecom.crm.security.SecurityUser;
import com.telecom.crm.service.BillingService;
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

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Billing & Payments", description = "Invoicing, tax line-items, and idempotent payment processing")
public class BillingController {

    private final BillingService billingService;

    public BillingController(BillingService billingService) {
        this.billingService = billingService;
    }

    @GetMapping("/invoices")
    @Operation(summary = "Search and list billing invoices")
    public ResponseEntity<ApiResponse<PageResponse<InvoiceResponseDto>>> getInvoices(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String[] sort) {

        Sort sorting = Sort.by(Sort.Direction.fromString(sort.length > 1 ? sort[1] : "desc"), sort[0]);
        Pageable pageable = PageRequest.of(page, size, sorting);

        PageResponse<InvoiceResponseDto> result = billingService.getInvoices(query, status, pageable);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/invoices/{id}")
    @Operation(summary = "Get detailed tax invoice with itemized breakdown")
    public ResponseEntity<ApiResponse<InvoiceResponseDto>> getInvoiceById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(billingService.getInvoiceById(id)));
    }

    @PostMapping("/invoices")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CRM_MANAGER', 'BILLING_EXECUTIVE')")
    @Operation(summary = "Generate new billing invoice")
    public ResponseEntity<ApiResponse<InvoiceResponseDto>> createInvoice(@Valid @RequestBody InvoiceRequestDto request) {
        InvoiceResponseDto created = billingService.createInvoice(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Invoice generated successfully", created));
    }

    @PostMapping("/payments")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CRM_MANAGER', 'BILLING_EXECUTIVE')")
    @Operation(summary = "Record verified settlement payment against invoice (idempotent)")
    public ResponseEntity<ApiResponse<PaymentResponseDto>> recordPayment(
            @Valid @RequestBody PaymentRequestDto request,
            @AuthenticationPrincipal SecurityUser user) {
        Long userId = user != null ? user.getId() : 1L;
        PaymentResponseDto payment = billingService.recordPayment(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Payment recorded successfully", payment));
    }

    @GetMapping("/invoices/{id}/payments")
    @Operation(summary = "Get payments recorded for an invoice")
    public ResponseEntity<ApiResponse<List<PaymentResponseDto>>> getPaymentsByInvoiceId(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(billingService.getPaymentsByInvoiceId(id)));
    }

    @GetMapping("/payments")
    @Operation(summary = "List all payments history with pagination")
    public ResponseEntity<ApiResponse<PageResponse<PaymentResponseDto>>> getAllPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("paymentDate").descending());
        return ResponseEntity.ok(ApiResponse.ok(billingService.getAllPayments(pageable)));
    }
}
