package com.telecom.crm.service.impl;

import com.telecom.crm.entity.Employee;
import com.telecom.crm.exception.BadRequestException;
import com.telecom.crm.exception.ResourceNotFoundException;
import com.telecom.crm.repository.EmployeeRepository;
import com.telecom.crm.service.EmployeeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
    }

    @Override
    @Transactional
    public Employee createEmployee(Employee employee) {
        if (employee.getWorkEmail() != null && employeeRepository.findByWorkEmail(employee.getWorkEmail()).isPresent()) {
            throw new BadRequestException("Employee with work email " + employee.getWorkEmail() + " already exists");
        }
        if (employee.getEmployeeCode() == null || employee.getEmployeeCode().isBlank()) {
            employee.setEmployeeCode("EMP-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        }
        employee.setCreatedAt(LocalDateTime.now());
        employee.setUpdatedAt(LocalDateTime.now());
        return employeeRepository.save(employee);
    }

    @Override
    @Transactional
    public Employee updateEmployee(Long id, Employee employee) {
        Employee existing = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));

        existing.setFirstName(employee.getFirstName());
        existing.setLastName(employee.getLastName());
        existing.setWorkPhone(employee.getWorkPhone());
        existing.setDepartment(employee.getDepartment());
        existing.setDesignation(employee.getDesignation());
        existing.setEmploymentStatus(employee.getEmploymentStatus());
        existing.setBranch(employee.getBranch());
        existing.setManager(employee.getManager());
        existing.setUpdatedAt(LocalDateTime.now());

        return employeeRepository.save(existing);
    }
}
