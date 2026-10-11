package com.telecom.crm.repository;

import com.telecom.crm.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByTransactionRef(String transactionRef);
    Optional<Payment> findByIdempotencyKey(String idempotencyKey);
    List<Payment> findByInvoiceId(Long invoiceId);
    Page<Payment> findByGatewayStatus(String gatewayStatus, Pageable pageable);
}
