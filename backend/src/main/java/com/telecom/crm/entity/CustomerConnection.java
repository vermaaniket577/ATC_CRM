package com.telecom.crm.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_connections")
public class CustomerConnection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "connection_code", nullable = false, unique = true, length = 30)
    private String connectionCode;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "mobile_number", nullable = false, unique = true, length = 30)
    private String mobileNumber;

    @Column(name = "sim_iccid", nullable = false, unique = true, length = 50)
    private String simIccid;

    @Column(name = "connection_type", nullable = false, length = 30)
    private String connectionType; // PREPAID, POSTPAID

    @Column(name = "operator_brand", nullable = false, length = 50)
    private String operatorBrand = "Apex Telecom";

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "plan_id")
    private TelecomPlan plan;

    @Column(name = "activation_date")
    private LocalDateTime activationDate;

    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;

    @Column(name = "connection_status", nullable = false, length = 30)
    private String connectionStatus = "PENDING_ACTIVATION"; // PENDING_ACTIVATION, ACTIVE, SUSPENDED, DEACTIVATED

    @Column(name = "kyc_status", nullable = false, length = 30)
    private String kycStatus = "PENDING"; // PENDING, VERIFIED, REJECTED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_branch_id")
    private Branch assignedBranch;

    @Column(name = "notes", length = 500)
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public CustomerConnection() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getConnectionCode() { return connectionCode; }
    public void setConnectionCode(String connectionCode) { this.connectionCode = connectionCode; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public String getSimIccid() { return simIccid; }
    public void setSimIccid(String simIccid) { this.simIccid = simIccid; }

    public String getConnectionType() { return connectionType; }
    public void setConnectionType(String connectionType) { this.connectionType = connectionType; }

    public String getOperatorBrand() { return operatorBrand; }
    public void setOperatorBrand(String operatorBrand) { this.operatorBrand = operatorBrand; }

    public TelecomPlan getPlan() { return plan; }
    public void setPlan(TelecomPlan plan) { this.plan = plan; }

    public LocalDateTime getActivationDate() { return activationDate; }
    public void setActivationDate(LocalDateTime activationDate) { this.activationDate = activationDate; }

    public LocalDateTime getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDateTime expiryDate) { this.expiryDate = expiryDate; }

    public String getConnectionStatus() { return connectionStatus; }
    public void setConnectionStatus(String connectionStatus) { this.connectionStatus = connectionStatus; }

    public String getKycStatus() { return kycStatus; }
    public void setKycStatus(String kycStatus) { this.kycStatus = kycStatus; }

    public Branch getAssignedBranch() { return assignedBranch; }
    public void setAssignedBranch(Branch assignedBranch) { this.assignedBranch = assignedBranch; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
