package com.telecom.crm.repository;

import com.telecom.crm.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    Optional<Task> findByTaskCode(String taskCode);
    List<Task> findByAssignedEmployeeId(Long employeeId);
    Page<Task> findByStatus(String status, Pageable pageable);
    long countByStatus(String status);
}
