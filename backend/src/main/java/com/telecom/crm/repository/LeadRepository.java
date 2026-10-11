package com.telecom.crm.repository;

import com.telecom.crm.entity.Lead;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {
    Optional<Lead> findByLeadCode(String leadCode);
    List<Lead> findByLeadStatus(String status);
    List<Lead> findByAssignedEmployeeId(Long employeeId);

    @Query("SELECT l FROM Lead l WHERE " +
           "(:query IS NULL OR LOWER(l.prospectName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "l.mobileNumber LIKE CONCAT('%', :query, '%') OR " +
           "LOWER(l.companyName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(l.leadCode) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:status IS NULL OR l.leadStatus = :status) AND " +
           "(:priority IS NULL OR l.priority = :priority) AND " +
           "(:employeeId IS NULL OR l.assignedEmployee.id = :employeeId)")
    Page<Lead> searchLeads(
        @Param("query") String query,
        @Param("status") String status,
        @Param("priority") String priority,
        @Param("employeeId") Long employeeId,
        Pageable pageable
    );

    long countByLeadStatus(String status);
}
