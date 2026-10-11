package com.telecom.crm;

import com.telecom.crm.dto.PaymentRequestDto;
import com.telecom.crm.entity.Customer;
import com.telecom.crm.entity.Invoice;
import com.telecom.crm.entity.Payment;
import com.telecom.crm.exception.BadRequestException;
import com.telecom.crm.repository.*;
import com.telecom.crm.service.impl.BillingServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BillingServiceTest {

    @Mock
    private InvoiceRepository invoiceRepository;

    @Mock
    private InvoiceItemRepository itemRepository;

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private CustomerConnectionRepository connectionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private BillingServiceImpl billingService;

    @Test
    @DisplayName("Should reject payment if idempotency key is already recorded")
    void testRecordPayment_DuplicateIdempotency_ThrowsException() {
        PaymentRequestDto request = new PaymentRequestDto();
        request.setInvoiceId(1L);
        request.setAmount(new BigDecimal("1000.00"));
        request.setIdempotencyKey("IDEMP-KEY-999");

        when(paymentRepository.findByIdempotencyKey("IDEMP-KEY-999"))
                .thenReturn(Optional.of(new Payment()));

        assertThrows(BadRequestException.class, () -> billingService.recordPayment(request, 1L));
        verify(invoiceRepository, never()).save(any(Invoice.class));
    }
}
