package com.telecom.crm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class ConnectionRequestDto {
    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotBlank(message = "Mobile number is required")
    private String mobileNumber;

    @NotBlank(message = "SIM ICCID is required")
    private String simIccid;

    @NotBlank(message = "Connection type is required")
    private String connectionType = "POSTPAID"; // PREPAID, POSTPAID

    private String operatorBrand = "Apex Telecom";
    private Long planId;
    private String connectionStatus = "ACTIVE"; // PENDING_ACTIVATION, ACTIVE, SUSPENDED, DEACTIVATED
    private String kycStatus = "VERIFIED"; // PENDING, VERIFIED, REJECTED
    private Long assignedBranchId;
    private String notes;

    public ConnectionRequestDto() {}

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

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

    public String getConnectionStatus() { return connectionStatus; }
    public void setConnectionStatus(String connectionStatus) { this.connectionStatus = connectionStatus; }

    public String getKycStatus() { return kycStatus; }
    public void setKycStatus(String kycStatus) { this.kycStatus = kycStatus; }

    public Long getAssignedBranchId() { return assignedBranchId; }
    public void setAssignedBranchId(Long assignedBranchId) { this.assignedBranchId = assignedBranchId; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
