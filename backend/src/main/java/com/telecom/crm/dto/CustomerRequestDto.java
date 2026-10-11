package com.telecom.crm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;
import java.util.List;

public class CustomerRequestDto {
    @NotBlank(message = "First name is required")
    private String firstName;
    private String lastName;

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[+]?[0-9]{10,13}$", message = "Invalid mobile number format")
    private String mobileNumber;

    private String alternatePhone;
    private String email;
    private String customerType = "INDIVIDUAL"; // INDIVIDUAL, BUSINESS
    private String companyName;
    private LocalDate dob;
    private String category = "STANDARD";
    private String acquisitionSource = "ONLINE";
    private Long assignedEmployeeId;
    private String status = "ACTIVE";
    private String internalRemarks;

    // Address fields
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String pinCode;

    public CustomerRequestDto() {}

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

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

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getInternalRemarks() { return internalRemarks; }
    public void setInternalRemarks(String internalRemarks) { this.internalRemarks = internalRemarks; }

    public String getAddressLine1() { return addressLine1; }
    public void setAddressLine1(String addressLine1) { this.addressLine1 = addressLine1; }

    public String getAddressLine2() { return addressLine2; }
    public void setAddressLine2(String addressLine2) { this.addressLine2 = addressLine2; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPinCode() { return pinCode; }
    public void setPinCode(String pinCode) { this.pinCode = pinCode; }
}
