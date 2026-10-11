package com.telecom.crm.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class InvoiceRequestDto {
    @NotNull(message = "Customer ID is required")
    private Long customerId;

    private Long connectionId;

    @NotNull(message = "Billing start date is required")
    private LocalDate billingPeriodStart;

    @NotNull(message = "Billing end date is required")
    private LocalDate billingPeriodEnd;

    private LocalDate invoiceDate = LocalDate.now();

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    private BigDecimal discountAmount = BigDecimal.ZERO;

    @NotEmpty(message = "At least one item is required")
    private List<InvoiceItemDto> items;

    public InvoiceRequestDto() {}

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public Long getConnectionId() { return connectionId; }
    public void setConnectionId(Long connectionId) { this.connectionId = connectionId; }

    public LocalDate getBillingPeriodStart() { return billingPeriodStart; }
    public void setBillingPeriodStart(LocalDate billingPeriodStart) { this.billingPeriodStart = billingPeriodStart; }

    public LocalDate getBillingPeriodEnd() { return billingPeriodEnd; }
    public void setBillingPeriodEnd(LocalDate billingPeriodEnd) { this.billingPeriodEnd = billingPeriodEnd; }

    public LocalDate getInvoiceDate() { return invoiceDate; }
    public void setInvoiceDate(LocalDate invoiceDate) { this.invoiceDate = invoiceDate; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public List<InvoiceItemDto> getItems() { return items; }
    public void setItems(List<InvoiceItemDto> items) { this.items = items; }
}
