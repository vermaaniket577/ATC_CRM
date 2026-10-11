package com.telecom.crm.dto;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class LeadRequestDto {
    @NotBlank(message = "Prospect name is required")
    private String prospectName;

    @NotBlank(message = "Mobile number is required")
    private String mobileNumber;

    private String email;
    private String companyName;
    private String city;
    private String state;

    @NotBlank(message = "Lead source is required")
    private String leadSource = "WEBSITE";

    private String interestedService;
    private BigDecimal estimatedValue = BigDecimal.ZERO;
    private String priority = "MEDIUM";
    private Long assignedEmployeeId;
    private LocalDateTime nextFollowUpDate;
    private String leadStatus = "NEW";
    private String lostReason;
    private String notes;

    public LeadRequestDto() {}

    public String getProspectName() { return prospectName; }
    public void setProspectName(String prospectName) { this.prospectName = prospectName; }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getLeadSource() { return leadSource; }
    public void setLeadSource(String leadSource) { this.leadSource = leadSource; }

    public String getInterestedService() { return interestedService; }
    public void setInterestedService(String interestedService) { this.interestedService = interestedService; }

    public BigDecimal getEstimatedValue() { return estimatedValue; }
    public void setEstimatedValue(BigDecimal estimatedValue) { this.estimatedValue = estimatedValue; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public Long getAssignedEmployeeId() { return assignedEmployeeId; }
    public void setAssignedEmployeeId(Long assignedEmployeeId) { this.assignedEmployeeId = assignedEmployeeId; }

    public LocalDateTime getNextFollowUpDate() { return nextFollowUpDate; }
    public void setNextFollowUpDate(LocalDateTime nextFollowUpDate) { this.nextFollowUpDate = nextFollowUpDate; }

    public String getLeadStatus() { return leadStatus; }
    public void setLeadStatus(String leadStatus) { this.leadStatus = leadStatus; }

    public String getLostReason() { return lostReason; }
    public void setLostReason(String lostReason) { this.lostReason = lostReason; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
