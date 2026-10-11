package com.telecom.crm.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "leads")
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "lead_code", nullable = false, unique = true, length = 30)
    private String leadCode;

    @Column(name = "prospect_name", nullable = false, length = 150)
    private String prospectName;

    @Column(name = "mobile_number", nullable = false, length = 30)
    private String mobileNumber;

    @Column(name = "email", length = 150)
    private String email;

    @Column(name = "company_name", length = 200)
    private String companyName;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "lead_source", nullable = false, length = 50)
    private String leadSource; // WEBSITE, REFERRAL, INBOUND_CALL, CAMPAIGN

    @Column(name = "interested_service", length = 100)
    private String interestedService;

    @Column(name = "estimated_value", precision = 12, scale = 2)
    private BigDecimal estimatedValue = BigDecimal.ZERO;

    @Column(name = "priority", nullable = false, length = 30)
    private String priority = "MEDIUM"; // LOW, MEDIUM, HIGH, URGENT

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_employee_id")
    private Employee assignedEmployee;

    @Column(name = "next_follow_up_date")
    private LocalDateTime nextFollowUpDate;

    @Column(name = "lead_status", nullable = false, length = 30)
    private String leadStatus = "NEW"; // NEW, CONTACTED, QUALIFIED, PROPOSAL_SENT, NEGOTIATION, CONVERTED, LOST

    @Column(name = "lost_reason", length = 255)
    private String lostReason;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "lead", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<LeadActivity> activities = new ArrayList<>();

    public Lead() {}

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

    public Employee getAssignedEmployee() { return assignedEmployee; }
    public void setAssignedEmployee(Employee assignedEmployee) { this.assignedEmployee = assignedEmployee; }

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

    public List<LeadActivity> getActivities() { return activities; }
    public void setActivities(List<LeadActivity> activities) { this.activities = activities; }
}
