package com.telecom.crm.controller;

import com.telecom.crm.dto.ApiResponse;
import com.telecom.crm.entity.Employee;
import com.telecom.crm.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/employees")
@Tag(name = "Employee Directory", description = "Telecom staff administration and department roles")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    @Operation(summary = "List all company employees")
    public ResponseEntity<ApiResponse<List<Employee>>> getEmployees() {
        return ResponseEntity.ok(ApiResponse.ok(employeeService.getAllEmployees()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get employee by ID")
    public ResponseEntity<ApiResponse<Employee>> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(employeeService.getEmployeeById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Create new employee record")
    public ResponseEntity<ApiResponse<Employee>> createEmployee(@RequestBody Employee employee) {
        Employee created = employeeService.createEmployee(employee);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Employee created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Update employee record")
    public ResponseEntity<ApiResponse<Employee>> updateEmployee(@PathVariable Long id, @RequestBody Employee employee) {
        Employee updated = employeeService.updateEmployee(id, employee);
        return ResponseEntity.ok(ApiResponse.ok("Employee updated successfully", updated));
    }
}
