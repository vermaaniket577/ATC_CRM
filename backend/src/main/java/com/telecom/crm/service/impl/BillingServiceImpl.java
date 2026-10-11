package com.telecom.crm.service.impl;

import com.telecom.crm.dto.*;
import com.telecom.crm.entity.*;
import com.telecom.crm.exception.BadRequestException;
import com.telecom.crm.exception.ResourceNotFoundException;
import com.telecom.crm.repository.*;
import com.telecom.crm.service.BillingService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BillingServiceImpl implements BillingService {

    private final InvoiceRepository invoiceRepository;
    private final InvoiceItemRepository itemRepository;
    private final PaymentRepository paymentRepository;
    private final CustomerRepository customerRepository;
    private final CustomerConnectionRepository connectionRepository;
    private final UserRepository userRepository;

    public BillingServiceImpl(InvoiceRepository invoiceRepository,
                              InvoiceItemRepository itemRepository,
                              PaymentRepository paymentRepository,
                              CustomerRepository customerRepository,
                              CustomerConnectionRepository connectionRepository,
                              UserRepository userRepository) {
        this.invoiceRepository = invoiceRepository;
        this.itemRepository = itemRepository;
        this.paymentRepository = paymentRepository;
        this.customerRepository = customerRepository;
        this.connectionRepository = connectionRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<InvoiceResponseDto> getInvoices(String query, String status, Pageable pageable) {
        Page<Invoice> page = invoiceRepository.searchInvoices(
                (query != null && !query.isBlank()) ? query.trim() : null,
                (status != null && !status.isBlank()) ? status.trim() : null,
                pageable
        );
        return new PageResponse<>(page.map(this::mapInvoiceToDto));
    }

    @Override
    @Transactional(readOnly = true)
    public InvoiceResponseDto getInvoiceById(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "id", id));
        return mapInvoiceToDto(invoice);
    }

    @Override
    @Transactional
    public InvoiceResponseDto createInvoice(InvoiceRequestDto request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", request.getCustomerId()));

        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber("INV-" + LocalDateTime.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        invoice.setCustomer(customer);
        invoice.setBillingPeriodStart(request.getBillingPeriodStart());
        invoice.setBillingPeriodEnd(request.getBillingPeriodEnd());
        invoice.setInvoiceDate(request.getInvoiceDate());
        invoice.setDueDate(request.getDueDate());
        invoice.setDiscountAmount(request.getDiscountAmount() != null ? request.getDiscountAmount() : BigDecimal.ZERO);
        invoice.setStatus("UNPAID");
        invoice.setCreatedAt(LocalDateTime.now());
        invoice.setUpdatedAt(LocalDateTime.now());

        if (request.getConnectionId() != null) {
            CustomerConnection conn = connectionRepository.findById(request.getConnectionId()).orElse(null);
            invoice.setConnection(conn);
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal taxAmount = BigDecimal.ZERO;

        List<InvoiceItem> items = new ArrayList<>();
        for (InvoiceItemDto itemDto : request.getItems()) {
            InvoiceItem item = new InvoiceItem();
            item.setInvoice(invoice);
            item.setDescription(itemDto.getDescription());
            item.setQuantity(itemDto.getQuantity() != null ? itemDto.getQuantity() : 1);
            item.setUnitPrice(itemDto.getUnitPrice());
            BigDecimal rate = itemDto.getTaxRatePercent() != null ? itemDto.getTaxRatePercent() : new BigDecimal("18.00");
            item.setTaxRatePercent(rate);

            BigDecimal lineSub = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            BigDecimal lineTax = lineSub.multiply(rate).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            BigDecimal lineTotal = lineSub.add(lineTax);

            item.setTotalPrice(lineTotal);
            items.add(item);

            subtotal = subtotal.add(lineSub);
            taxAmount = taxAmount.add(lineTax);
        }

        BigDecimal total = subtotal.add(taxAmount).subtract(invoice.getDiscountAmount());
        if (total.compareTo(BigDecimal.ZERO) < 0) total = BigDecimal.ZERO;

        invoice.setSubtotal(subtotal);
        invoice.setTaxAmount(taxAmount);
        invoice.setTotalAmount(total);
        invoice.setPaidAmount(BigDecimal.ZERO);
        invoice.setOutstandingAmount(total);

        Invoice saved = invoiceRepository.save(invoice);
        itemRepository.saveAll(items);
        saved.setItems(items);

        return mapInvoiceToDto(saved);
    }

    @Override
    @Transactional
    public PaymentResponseDto recordPayment(PaymentRequestDto request, Long currentUserId) {
        // Idempotency check
        if (request.getIdempotencyKey() != null && !request.getIdempotencyKey().isBlank()) {
            paymentRepository.findByIdempotencyKey(request.getIdempotencyKey()).ifPresent(existing -> {
                throw new BadRequestException("Duplicate transaction: Payment already processed for idempotency key: " + request.getIdempotencyKey());
            });
        }

        Invoice invoice = invoiceRepository.findById(request.getInvoiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "id", request.getInvoiceId()));

        if ("PAID".equalsIgnoreCase(invoice.getStatus())) {
            throw new BadRequestException("Invoice is already fully paid");
        }

        Payment payment = new Payment();
        payment.setTransactionRef(request.getTransactionRef() != null && !request.getTransactionRef().isBlank() ?
                request.getTransactionRef() :
                "TXN-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase());
        payment.setInvoice(invoice);
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setGatewayStatus("SUCCESS");
        payment.setIdempotencyKey(request.getIdempotencyKey());
        payment.setNotes(request.getNotes());
        payment.setPaymentDate(LocalDateTime.now());
        payment.setCreatedAt(LocalDateTime.now());

        if (currentUserId != null) {
            userRepository.findById(currentUserId).ifPresent(payment::setReceivedByUser);
        }

        Payment savedPayment = paymentRepository.save(payment);

        // Update invoice ledger
        BigDecimal newPaid = invoice.getPaidAmount().add(request.getAmount());
        BigDecimal newOutstanding = invoice.getTotalAmount().subtract(newPaid);
        if (newOutstanding.compareTo(BigDecimal.ZERO) <= 0) {
            invoice.setOutstandingAmount(BigDecimal.ZERO);
            invoice.setStatus("PAID");
        } else {
            invoice.setOutstandingAmount(newOutstanding);
            invoice.setStatus("PARTIALLY_PAID");
        }
        invoice.setPaidAmount(newPaid);
        invoice.setUpdatedAt(LocalDateTime.now());
        invoiceRepository.save(invoice);

        return mapPaymentToDto(savedPayment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponseDto> getPaymentsByInvoiceId(Long invoiceId) {
        return paymentRepository.findByInvoiceId(invoiceId).stream()
                .map(this::mapPaymentToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<PaymentResponseDto> getAllPayments(Pageable pageable) {
        Page<Payment> page = paymentRepository.findAll(pageable);
        return new PageResponse<>(page.map(this::mapPaymentToDto));
    }

    private InvoiceResponseDto mapInvoiceToDto(Invoice inv) {
        InvoiceResponseDto dto = new InvoiceResponseDto();
        dto.setId(inv.getId());
        dto.setInvoiceNumber(inv.getInvoiceNumber());
        dto.setCustomerId(inv.getCustomer().getId());
        dto.setCustomerName(inv.getCustomer().getDisplayName());
        dto.setCustomerMobile(inv.getCustomer().getMobileNumber());
        dto.setBillingPeriodStart(inv.getBillingPeriodStart());
        dto.setBillingPeriodEnd(inv.getBillingPeriodEnd());
        dto.setInvoiceDate(inv.getInvoiceDate());
        dto.setDueDate(inv.getDueDate());
        dto.setSubtotal(inv.getSubtotal());
        dto.setTaxAmount(inv.getTaxAmount());
        dto.setDiscountAmount(inv.getDiscountAmount());
        dto.setTotalAmount(inv.getTotalAmount());
        dto.setPaidAmount(inv.getPaidAmount());
        dto.setOutstandingAmount(inv.getOutstandingAmount());
        dto.setStatus(inv.getStatus());
        dto.setCreatedAt(inv.getCreatedAt());

        if (inv.getConnection() != null) {
            dto.setConnectionId(inv.getConnection().getId());
            dto.setConnectionPhone(inv.getConnection().getMobileNumber());
        }

        List<InvoiceItem> items = itemRepository.findByInvoiceId(inv.getId());
        dto.setItems(items.stream().map(it -> {
            InvoiceItemDto idto = new InvoiceItemDto();
            idto.setId(it.getId());
            idto.setDescription(it.getDescription());
            idto.setQuantity(it.getQuantity());
            idto.setUnitPrice(it.getUnitPrice());
            idto.setTaxRatePercent(it.getTaxRatePercent());
            idto.setTotalPrice(it.getTotalPrice());
            return idto;
        }).collect(Collectors.toList()));

        return dto;
    }

    private PaymentResponseDto mapPaymentToDto(Payment p) {
        PaymentResponseDto dto = new PaymentResponseDto();
        dto.setId(p.getId());
        dto.setTransactionRef(p.getTransactionRef());
        dto.setInvoiceId(p.getInvoice().getId());
        dto.setInvoiceNumber(p.getInvoice().getInvoiceNumber());
        dto.setCustomerName(p.getInvoice().getCustomer().getDisplayName());
        dto.setPaymentDate(p.getPaymentDate());
        dto.setAmount(p.getAmount());
        dto.setPaymentMethod(p.getPaymentMethod());
        dto.setGatewayStatus(p.getGatewayStatus());
        dto.setIdempotencyKey(p.getIdempotencyKey());
        dto.setNotes(p.getNotes());
        if (p.getReceivedByUser() != null) {
            dto.setReceivedByUserName(p.getReceivedByUser().getFullName());
        }
        return dto;
    }
}
