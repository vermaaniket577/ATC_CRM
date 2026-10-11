package com.telecom.crm.service.impl;

import com.telecom.crm.dto.CustomerRequestDto;
import com.telecom.crm.dto.CustomerResponseDto;
import com.telecom.crm.dto.PageResponse;
import com.telecom.crm.entity.Customer;
import com.telecom.crm.entity.CustomerAddress;
import com.telecom.crm.entity.Employee;
import com.telecom.crm.exception.BadRequestException;
import com.telecom.crm.exception.ResourceNotFoundException;
import com.telecom.crm.repository.CustomerAddressRepository;
import com.telecom.crm.repository.CustomerRepository;
import com.telecom.crm.repository.EmployeeRepository;
import com.telecom.crm.service.CustomerService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerAddressRepository addressRepository;
    private final EmployeeRepository employeeRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository,
                               CustomerAddressRepository addressRepository,
                               EmployeeRepository employeeRepository) {
        this.customerRepository = customerRepository;
        this.addressRepository = addressRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CustomerResponseDto> getCustomers(String query, String status, String type, Pageable pageable) {
        Page<Customer> page = customerRepository.searchCustomers(
                (query != null && !query.isBlank()) ? query.trim() : null,
                (status != null && !status.isBlank()) ? status.trim() : null,
                (type != null && !type.isBlank()) ? type.trim() : null,
                pageable
        );
        Page<CustomerResponseDto> dtoPage = page.map(this::mapToDto);
        return new PageResponse<>(dtoPage);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponseDto getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));
        return mapToDto(customer);
    }

    @Override
    @Transactional
    public CustomerResponseDto createCustomer(CustomerRequestDto request) {
        if (customerRepository.existsByMobileNumber(request.getMobileNumber())) {
            throw new BadRequestException("Customer with mobile number " + request.getMobileNumber() + " already exists");
        }

        Customer customer = new Customer();
        customer.setCustomerCode("CUST-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        customer.setFirstName(request.getFirstName());
        customer.setLastName(request.getLastName());
        customer.setMobileNumber(request.getMobileNumber());
        customer.setAlternatePhone(request.getAlternatePhone());
        customer.setEmail(request.getEmail());
        customer.setCustomerType(request.getCustomerType() != null ? request.getCustomerType() : "INDIVIDUAL");
        customer.setCompanyName(request.getCompanyName());
        customer.setDob(request.getDob());
        customer.setCategory(request.getCategory() != null ? request.getCategory() : "STANDARD");
        customer.setAcquisitionSource(request.getAcquisitionSource() != null ? request.getAcquisitionSource() : "ONLINE");
        customer.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");
        customer.setInternalRemarks(request.getInternalRemarks());
        customer.setRegisteredAt(LocalDateTime.now());
        customer.setUpdatedAt(LocalDateTime.now());

        if (request.getAssignedEmployeeId() != null) {
            Employee emp = employeeRepository.findById(request.getAssignedEmployeeId()).orElse(null);
            customer.setAssignedEmployee(emp);
        }

        Customer savedCustomer = customerRepository.save(customer);

        // Save primary address if provided
        if (request.getAddressLine1() != null && !request.getAddressLine1().isBlank()) {
            CustomerAddress address = new CustomerAddress();
            address.setCustomer(savedCustomer);
            address.setAddressType("BILLING");
            address.setAddressLine1(request.getAddressLine1());
            address.setAddressLine2(request.getAddressLine2());
            address.setCity(request.getCity() != null ? request.getCity() : "Mumbai");
            address.setState(request.getState() != null ? request.getState() : "Maharashtra");
            address.setPinCode(request.getPinCode() != null ? request.getPinCode() : "400001");
            address.setIsPrimary(true);
            addressRepository.save(address);
        }

        return mapToDto(savedCustomer);
    }

    @Override
    @Transactional
    public CustomerResponseDto updateCustomer(Long id, CustomerRequestDto request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));

        customer.setFirstName(request.getFirstName());
        customer.setLastName(request.getLastName());
        customer.setAlternatePhone(request.getAlternatePhone());
        customer.setEmail(request.getEmail());
        customer.setCustomerType(request.getCustomerType());
        customer.setCompanyName(request.getCompanyName());
        customer.setDob(request.getDob());
        customer.setCategory(request.getCategory());
        customer.setAcquisitionSource(request.getAcquisitionSource());
        customer.setInternalRemarks(request.getInternalRemarks());
        customer.setUpdatedAt(LocalDateTime.now());

        if (request.getStatus() != null) {
            customer.setStatus(request.getStatus());
        }

        if (request.getAssignedEmployeeId() != null) {
            Employee emp = employeeRepository.findById(request.getAssignedEmployeeId()).orElse(null);
            customer.setAssignedEmployee(emp);
        }

        Customer updated = customerRepository.save(customer);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public CustomerResponseDto updateCustomerStatus(Long id, String status) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));
        customer.setStatus(status);
        customer.setUpdatedAt(LocalDateTime.now());
        return mapToDto(customerRepository.save(customer));
    }

    private CustomerResponseDto mapToDto(Customer c) {
        CustomerResponseDto dto = new CustomerResponseDto();
        dto.setId(c.getId());
        dto.setCustomerCode(c.getCustomerCode());
        dto.setFirstName(c.getFirstName());
        dto.setLastName(c.getLastName());
        dto.setFullName(c.getDisplayName());
        dto.setMobileNumber(c.getMobileNumber());
        dto.setAlternatePhone(c.getAlternatePhone());
        dto.setEmail(c.getEmail());
        dto.setCustomerType(c.getCustomerType());
        dto.setCompanyName(c.getCompanyName());
        dto.setDob(c.getDob());
        dto.setCategory(c.getCategory());
        dto.setAcquisitionSource(c.getAcquisitionSource());
        dto.setStatus(c.getStatus());
        dto.setInternalRemarks(c.getInternalRemarks());
        dto.setRegisteredAt(c.getRegisteredAt());

        if (c.getAssignedEmployee() != null) {
            dto.setAssignedEmployeeId(c.getAssignedEmployee().getId());
            dto.setAssignedEmployeeName(c.getAssignedEmployee().getFullName());
        }

        // Primary address
        addressRepository.findByCustomerId(c.getId()).stream()
                .filter(a -> Boolean.TRUE.equals(a.getIsPrimary()))
                .findFirst()
                .ifPresent(addr -> dto.setPrimaryAddress(
                        addr.getAddressLine1() + ", " + addr.getCity() + ", " + addr.getState() + " - " + addr.getPinCode()
                ));

        return dto;
    }
}
