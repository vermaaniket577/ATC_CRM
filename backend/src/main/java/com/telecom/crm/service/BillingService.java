package com.telecom.crm.service;

import com.telecom.crm.dto.*;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BillingService {
    PageResponse<InvoiceResponseDto> getInvoices(String query, String status, Pageable pageable);
    InvoiceResponseDto getInvoiceById(Long id);
    InvoiceResponseDto createInvoice(InvoiceRequestDto request);
    PaymentResponseDto recordPayment(PaymentRequestDto request, Long currentUserId);
    List<PaymentResponseDto> getPaymentsByInvoiceId(Long invoiceId);
    PageResponse<PaymentResponseDto> getAllPayments(Pageable pageable);
}
