package com.telecom.crm.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class CustomerResponseDto {
    private Long id;
    private String customerCode;
    private String firstName;
    private String lastName;
    private String fullName;
    private String mobileNumber;
    private String alternatePhone;
    private String email;
    private String customerType;
    private String companyName;
    private LocalDate dob;
    private String category;
    private String acquisitionSource;
    private Long assignedEmployeeId;
    private String assignedEmployeeName;
    private String status;
    private String internalRemarks;
    private LocalDateTime registeredAt;
    private String primaryAddress;

    public CustomerResponseDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCustomerCode() { return customerCode; }
    public void setCustomerCode(String customerCode) { this.customerCode = customerCode; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public String getAlternatePhone() { return alternatePhone; }
    public void setAlternatePhone(String alternatePhone) { this.alternatePhone = alternatePhone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCustomerType() { return customerType; }
    public void setCustomerType(String customerType) { this.customerType = customerType; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getAcquisitionSource() { return acquisitionSource; }
    public void setAcquisitionSource(String acquisitionSource) { this.acquisitionSource = acquisitionSource; }

    public Long getAssignedEmployeeId() { return assignedEmployeeId; }
    public void setAssignedEmployeeId(Long assignedEmployeeId) { this.assignedEmployeeId = assignedEmployeeId; }

    public String getAssignedEmployeeName() { return assignedEmployeeName; }
    public void setAssignedEmployeeName(String assignedEmployeeName) { this.assignedEmployeeName = assignedEmployeeName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getInternalRemarks() { return internalRemarks; }
    public void setInternalRemarks(String internalRemarks) { this.internalRemarks = internalRemarks; }

    public LocalDateTime getRegisteredAt() { return registeredAt; }
    public void setRegisteredAt(LocalDateTime registeredAt) { this.registeredAt = registeredAt; }

    public String getPrimaryAddress() { return primaryAddress; }
    public void setPrimaryAddress(String primaryAddress) { this.primaryAddress = primaryAddress; }
}
