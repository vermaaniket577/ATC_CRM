package com.telecom.crm.dto;

public class LeadConvertDto {
    private String customerType = "INDIVIDUAL"; // INDIVIDUAL, BUSINESS
    private String category = "STANDARD";
    private Long planId;
    private String simIccid;
    private Long branchId;
    private String remarks;

    public LeadConvertDto() {}

    public String getCustomerType() { return customerType; }
    public void setCustomerType(String customerType) { this.customerType = customerType; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Long getPlanId() { return planId; }
    public void setPlanId(Long planId) { this.planId = planId; }

    public String getSimIccid() { return simIccid; }
    public void setSimIccid(String simIccid) { this.simIccid = simIccid; }

    public Long getBranchId() { return branchId; }
    public void setBranchId(Long branchId) { this.branchId = branchId; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
