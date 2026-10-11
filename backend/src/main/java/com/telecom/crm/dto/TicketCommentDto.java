package com.telecom.crm.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class TicketCommentDto {
    private Long id;
    private Long ticketId;
    private Long userId;
    private String userName;

    @NotBlank(message = "Comment text is required")
    private String commentText;

    private Boolean isInternalOnly = false;
    private LocalDateTime createdAt = LocalDateTime.now();

    public TicketCommentDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTicketId() { return ticketId; }
    public void setTicketId(Long ticketId) { this.ticketId = ticketId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getCommentText() { return commentText; }
    public void setCommentText(String commentText) { this.commentText = commentText; }

    public Boolean getIsInternalOnly() { return isInternalOnly; }
    public void setIsInternalOnly(Boolean isInternalOnly) { this.isInternalOnly = isInternalOnly; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
