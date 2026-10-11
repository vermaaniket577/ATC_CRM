package com.telecom.crm.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class LeadResponseDto {
    private Long id;
    private String leadCode;
    private String prospectName;
    private String mobileNumber;
    private String email;
    private String companyName;
    private String city;
    private String state;
    private String leadSource;
    private String interestedService;
    private BigDecimal estimatedValue;
    private String priority;
    private Long assignedEmployeeId;
    private String assignedEmployeeName;
    private LocalDateTime nextFollowUpDate;
    private String leadStatus;
    private String lostReason;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public LeadResponseDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLeadCode() { return leadCode; }
    public void setLeadCode(String leadCode) { this.leadCode = leadCode; }

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

    public String getAssignedEmployeeName() { return assignedEmployeeName; }
    public void setAssignedEmployeeName(String assignedEmployeeName) { this.assignedEmployeeName = assignedEmployeeName; }

    public LocalDateTime getNextFollowUpDate() { return nextFollowUpDate; }
    public void setNextFollowUpDate(LocalDateTime nextFollowUpDate) { this.nextFollowUpDate = nextFollowUpDate; }

    public String getLeadStatus() { return leadStatus; }
    public void setLeadStatus(String leadStatus) { this.leadStatus = leadStatus; }

    public String getLostReason() { return lostReason; }
    public void setLostReason(String lostReason) { this.lostReason = lostReason; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
