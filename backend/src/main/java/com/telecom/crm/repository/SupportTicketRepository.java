package com.telecom.crm.repository;

import com.telecom.crm.entity.SupportTicket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    Optional<SupportTicket> findByTicketCode(String ticketCode);
    List<SupportTicket> findByCustomerId(Long customerId);
    List<SupportTicket> findByAssignedEmployeeId(Long employeeId);

    @Query("SELECT t FROM SupportTicket t WHERE " +
           "(:query IS NULL OR LOWER(t.subject) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(t.ticketCode) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(t.customer.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(t.customer.companyName) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:status IS NULL OR t.ticketStatus = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:category IS NULL OR t.category = :category)")
    Page<SupportTicket> searchTickets(
        @Param("query") String query,
        @Param("status") String status,
        @Param("priority") String priority,
        @Param("category") String category,
        Pageable pageable
    );

    long countByTicketStatus(String status);
    long countBySlaDeadlineBeforeAndTicketStatusNotIn(LocalDateTime now, List<String> terminalStatuses);
}
