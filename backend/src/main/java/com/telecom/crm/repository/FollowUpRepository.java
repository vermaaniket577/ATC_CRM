package com.telecom.crm.repository;

import com.telecom.crm.entity.FollowUp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FollowUpRepository extends JpaRepository<FollowUp, Long> {
    List<FollowUp> findByAssignedEmployeeId(Long employeeId);
    List<FollowUp> findByStatus(String status);
    List<FollowUp> findByScheduledAtBetween(LocalDateTime start, LocalDateTime end);
    long countByStatus(String status);
}
