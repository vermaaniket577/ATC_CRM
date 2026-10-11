package com.telecom.crm.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ticket_comments")
public class TicketComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    @JsonIgnore
    private SupportTicket ticket;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "comment_text", nullable = false, columnDefinition = "TEXT")
    private String commentText;

    @Column(name = "is_internal_only")
    private Boolean isInternalOnly = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public TicketComment() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public SupportTicket getTicket() { return ticket; }
    public void setTicket(SupportTicket ticket) { this.ticket = ticket; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getCommentText() { return commentText; }
    public void setCommentText(String commentText) { this.commentText = commentText; }

    public Boolean getIsInternalOnly() { return isInternalOnly; }
    public void setIsInternalOnly(Boolean isInternalOnly) { this.isInternalOnly = isInternalOnly; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
