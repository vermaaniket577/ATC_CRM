package com.telecom.crm.dto;

import java.time.LocalDateTime;

public class ConnectionResponseDto {
    private Long id;
    private String connectionCode;
    private Long customerId;
    private String customerName;
    private String mobileNumber;
    private String simIccid;
    private String connectionType;
    private String operatorBrand;
    private Long planId;
    private String planName;
    private LocalDateTime activationDate;
    private LocalDateTime expiryDate;
    private String connectionStatus;
    private String kycStatus;
    private Long assignedBranchId;
    private String branchName;
    private String notes;
    private LocalDateTime createdAt;

    public ConnectionResponseDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getConnectionCode() { return connectionCode; }
    public void setConnectionCode(String connectionCode) { this.connectionCode = connectionCode; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public String getSimIccid() { return simIccid; }
    public void setSimIccid(String simIccid) { this.simIccid = simIccid; }

    public String getConnectionType() { return connectionType; }
    public void setConnectionType(String connectionType) { this.connectionType = connectionType; }

    public String getOperatorBrand() { return operatorBrand; }
    public void setOperatorBrand(String operatorBrand) { this.operatorBrand = operatorBrand; }

    public Long getPlanId() { return planId; }
    public void setPlanId(Long planId) { this.planId = planId; }

    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }

    public LocalDateTime getActivationDate() { return activationDate; }
    public void setActivationDate(LocalDateTime activationDate) { this.activationDate = activationDate; }

    public LocalDateTime getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDateTime expiryDate) { this.expiryDate = expiryDate; }

    public String getConnectionStatus() { return connectionStatus; }
    public void setConnectionStatus(String connectionStatus) { this.connectionStatus = connectionStatus; }

    public String getKycStatus() { return kycStatus; }
    public void setKycStatus(String kycStatus) { this.kycStatus = kycStatus; }

    public Long getAssignedBranchId() { return assignedBranchId; }
    public void setAssignedBranchId(Long assignedBranchId) { this.assignedBranchId = assignedBranchId; }

    public String getBranchName() { return branchName; }
    public void setBranchName(String branchName) { this.branchName = branchName; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
