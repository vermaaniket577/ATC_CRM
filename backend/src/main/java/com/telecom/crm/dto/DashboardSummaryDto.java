package com.telecom.crm.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardSummaryDto {
    private long totalCustomers;
    private long activeConnections;
    private long newLeads;
    private long convertedLeads;
    private long pendingFollowUps;
    private long openComplaints;
    private long resolvedComplaints;
    private long overdueInvoices;
    private BigDecimal totalBilledAmount;
    private BigDecimal paymentsReceived;
    private BigDecimal outstandingAmount;

    // Chart datasets
    private List<Map<String, Object>> monthlyRegistrations;
    private List<Map<String, Object>> leadsByStatus;
    private List<Map<String, Object>> complaintsByCategory;
    private List<Map<String, Object>> monthlyRevenue;
    private List<Map<String, Object>> planPopularity;
    private List<Map<String, Object>> salesByExecutive;

    public DashboardSummaryDto() {}

    public long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; }

    public long getActiveConnections() { return activeConnections; }
    public void setActiveConnections(long activeConnections) { this.activeConnections = activeConnections; }

    public long getNewLeads() { return newLeads; }
    public void setNewLeads(long newLeads) { this.newLeads = newLeads; }

    public long getConvertedLeads() { return convertedLeads; }
    public void setConvertedLeads(long convertedLeads) { this.convertedLeads = convertedLeads; }

    public long getPendingFollowUps() { return pendingFollowUps; }
    public void setPendingFollowUps(long pendingFollowUps) { this.pendingFollowUps = pendingFollowUps; }

    public long getOpenComplaints() { return openComplaints; }
    public void setOpenComplaints(long openComplaints) { this.openComplaints = openComplaints; }

    public long getResolvedComplaints() { return resolvedComplaints; }
    public void setResolvedComplaints(long resolvedComplaints) { this.resolvedComplaints = resolvedComplaints; }

    public long getOverdueInvoices() { return overdueInvoices; }
    public void setOverdueInvoices(long overdueInvoices) { this.overdueInvoices = overdueInvoices; }

    public BigDecimal getTotalBilledAmount() { return totalBilledAmount; }
    public void setTotalBilledAmount(BigDecimal totalBilledAmount) { this.totalBilledAmount = totalBilledAmount; }

    public BigDecimal getPaymentsReceived() { return paymentsReceived; }
    public void setPaymentsReceived(BigDecimal paymentsReceived) { this.paymentsReceived = paymentsReceived; }

    public BigDecimal getOutstandingAmount() { return outstandingAmount; }
    public void setOutstandingAmount(BigDecimal outstandingAmount) { this.outstandingAmount = outstandingAmount; }

    public List<Map<String, Object>> getMonthlyRegistrations() { return monthlyRegistrations; }
    public void setMonthlyRegistrations(List<Map<String, Object>> monthlyRegistrations) { this.monthlyRegistrations = monthlyRegistrations; }

    public List<Map<String, Object>> getLeadsByStatus() { return leadsByStatus; }
    public void setLeadsByStatus(List<Map<String, Object>> leadsByStatus) { this.leadsByStatus = leadsByStatus; }

    public List<Map<String, Object>> getComplaintsByCategory() { return complaintsByCategory; }
    public void setComplaintsByCategory(List<Map<String, Object>> complaintsByCategory) { this.complaintsByCategory = complaintsByCategory; }

    public List<Map<String, Object>> getMonthlyRevenue() { return monthlyRevenue; }
    public void setMonthlyRevenue(List<Map<String, Object>> monthlyRevenue) { this.monthlyRevenue = monthlyRevenue; }

    public List<Map<String, Object>> getPlanPopularity() { return planPopularity; }
    public void setPlanPopularity(List<Map<String, Object>> planPopularity) { this.planPopularity = planPopularity; }

    public List<Map<String, Object>> getSalesByExecutive() { return salesByExecutive; }
    public void setSalesByExecutive(List<Map<String, Object>> salesByExecutive) { this.salesByExecutive = salesByExecutive; }
}
