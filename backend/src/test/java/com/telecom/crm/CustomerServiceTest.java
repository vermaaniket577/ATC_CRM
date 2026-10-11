package com.telecom.crm;

import com.telecom.crm.dto.CustomerRequestDto;
import com.telecom.crm.dto.CustomerResponseDto;
import com.telecom.crm.entity.Customer;
import com.telecom.crm.exception.BadRequestException;
import com.telecom.crm.repository.CustomerAddressRepository;
import com.telecom.crm.repository.CustomerRepository;
import com.telecom.crm.repository.EmployeeRepository;
import com.telecom.crm.service.impl.CustomerServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private CustomerAddressRepository addressRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private CustomerServiceImpl customerService;

    private CustomerRequestDto sampleRequest;

    @BeforeEach
    void setUp() {
        sampleRequest = new CustomerRequestDto();
        sampleRequest.setFirstName("Vikram");
        sampleRequest.setLastName("Deshmukh");
        sampleRequest.setMobileNumber("+919820011223");
        sampleRequest.setEmail("vikram@apextelecom.in");
        sampleRequest.setCustomerType("INDIVIDUAL");
        sampleRequest.setCategory("VIP");
    }

    @Test
    @DisplayName("Should successfully register a new customer")
    void testCreateCustomer_Success() {
        when(customerRepository.existsByMobileNumber(sampleRequest.getMobileNumber())).thenReturn(false);

        Customer mockCustomer = new Customer();
        mockCustomer.setId(10L);
        mockCustomer.setCustomerCode("CUST-ABCD1234");
        mockCustomer.setFirstName("Vikram");
        mockCustomer.setLastName("Deshmukh");
        mockCustomer.setMobileNumber("+919820011223");
        mockCustomer.setCustomerType("INDIVIDUAL");
        mockCustomer.setStatus("ACTIVE");

        when(customerRepository.save(any(Customer.class))).thenReturn(mockCustomer);

        CustomerResponseDto response = customerService.createCustomer(sampleRequest);

        assertNotNull(response);
        assertEquals("Vikram", response.getFirstName());
        assertEquals("+919820011223", response.getMobileNumber());
        verify(customerRepository, times(1)).save(any(Customer.class));
    }

    @Test
    @DisplayName("Should throw BadRequestException if mobile number already registered")
    void testCreateCustomer_DuplicateMobile_ThrowsException() {
        when(customerRepository.existsByMobileNumber(sampleRequest.getMobileNumber())).thenReturn(true);

        assertThrows(BadRequestException.class, () -> customerService.createCustomer(sampleRequest));
        verify(customerRepository, never()).save(any(Customer.class));
    }
}
