package com.telecom.crm.dto;

import java.time.LocalDateTime;

public class TicketResponseDto {
    private Long id;
    private String ticketCode;
    private Long customerId;
    private String customerName;
    private String customerPhone;
    private Long connectionId;
    private String connectionPhone;
    private String category;
    private String subject;
    private String description;
    private String priority;
    private Long assignedEmployeeId;
    private String assignedEmployeeName;
    private LocalDateTime slaDeadline;
    private String ticketStatus;
    private String resolutionNotes;
    private LocalDateTime closureDate;
    private Integer customerFeedbackRating;
    private String customerFeedbackComments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TicketResponseDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTicketCode() { return ticketCode; }
    public void setTicketCode(String ticketCode) { this.ticketCode = ticketCode; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public Long getConnectionId() { return connectionId; }
    public void setConnectionId(Long connectionId) { this.connectionId = connectionId; }

    public String getConnectionPhone() { return connectionPhone; }
    public void setConnectionPhone(String connectionPhone) { this.connectionPhone = connectionPhone; }

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

    public String getAssignedEmployeeName() { return assignedEmployeeName; }
    public void setAssignedEmployeeName(String assignedEmployeeName) { this.assignedEmployeeName = assignedEmployeeName; }

    public LocalDateTime getSlaDeadline() { return slaDeadline; }
    public void setSlaDeadline(LocalDateTime slaDeadline) { this.slaDeadline = slaDeadline; }

    public String getTicketStatus() { return ticketStatus; }
    public void setTicketStatus(String ticketStatus) { this.ticketStatus = ticketStatus; }

    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }

    public LocalDateTime getClosureDate() { return closureDate; }
    public void setClosureDate(LocalDateTime closureDate) { this.closureDate = closureDate; }

    public Integer getCustomerFeedbackRating() { return customerFeedbackRating; }
    public void setCustomerFeedbackRating(Integer customerFeedbackRating) { this.customerFeedbackRating = customerFeedbackRating; }

    public String getCustomerFeedbackComments() { return customerFeedbackComments; }
    public void setCustomerFeedbackComments(String customerFeedbackComments) { this.customerFeedbackComments = customerFeedbackComments; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
