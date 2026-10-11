package com.telecom.crm.service;

import com.telecom.crm.entity.Branch;
import com.telecom.crm.entity.Employee;

import java.util.List;

public interface EmployeeService {
    List<Employee> getAllEmployees();
    Employee getEmployeeById(Long id);
    Employee createEmployee(Employee employee);
    Employee updateEmployee(Long id, Employee employee);
}
