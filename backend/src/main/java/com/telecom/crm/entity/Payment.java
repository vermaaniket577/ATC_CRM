package com.telecom.crm.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_ref", nullable = false, unique = true, length = 100)
    private String transactionRef;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    @Column(name = "payment_date", nullable = false)
    private LocalDateTime paymentDate = LocalDateTime.now();

    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "payment_method", nullable = false, length = 50)
    private String paymentMethod; // UPI, CREDIT_CARD, DEBIT_CARD, NET_BANKING, CASH_COUNTER, CHEQUE

    @Column(name = "gateway_status", nullable = false, length = 30)
    private String gatewayStatus = "SUCCESS"; // SUCCESS, PENDING, FAILED, REFUNDED

    @Column(name = "idempotency_key", unique = true, length = 100)
    private String idempotencyKey;

    @Column(name = "gateway_response_code", length = 100)
    private String gatewayResponseCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "received_by_user_id")
    private User receivedByUser;

    @Column(name = "notes", length = 255)
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Payment() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTransactionRef() { return transactionRef; }
    public void setTransactionRef(String transactionRef) { this.transactionRef = transactionRef; }

    public Invoice getInvoice() { return invoice; }
    public void setInvoice(Invoice invoice) { this.invoice = invoice; }

    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getGatewayStatus() { return gatewayStatus; }
    public void setGatewayStatus(String gatewayStatus) { this.gatewayStatus = gatewayStatus; }

    public String getIdempotencyKey() { return idempotencyKey; }
    public void setIdempotencyKey(String idempotencyKey) { this.idempotencyKey = idempotencyKey; }

    public String getGatewayResponseCode() { return gatewayResponseCode; }
    public void setGatewayResponseCode(String gatewayResponseCode) { this.gatewayResponseCode = gatewayResponseCode; }

    public User getReceivedByUser() { return receivedByUser; }
    public void setReceivedByUser(User receivedByUser) { this.receivedByUser = receivedByUser; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
