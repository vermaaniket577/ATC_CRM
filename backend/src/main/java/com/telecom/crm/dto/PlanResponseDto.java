package com.telecom.crm.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class PlanResponseDto {
    private Long id;
    private String planCode;
    private String name;
    private String planType;
    private BigDecimal price;
    private Integer validityDays;
    private BigDecimal dataGbPerDay;
    private String voiceBenefit;
    private Integer smsPerDay;
    private String roamingBenefit;
    private String additionalBenefits;
    private Boolean is5gEnabled;
    private String status;
    private LocalDate effectiveStartDate;
    private LocalDate effectiveEndDate;
    private LocalDateTime createdAt;

    public PlanResponseDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPlanCode() { return planCode; }
    public void setPlanCode(String planCode) { this.planCode = planCode; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPlanType() { return planType; }
    public void setPlanType(String planType) { this.planType = planType; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getValidityDays() { return validityDays; }
    public void setValidityDays(Integer validityDays) { this.validityDays = validityDays; }

    public BigDecimal getDataGbPerDay() { return dataGbPerDay; }
    public void setDataGbPerDay(BigDecimal dataGbPerDay) { this.dataGbPerDay = dataGbPerDay; }

    public String getVoiceBenefit() { return voiceBenefit; }
    public void setVoiceBenefit(String voiceBenefit) { this.voiceBenefit = voiceBenefit; }

    public Integer getSmsPerDay() { return smsPerDay; }
    public void setSmsPerDay(Integer smsPerDay) { this.smsPerDay = smsPerDay; }

    public String getRoamingBenefit() { return roamingBenefit; }
    public void setRoamingBenefit(String roamingBenefit) { this.roamingBenefit = roamingBenefit; }

    public String getAdditionalBenefits() { return additionalBenefits; }
    public void setAdditionalBenefits(String additionalBenefits) { this.additionalBenefits = additionalBenefits; }

    public Boolean getIs5gEnabled() { return is5gEnabled; }
    public void setIs5gEnabled(Boolean is5gEnabled) { this.is5gEnabled = is5gEnabled; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getEffectiveStartDate() { return effectiveStartDate; }
    public void setEffectiveStartDate(LocalDate effectiveStartDate) { this.effectiveStartDate = effectiveStartDate; }

    public LocalDate getEffectiveEndDate() { return effectiveEndDate; }
    public void setEffectiveEndDate(LocalDate effectiveEndDate) { this.effectiveEndDate = effectiveEndDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
