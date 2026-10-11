package com.telecom.crm.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class InvoiceItemDto {
    private Long id;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Quantity is required")
    private Integer quantity = 1;

    @NotNull(message = "Unit price is required")
    @DecimalMin("0.0")
    private BigDecimal unitPrice;

    private BigDecimal taxRatePercent = new BigDecimal("18.00");
    private BigDecimal totalPrice;

    public InvoiceItemDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getTaxRatePercent() { return taxRatePercent; }
    public void setTaxRatePercent(BigDecimal taxRatePercent) { this.taxRatePercent = taxRatePercent; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
}
