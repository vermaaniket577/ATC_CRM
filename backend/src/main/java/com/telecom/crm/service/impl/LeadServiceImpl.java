package com.telecom.crm.service.impl;

import com.telecom.crm.dto.*;
import com.telecom.crm.entity.*;
import com.telecom.crm.exception.BadRequestException;
import com.telecom.crm.exception.ResourceNotFoundException;
import com.telecom.crm.repository.*;
import com.telecom.crm.service.CustomerService;
import com.telecom.crm.service.LeadService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class LeadServiceImpl implements LeadService {

    private final LeadRepository leadRepository;
    private final LeadActivityRepository activityRepository;
    private final EmployeeRepository employeeRepository;
    private final CustomerService customerService;
    private final CustomerConnectionRepository connectionRepository;
    private final TelecomPlanRepository planRepository;
    private final BranchRepository branchRepository;

    public LeadServiceImpl(LeadRepository leadRepository,
                           LeadActivityRepository activityRepository,
                           EmployeeRepository employeeRepository,
                           CustomerService customerService,
                           CustomerConnectionRepository connectionRepository,
                           TelecomPlanRepository planRepository,
                           BranchRepository branchRepository) {
        this.leadRepository = leadRepository;
        this.activityRepository = activityRepository;
        this.employeeRepository = employeeRepository;
        this.customerService = customerService;
        this.connectionRepository = connectionRepository;
        this.planRepository = planRepository;
        this.branchRepository = branchRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<LeadResponseDto> getLeads(String query, String status, String priority, Long employeeId, Pageable pageable) {
        Page<Lead> page = leadRepository.searchLeads(
                (query != null && !query.isBlank()) ? query.trim() : null,
                (status != null && !status.isBlank()) ? status.trim() : null,
                (priority != null && !priority.isBlank()) ? priority.trim() : null,
                employeeId,
                pageable
        );
        return new PageResponse<>(page.map(this::mapToDto));
    }

    @Override
    @Transactional(readOnly = true)
    public LeadResponseDto getLeadById(Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", id));
        return mapToDto(lead);
    }

    @Override
    @Transactional
    public LeadResponseDto createLead(LeadRequestDto request) {
        Lead lead = new Lead();
        lead.setLeadCode("LEAD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        lead.setProspectName(request.getProspectName());
        lead.setMobileNumber(request.getMobileNumber());
        lead.setEmail(request.getEmail());
        lead.setCompanyName(request.getCompanyName());
        lead.setCity(request.getCity());
        lead.setState(request.getState());
        lead.setLeadSource(request.getLeadSource() != null ? request.getLeadSource() : "WEBSITE");
        lead.setInterestedService(request.getInterestedService());
        lead.setEstimatedValue(request.getEstimatedValue());
        lead.setPriority(request.getPriority() != null ? request.getPriority() : "MEDIUM");
        lead.setLeadStatus(request.getLeadStatus() != null ? request.getLeadStatus() : "NEW");
        lead.setNextFollowUpDate(request.getNextFollowUpDate());
        lead.setNotes(request.getNotes());
        lead.setCreatedAt(LocalDateTime.now());
        lead.setUpdatedAt(LocalDateTime.now());

        if (request.getAssignedEmployeeId() != null) {
            Employee emp = employeeRepository.findById(request.getAssignedEmployeeId()).orElse(null);
            lead.setAssignedEmployee(emp);
        }

        Lead saved = leadRepository.save(lead);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public LeadResponseDto updateLead(Long id, LeadRequestDto request) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", id));

        lead.setProspectName(request.getProspectName());
        lead.setMobileNumber(request.getMobileNumber());
        lead.setEmail(request.getEmail());
        lead.setCompanyName(request.getCompanyName());
        lead.setCity(request.getCity());
        lead.setState(request.getState());
        lead.setLeadSource(request.getLeadSource());
        lead.setInterestedService(request.getInterestedService());
        lead.setEstimatedValue(request.getEstimatedValue());
        lead.setPriority(request.getPriority());
        lead.setLeadStatus(request.getLeadStatus());
        lead.setNextFollowUpDate(request.getNextFollowUpDate());
        lead.setLostReason(request.getLostReason());
        lead.setNotes(request.getNotes());
        lead.setUpdatedAt(LocalDateTime.now());

        if (request.getAssignedEmployeeId() != null) {
            Employee emp = employeeRepository.findById(request.getAssignedEmployeeId()).orElse(null);
            lead.setAssignedEmployee(emp);
        }

        Lead updated = leadRepository.save(lead);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public LeadResponseDto updateLeadStatus(Long id, String status, String lostReason) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", id));
        lead.setLeadStatus(status);
        if ("LOST".equalsIgnoreCase(status)) {
            lead.setLostReason(lostReason);
        }
        lead.setUpdatedAt(LocalDateTime.now());
        return mapToDto(leadRepository.save(lead));
    }

    @Override
    @Transactional
    public LeadActivityDto addActivity(Long leadId, LeadActivityDto activityDto) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", leadId));

        LeadActivity activity = new LeadActivity();
        activity.setLead(lead);
        activity.setActivityType(activityDto.getActivityType());
        activity.setSummary(activityDto.getSummary());
        activity.setDetails(activityDto.getDetails());
        activity.setActivityTime(LocalDateTime.now());

        if (activityDto.getEmployeeId() != null) {
            Employee emp = employeeRepository.findById(activityDto.getEmployeeId()).orElse(null);
            activity.setEmployee(emp);
        }

        LeadActivity saved = activityRepository.save(activity);
        activityDto.setId(saved.getId());
        activityDto.setActivityTime(saved.getActivityTime());
        return activityDto;
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeadActivityDto> getLeadActivities(Long leadId) {
        return activityRepository.findByLeadIdOrderByActivityTimeDesc(leadId).stream()
                .map(a -> {
                    LeadActivityDto dto = new LeadActivityDto();
                    dto.setId(a.getId());
                    dto.setLeadId(a.getLead().getId());
                    dto.setActivityType(a.getActivityType());
                    dto.setSummary(a.getSummary());
                    dto.setDetails(a.getDetails());
                    dto.setActivityTime(a.getActivityTime());
                    if (a.getEmployee() != null) {
                        dto.setEmployeeId(a.getEmployee().getId());
                        dto.setEmployeeName(a.getEmployee().getFullName());
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CustomerResponseDto convertLeadToCustomer(Long leadId, LeadConvertDto convertDto) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", leadId));

        if ("CONVERTED".equalsIgnoreCase(lead.getLeadStatus())) {
            throw new BadRequestException("Lead is already converted");
        }

        CustomerRequestDto customerRequest = new CustomerRequestDto();
        customerRequest.setFirstName(lead.getProspectName());
        customerRequest.setMobileNumber(lead.getMobileNumber());
        customerRequest.setEmail(lead.getEmail());
        customerRequest.setCustomerType(convertDto.getCustomerType() != null ? convertDto.getCustomerType() :
                (lead.getCompanyName() != null && !lead.getCompanyName().isBlank() ? "BUSINESS" : "INDIVIDUAL"));
        customerRequest.setCompanyName(lead.getCompanyName());
        customerRequest.setCategory(convertDto.getCategory() != null ? convertDto.getCategory() : "STANDARD");
        customerRequest.setAcquisitionSource("LEAD_CONVERSION");
        customerRequest.setCity(lead.getCity());
        customerRequest.setState(lead.getState());
        customerRequest.setInternalRemarks("Converted from Lead #" + lead.getLeadCode());

        if (lead.getAssignedEmployee() != null) {
            customerRequest.setAssignedEmployeeId(lead.getAssignedEmployee().getId());
        }

        CustomerResponseDto createdCustomer = customerService.createCustomer(customerRequest);

        // Update lead status
        lead.setLeadStatus("CONVERTED");
        lead.setUpdatedAt(LocalDateTime.now());
        leadRepository.save(lead);

        // Record activity
        LeadActivity activity = new LeadActivity();
        activity.setLead(lead);
        activity.setActivityType("NOTE");
        activity.setSummary("Lead successfully converted to Customer #" + createdCustomer.getCustomerCode());
        activity.setActivityTime(LocalDateTime.now());
        activityRepository.save(activity);

        return createdCustomer;
    }

    private LeadResponseDto mapToDto(Lead l) {
        LeadResponseDto dto = new LeadResponseDto();
        dto.setId(l.getId());
        dto.setLeadCode(l.getLeadCode());
        dto.setProspectName(l.getProspectName());
        dto.setMobileNumber(l.getMobileNumber());
        dto.setEmail(l.getEmail());
        dto.setCompanyName(l.getCompanyName());
        dto.setCity(l.getCity());
        dto.setState(l.getState());
        dto.setLeadSource(l.getLeadSource());
        dto.setInterestedService(l.getInterestedService());
        dto.setEstimatedValue(l.getEstimatedValue());
        dto.setPriority(l.getPriority());
        dto.setLeadStatus(l.getLeadStatus());
        dto.setNextFollowUpDate(l.getNextFollowUpDate());
        dto.setLostReason(l.getLostReason());
        dto.setNotes(l.getNotes());
        dto.setCreatedAt(l.getCreatedAt());
        dto.setUpdatedAt(l.getUpdatedAt());

        if (l.getAssignedEmployee() != null) {
            dto.setAssignedEmployeeId(l.getAssignedEmployee().getId());
            dto.setAssignedEmployeeName(l.getAssignedEmployee().getFullName());
        }

        return dto;
    }
}
