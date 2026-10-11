package com.telecom.crm.service;

import com.telecom.crm.dto.CustomerRequestDto;
import com.telecom.crm.dto.CustomerResponseDto;
import com.telecom.crm.dto.PageResponse;
import org.springframework.data.domain.Pageable;

public interface CustomerService {
    PageResponse<CustomerResponseDto> getCustomers(String query, String status, String type, Pageable pageable);
    CustomerResponseDto getCustomerById(Long id);
    CustomerResponseDto createCustomer(CustomerRequestDto request);
    CustomerResponseDto updateCustomer(Long id, CustomerRequestDto request);
    CustomerResponseDto updateCustomerStatus(Long id, String status);
}
