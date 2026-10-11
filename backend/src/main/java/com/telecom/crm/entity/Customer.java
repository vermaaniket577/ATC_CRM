package com.telecom.crm.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_code", nullable = false, unique = true, length = 30)
    private String customerCode;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", length = 100)
    private String lastName;

    @Column(name = "mobile_number", nullable = false, length = 30)
    private String mobileNumber;

    @Column(name = "alternate_phone", length = 30)
    private String alternatePhone;

    @Column(name = "email", length = 150)
    private String email;

    @Column(name = "customer_type", nullable = false, length = 30)
    private String customerType = "INDIVIDUAL"; // INDIVIDUAL, BUSINESS

    @Column(name = "company_name", length = 200)
    private String companyName;

    @Column(name = "dob")
    private LocalDate dob;

    @Column(name = "category", length = 50)
    private String category = "STANDARD"; // VIP, STANDARD, CORPORATE

    @Column(name = "acquisition_source", length = 50)
    private String acquisitionSource;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_employee_id")
    private Employee assignedEmployee;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "ACTIVE"; // ACTIVE, INACTIVE, SUSPENDED, ARCHIVED

    @Column(name = "internal_remarks", length = 500)
    private String internalRemarks;

    @Column(name = "registered_at")
    private LocalDateTime registeredAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<CustomerAddress> addresses = new ArrayList<>();

    public Customer() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCustomerCode() { return customerCode; }
    public void setCustomerCode(String customerCode) { this.customerCode = customerCode; }

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

    public Employee getAssignedEmployee() { return assignedEmployee; }
    public void setAssignedEmployee(Employee assignedEmployee) { this.assignedEmployee = assignedEmployee; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getInternalRemarks() { return internalRemarks; }
    public void setInternalRemarks(String internalRemarks) { this.internalRemarks = internalRemarks; }

    public LocalDateTime getRegisteredAt() { return registeredAt; }
    public void setRegisteredAt(LocalDateTime registeredAt) { this.registeredAt = registeredAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<CustomerAddress> getAddresses() { return addresses; }
    public void setAddresses(List<CustomerAddress> addresses) { this.addresses = addresses; }

    public String getDisplayName() {
        if ("BUSINESS".equalsIgnoreCase(customerType) && companyName != null && !companyName.isBlank()) {
            return companyName + " (" + firstName + " " + (lastName != null ? lastName : "") + ")";
        }
        return (firstName + " " + (lastName != null ? lastName : "")).trim();
    }
}
