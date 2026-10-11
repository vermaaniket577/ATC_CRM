package com.telecom.crm.repository;

import com.telecom.crm.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmployeeCode(String employeeCode);
    Optional<Employee> findByWorkEmail(String workEmail);
    Optional<Employee> findByUserId(Long userId);
    List<Employee> findByDepartment(String department);
    List<Employee> findByBranchId(Long branchId);
    List<Employee> findByEmploymentStatus(String status);
}
