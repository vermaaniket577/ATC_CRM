package com.telecom.crm.repository;

import com.telecom.crm.entity.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
    List<Invoice> findByCustomerId(Long customerId);
    List<Invoice> findByStatus(String status);

    @Query("SELECT i FROM Invoice i WHERE " +
           "(:query IS NULL OR LOWER(i.invoiceNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(i.customer.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(i.customer.companyName) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:status IS NULL OR i.status = :status)")
    Page<Invoice> searchInvoices(@Param("query") String query, @Param("status") String status, Pageable pageable);

    @Query("SELECT COALESCE(SUM(i.totalAmount), 0) FROM Invoice i")
    BigDecimal sumTotalBilled();

    @Query("SELECT COALESCE(SUM(i.paidAmount), 0) FROM Invoice i")
    BigDecimal sumTotalCollected();

    @Query("SELECT COALESCE(SUM(i.outstandingAmount), 0) FROM Invoice i WHERE i.status = 'OVERDUE' OR i.status = 'UNPAID'")
    BigDecimal sumTotalOutstanding();

    long countByStatus(String status);
}
