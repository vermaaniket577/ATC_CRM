package com.telecom.crm.repository;

import com.telecom.crm.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByCustomerCode(String customerCode);
    Optional<Customer> findByMobileNumber(String mobileNumber);
    boolean existsByMobileNumber(String mobileNumber);

    @Query("SELECT c FROM Customer c WHERE " +
           "(:query IS NULL OR LOWER(c.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.customerCode) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "c.mobileNumber LIKE CONCAT('%', :query, '%') OR " +
           "LOWER(c.companyName) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:customerType IS NULL OR c.customerType = :customerType)")
    Page<Customer> searchCustomers(
        @Param("query") String query,
        @Param("status") String status,
        @Param("customerType") String customerType,
        Pageable pageable
    );

    long countByStatus(String status);
}
