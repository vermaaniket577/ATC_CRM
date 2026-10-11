package com.telecom.crm.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class LeadActivityDto {
    private Long id;
    private Long leadId;
    private Long employeeId;
    private String employeeName;

    @NotBlank(message = "Activity type is required")
    private String activityType = "CALL"; // CALL, EMAIL, MEETING, DEMO, NOTE

    @NotBlank(message = "Summary is required")
    private String summary;

    private String details;
    private LocalDateTime activityTime = LocalDateTime.now();

    public LeadActivityDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getLeadId() { return leadId; }
    public void setLeadId(Long leadId) { this.leadId = leadId; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getActivityType() { return activityType; }
    public void setActivityType(String activityType) { this.activityType = activityType; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public LocalDateTime getActivityTime() { return activityTime; }
    public void setActivityTime(LocalDateTime activityTime) { this.activityTime = activityTime; }
}
