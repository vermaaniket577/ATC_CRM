package com.telecom.crm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class TicketRequestDto {
    @NotNull(message = "Customer ID is required")
    private Long customerId;

    private Long connectionId;

    @NotBlank(message = "Complaint category is required")
    private String category = "GENERAL_QUERY"; // NETWORK_COVERAGE, BILLING_DISPUTE, SIM_SWAP, BROADBAND_FAULT, GENERAL_QUERY

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Description is required")
    private String description;

    private String priority = "MEDIUM"; // LOW, MEDIUM, HIGH, CRITICAL
    private Long assignedEmployeeId;
    private String ticketStatus = "OPEN";
    private LocalDateTime slaDeadline;

    public TicketRequestDto() {}

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public Long getConnectionId() { return connectionId; }
    public void setConnectionId(Long connectionId) { this.connectionId = connectionId; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public Long getAssignedEmployeeId() { return assignedEmployeeId; }
    public void setAssignedEmployeeId(Long assignedEmployeeId) { this.assignedEmployeeId = assignedEmployeeId; }

    public String getTicketStatus() { return ticketStatus; }
    public void setTicketStatus(String ticketStatus) { this.ticketStatus = ticketStatus; }

    public LocalDateTime getSlaDeadline() { return slaDeadline; }
    public void setSlaDeadline(LocalDateTime slaDeadline) { this.slaDeadline = slaDeadline; }
}
