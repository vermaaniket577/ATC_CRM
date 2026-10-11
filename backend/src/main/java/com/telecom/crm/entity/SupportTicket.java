package com.telecom.crm.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "support_tickets")
public class SupportTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ticket_code", nullable = false, unique = true, length = 30)
    private String ticketCode;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "connection_id")
    private CustomerConnection connection;

    @Column(name = "category", nullable = false, length = 50)
    private String category; // NETWORK_COVERAGE, BILLING_DISPUTE, SIM_SWAP, BROADBAND_FAULT, GENERAL_QUERY

    @Column(name = "subject", nullable = false, length = 255)
    private String subject;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "priority", nullable = false, length = 30)
    private String priority = "MEDIUM"; // LOW, MEDIUM, HIGH, CRITICAL

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_employee_id")
    private Employee assignedEmployee;

    @Column(name = "sla_deadline", nullable = false)
    private LocalDateTime slaDeadline;

    @Column(name = "ticket_status", nullable = false, length = 30)
    private String ticketStatus = "OPEN"; // OPEN, ASSIGNED, IN_PROGRESS, WAITING_FOR_CUSTOMER, ESCALATED, RESOLVED, CLOSED

    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;

    @Column(name = "closure_date")
    private LocalDateTime closureDate;

    @Column(name = "customer_feedback_rating")
    private Integer customerFeedbackRating;

    @Column(name = "customer_feedback_comments", length = 500)
    private String customerFeedbackComments;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<TicketComment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<TicketHistory> history = new ArrayList<>();

    public SupportTicket() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTicketCode() { return ticketCode; }
    public void setTicketCode(String ticketCode) { this.ticketCode = ticketCode; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public CustomerConnection getConnection() { return connection; }
    public void setConnection(CustomerConnection connection) { this.connection = connection; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public Employee getAssignedEmployee() { return assignedEmployee; }
    public void setAssignedEmployee(Employee assignedEmployee) { this.assignedEmployee = assignedEmployee; }

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

    public List<TicketComment> getComments() { return comments; }
    public void setComments(List<TicketComment> comments) { this.comments = comments; }

    public List<TicketHistory> getHistory() { return history; }
    public void setHistory(List<TicketHistory> history) { this.history = history; }
}
