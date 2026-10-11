package com.telecom.crm.repository;

import com.telecom.crm.entity.CustomerConnection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerConnectionRepository extends JpaRepository<CustomerConnection, Long> {
    Optional<CustomerConnection> findByConnectionCode(String connectionCode);
    Optional<CustomerConnection> findByMobileNumber(String mobileNumber);
    Optional<CustomerConnection> findBySimIccid(String simIccid);
    boolean existsByMobileNumber(String mobileNumber);
    boolean existsBySimIccid(String simIccid);

    List<CustomerConnection> findByCustomerId(Long customerId);

    @Query("SELECT cc FROM CustomerConnection cc WHERE " +
           "(:query IS NULL OR cc.mobileNumber LIKE CONCAT('%', :query, '%') OR " +
           "cc.simIccid LIKE CONCAT('%', :query, '%') OR " +
           "LOWER(cc.connectionCode) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(cc.customer.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(cc.customer.companyName) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:status IS NULL OR cc.connectionStatus = :status) AND " +
           "(:type IS NULL OR cc.connectionType = :type)")
    Page<CustomerConnection> searchConnections(
        @Param("query") String query,
        @Param("status") String status,
        @Param("type") String type,
        Pageable pageable
    );

    long countByConnectionStatus(String status);
}
