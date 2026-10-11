package com.telecom.crm.service.impl;

import com.telecom.crm.dto.ConnectionRequestDto;
import com.telecom.crm.dto.ConnectionResponseDto;
import com.telecom.crm.dto.PageResponse;
import com.telecom.crm.entity.Branch;
import com.telecom.crm.entity.Customer;
import com.telecom.crm.entity.CustomerConnection;
import com.telecom.crm.entity.TelecomPlan;
import com.telecom.crm.exception.BadRequestException;
import com.telecom.crm.exception.ResourceNotFoundException;
import com.telecom.crm.repository.BranchRepository;
import com.telecom.crm.repository.CustomerConnectionRepository;
import com.telecom.crm.repository.CustomerRepository;
import com.telecom.crm.repository.TelecomPlanRepository;
import com.telecom.crm.service.ConnectionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class ConnectionServiceImpl implements ConnectionService {

    private final CustomerConnectionRepository connectionRepository;
    private final CustomerRepository customerRepository;
    private final TelecomPlanRepository planRepository;
    private final BranchRepository branchRepository;

    public ConnectionServiceImpl(CustomerConnectionRepository connectionRepository,
                                 CustomerRepository customerRepository,
                                 TelecomPlanRepository planRepository,
                                 BranchRepository branchRepository) {
        this.connectionRepository = connectionRepository;
        this.customerRepository = customerRepository;
        this.planRepository = planRepository;
        this.branchRepository = branchRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ConnectionResponseDto> getConnections(String query, String status, String type, Pageable pageable) {
        Page<CustomerConnection> page = connectionRepository.searchConnections(
                (query != null && !query.isBlank()) ? query.trim() : null,
                (status != null && !status.isBlank()) ? status.trim() : null,
                (type != null && !type.isBlank()) ? type.trim() : null,
                pageable
        );
        return new PageResponse<>(page.map(this::mapToDto));
    }

    @Override
    @Transactional(readOnly = true)
    public ConnectionResponseDto getConnectionById(Long id) {
        CustomerConnection conn = connectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CustomerConnection", "id", id));
        return mapToDto(conn);
    }

    @Override
    @Transactional
    public ConnectionResponseDto createConnection(ConnectionRequestDto request) {
        if (connectionRepository.existsByMobileNumber(request.getMobileNumber())) {
            throw new BadRequestException("Connection with mobile number " + request.getMobileNumber() + " already exists");
        }
        if (connectionRepository.existsBySimIccid(request.getSimIccid())) {
            throw new BadRequestException("SIM ICCID " + request.getSimIccid() + " is already assigned");
        }

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", request.getCustomerId()));

        CustomerConnection conn = new CustomerConnection();
        conn.setConnectionCode("CONN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        conn.setCustomer(customer);
        conn.setMobileNumber(request.getMobileNumber());
        conn.setSimIccid(request.getSimIccid());
        conn.setConnectionType(request.getConnectionType() != null ? request.getConnectionType() : "POSTPAID");
        conn.setOperatorBrand(request.getOperatorBrand() != null ? request.getOperatorBrand() : "Apex Telecom");
        conn.setConnectionStatus(request.getConnectionStatus() != null ? request.getConnectionStatus() : "ACTIVE");
        conn.setKycStatus(request.getKycStatus() != null ? request.getKycStatus() : "VERIFIED");
        conn.setNotes(request.getNotes());
        conn.setActivationDate(LocalDateTime.now());
        conn.setCreatedAt(LocalDateTime.now());
        conn.setUpdatedAt(LocalDateTime.now());

        if (request.getPlanId() != null) {
            TelecomPlan plan = planRepository.findById(request.getPlanId()).orElse(null);
            conn.setPlan(plan);
            if (plan != null) {
                conn.setExpiryDate(LocalDateTime.now().plusDays(plan.getValidityDays()));
            }
        }

        if (request.getAssignedBranchId() != null) {
            Branch branch = branchRepository.findById(request.getAssignedBranchId()).orElse(null);
            conn.setAssignedBranch(branch);
        }

        CustomerConnection saved = connectionRepository.save(conn);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public ConnectionResponseDto updateConnectionStatus(Long id, String status) {
        CustomerConnection conn = connectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CustomerConnection", "id", id));
        conn.setConnectionStatus(status);
        conn.setUpdatedAt(LocalDateTime.now());
        return mapToDto(connectionRepository.save(conn));
    }

    @Override
    @Transactional
    public ConnectionResponseDto updateConnectionPlan(Long id, Long planId) {
        CustomerConnection conn = connectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CustomerConnection", "id", id));
        TelecomPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("TelecomPlan", "id", planId));
        conn.setPlan(plan);
        conn.setExpiryDate(LocalDateTime.now().plusDays(plan.getValidityDays()));
        conn.setUpdatedAt(LocalDateTime.now());
        return mapToDto(connectionRepository.save(conn));
    }

    private ConnectionResponseDto mapToDto(CustomerConnection c) {
        ConnectionResponseDto dto = new ConnectionResponseDto();
        dto.setId(c.getId());
        dto.setConnectionCode(c.getConnectionCode());
        dto.setCustomerId(c.getCustomer().getId());
        dto.setCustomerName(c.getCustomer().getDisplayName());
        dto.setMobileNumber(c.getMobileNumber());
        dto.setSimIccid(c.getSimIccid());
        dto.setConnectionType(c.getConnectionType());
        dto.setOperatorBrand(c.getOperatorBrand());
        dto.setActivationDate(c.getActivationDate());
        dto.setExpiryDate(c.getExpiryDate());
        dto.setConnectionStatus(c.getConnectionStatus());
        dto.setKycStatus(c.getKycStatus());
        dto.setNotes(c.getNotes());
        dto.setCreatedAt(c.getCreatedAt());

        if (c.getPlan() != null) {
            dto.setPlanId(c.getPlan().getId());
            dto.setPlanName(c.getPlan().getName());
        }
        if (c.getAssignedBranch() != null) {
            dto.setAssignedBranchId(c.getAssignedBranch().getId());
            dto.setBranchName(c.getAssignedBranch().getName());
        }

        return dto;
    }
}
