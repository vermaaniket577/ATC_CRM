package com.telecom.crm.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "telecom_plans")
public class TelecomPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "plan_code", nullable = false, unique = true, length = 30)
    private String planCode;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "plan_type", nullable = false, length = 30)
    private String planType; // PREPAID, POSTPAID, ENTERPRISE, FIBER

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "validity_days", nullable = false)
    private Integer validityDays;

    @Column(name = "data_gb_per_day", precision = 6, scale = 2)
    private BigDecimal dataGbPerDay = BigDecimal.ZERO;

    @Column(name = "voice_benefit", length = 100)
    private String voiceBenefit = "Truly Unlimited";

    @Column(name = "sms_per_day")
    private Integer smsPerDay = 100;

    @Column(name = "roaming_benefit", length = 100)
    private String roamingBenefit = "Free National Roaming";

    @Column(name = "additional_benefits", length = 500)
    private String additionalBenefits;

    @Column(name = "is_5g_enabled")
    private Boolean is5gEnabled = true;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "ACTIVE"; // ACTIVE, INACTIVE, RETIRED

    @Column(name = "effective_start_date", nullable = false)
    private LocalDate effectiveStartDate = LocalDate.now();

    @Column(name = "effective_end_date")
    private LocalDate effectiveEndDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public TelecomPlan() {}

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

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
