package com.telecom.crm.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "lead_activities")
public class LeadActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id", nullable = false)
    @JsonIgnore
    private Lead lead;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @Column(name = "activity_type", nullable = false, length = 50)
    private String activityType; // CALL, EMAIL, MEETING, DEMO, NOTE

    @Column(name = "summary", nullable = false, length = 255)
    private String summary;

    @Column(name = "details", columnDefinition = "TEXT")
    private String details;

    @Column(name = "activity_time")
    private LocalDateTime activityTime = LocalDateTime.now();

    public LeadActivity() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Lead getLead() { return lead; }
    public void setLead(Lead lead) { this.lead = lead; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public String getActivityType() { return activityType; }
    public void setActivityType(String activityType) { this.activityType = activityType; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public LocalDateTime getActivityTime() { return activityTime; }
    public void setActivityTime(LocalDateTime activityTime) { this.activityTime = activityTime; }
}
