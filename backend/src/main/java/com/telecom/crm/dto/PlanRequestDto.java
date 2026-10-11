package com.telecom.crm.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public class PlanRequestDto {
    @NotBlank(message = "Plan name is required")
    private String name;

    @NotBlank(message = "Plan type is required")
    private String planType = "POSTPAID"; // PREPAID, POSTPAID, ENTERPRISE, FIBER

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", message = "Price cannot be negative")
    private BigDecimal price;

    @NotNull(message = "Validity days is required")
    @Min(value = 1, message = "Validity must be at least 1 day")
    private Integer validityDays;

    private BigDecimal dataGbPerDay = BigDecimal.ZERO;
    private String voiceBenefit = "Truly Unlimited";
    private Integer smsPerDay = 100;
    private String roamingBenefit = "Free National Roaming";
    private String additionalBenefits;
    private Boolean is5gEnabled = true;
    private String status = "ACTIVE";
    private LocalDate effectiveStartDate = LocalDate.now();
    private LocalDate effectiveEndDate;

    public PlanRequestDto() {}

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
}
