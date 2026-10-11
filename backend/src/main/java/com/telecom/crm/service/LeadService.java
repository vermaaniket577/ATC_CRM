package com.telecom.crm.service;

import com.telecom.crm.dto.*;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface LeadService {
    PageResponse<LeadResponseDto> getLeads(String query, String status, String priority, Long employeeId, Pageable pageable);
    LeadResponseDto getLeadById(Long id);
    LeadResponseDto createLead(LeadRequestDto request);
    LeadResponseDto updateLead(Long id, LeadRequestDto request);
    LeadResponseDto updateLeadStatus(Long id, String status, String lostReason);
    LeadActivityDto addActivity(Long leadId, LeadActivityDto activityDto);
    List<LeadActivityDto> getLeadActivities(Long leadId);
    CustomerResponseDto convertLeadToCustomer(Long leadId, LeadConvertDto convertDto);
}
