package com.telecom.crm.service.impl;

import com.telecom.crm.dto.PageResponse;
import com.telecom.crm.dto.TicketCommentDto;
import com.telecom.crm.dto.TicketRequestDto;
import com.telecom.crm.dto.TicketResponseDto;
import com.telecom.crm.entity.*;
import com.telecom.crm.exception.ResourceNotFoundException;
import com.telecom.crm.repository.*;
import com.telecom.crm.service.TicketService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TicketServiceImpl implements TicketService {

    private final SupportTicketRepository ticketRepository;
    private final CustomerRepository customerRepository;
    private final CustomerConnectionRepository connectionRepository;
    private final EmployeeRepository employeeRepository;
    private final TicketCommentRepository commentRepository;
    private final TicketHistoryRepository historyRepository;
    private final UserRepository userRepository;

    public TicketServiceImpl(SupportTicketRepository ticketRepository,
                             CustomerRepository customerRepository,
                             CustomerConnectionRepository connectionRepository,
                             EmployeeRepository employeeRepository,
                             TicketCommentRepository commentRepository,
                             TicketHistoryRepository historyRepository,
                             UserRepository userRepository) {
        this.ticketRepository = ticketRepository;
        this.customerRepository = customerRepository;
        this.connectionRepository = connectionRepository;
        this.employeeRepository = employeeRepository;
        this.commentRepository = commentRepository;
        this.historyRepository = historyRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<TicketResponseDto> getTickets(String query, String status, String priority, String category, Pageable pageable) {
        Page<SupportTicket> page = ticketRepository.searchTickets(
                (query != null && !query.isBlank()) ? query.trim() : null,
                (status != null && !status.isBlank()) ? status.trim() : null,
                (priority != null && !priority.isBlank()) ? priority.trim() : null,
                (category != null && !category.isBlank()) ? category.trim() : null,
                pageable
        );
        return new PageResponse<>(page.map(this::mapToDto));
    }

    @Override
    @Transactional(readOnly = true)
    public TicketResponseDto getTicketById(Long id) {
        SupportTicket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SupportTicket", "id", id));
        return mapToDto(ticket);
    }

    @Override
    @Transactional
    public TicketResponseDto createTicket(TicketRequestDto request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", request.getCustomerId()));

        SupportTicket ticket = new SupportTicket();
        ticket.setTicketCode("TKT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        ticket.setCustomer(customer);
        ticket.setCategory(request.getCategory() != null ? request.getCategory() : "GENERAL_QUERY");
        ticket.setSubject(request.getSubject());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority() != null ? request.getPriority() : "MEDIUM");
        ticket.setTicketStatus("OPEN");
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());

        // SLA deadline calculation based on priority
        LocalDateTime sla = request.getSlaDeadline();
        if (sla == null) {
            switch (ticket.getPriority().toUpperCase()) {
                case "CRITICAL" -> sla = LocalDateTime.now().plusHours(4);
                case "HIGH" -> sla = LocalDateTime.now().plusHours(12);
                case "LOW" -> sla = LocalDateTime.now().plusHours(48);
                default -> sla = LocalDateTime.now().plusHours(24);
            }
        }
        ticket.setSlaDeadline(sla);

        if (request.getConnectionId() != null) {
            CustomerConnection conn = connectionRepository.findById(request.getConnectionId()).orElse(null);
            ticket.setConnection(conn);
        }

        if (request.getAssignedEmployeeId() != null) {
            Employee emp = employeeRepository.findById(request.getAssignedEmployeeId()).orElse(null);
            ticket.setAssignedEmployee(emp);
            ticket.setTicketStatus("ASSIGNED");
        }

        SupportTicket saved = ticketRepository.save(ticket);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public TicketResponseDto assignTicket(Long id, Long employeeId) {
        SupportTicket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SupportTicket", "id", id));
        Employee emp = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", employeeId));

        String oldStatus = ticket.getTicketStatus();
        ticket.setAssignedEmployee(emp);
        if ("OPEN".equalsIgnoreCase(ticket.getTicketStatus())) {
            ticket.setTicketStatus("ASSIGNED");
        }
        ticket.setUpdatedAt(LocalDateTime.now());

        SupportTicket updated = ticketRepository.save(ticket);

        TicketHistory history = new TicketHistory();
        history.setTicket(ticket);
        history.setPreviousStatus(oldStatus);
        history.setNewStatus(ticket.getTicketStatus());
        history.setChangeReason("Assigned to " + emp.getFullName());
        historyRepository.save(history);

        return mapToDto(updated);
    }

    @Override
    @Transactional
    public TicketResponseDto updateTicketStatus(Long id, String status, String resolutionNotes, Long currentUserId) {
        SupportTicket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SupportTicket", "id", id));

        String previousStatus = ticket.getTicketStatus();
        ticket.setTicketStatus(status);
        if (resolutionNotes != null && !resolutionNotes.isBlank()) {
            ticket.setResolutionNotes(resolutionNotes);
        }
        if ("RESOLVED".equalsIgnoreCase(status) || "CLOSED".equalsIgnoreCase(status)) {
            ticket.setClosureDate(LocalDateTime.now());
        }
        ticket.setUpdatedAt(LocalDateTime.now());

        SupportTicket updated = ticketRepository.save(ticket);

        TicketHistory history = new TicketHistory();
        history.setTicket(ticket);
        history.setPreviousStatus(previousStatus);
        history.setNewStatus(status);
        history.setChangeReason(resolutionNotes != null ? resolutionNotes : "Status changed to " + status);
        if (currentUserId != null) {
            userRepository.findById(currentUserId).ifPresent(history::setChangedByUser);
        }
        historyRepository.save(history);

        return mapToDto(updated);
    }

    @Override
    @Transactional
    public TicketCommentDto addComment(Long ticketId, TicketCommentDto commentDto, Long currentUserId) {
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("SupportTicket", "id", ticketId));
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUserId));

        TicketComment comment = new TicketComment();
        comment.setTicket(ticket);
        comment.setUser(user);
        comment.setCommentText(commentDto.getCommentText());
        comment.setIsInternalOnly(Boolean.TRUE.equals(commentDto.getIsInternalOnly()));
        comment.setCreatedAt(LocalDateTime.now());

        TicketComment saved = commentRepository.save(comment);
        commentDto.setId(saved.getId());
        commentDto.setUserId(user.getId());
        commentDto.setUserName(user.getFullName());
        commentDto.setCreatedAt(saved.getCreatedAt());
        return commentDto;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TicketCommentDto> getComments(Long ticketId, boolean includeInternal) {
        List<TicketComment> comments = includeInternal ?
                commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId) :
                commentRepository.findByTicketIdAndIsInternalOnlyFalseOrderByCreatedAtAsc(ticketId);

        return comments.stream().map(c -> {
            TicketCommentDto dto = new TicketCommentDto();
            dto.setId(c.getId());
            dto.setTicketId(c.getTicket().getId());
            dto.setUserId(c.getUser().getId());
            dto.setUserName(c.getUser().getFullName());
            dto.setCommentText(c.getCommentText());
            dto.setIsInternalOnly(c.getIsInternalOnly());
            dto.setCreatedAt(c.getCreatedAt());
            return dto;
        }).collect(Collectors.toList());
    }

    private TicketResponseDto mapToDto(SupportTicket t) {
        TicketResponseDto dto = new TicketResponseDto();
        dto.setId(t.getId());
        dto.setTicketCode(t.getTicketCode());
        dto.setCustomerId(t.getCustomer().getId());
        dto.setCustomerName(t.getCustomer().getDisplayName());
        dto.setCustomerPhone(t.getCustomer().getMobileNumber());
        dto.setCategory(t.getCategory());
        dto.setSubject(t.getSubject());
        dto.setDescription(t.getDescription());
        dto.setPriority(t.getPriority());
        dto.setSlaDeadline(t.getSlaDeadline());
        dto.setTicketStatus(t.getTicketStatus());
        dto.setResolutionNotes(t.getResolutionNotes());
        dto.setClosureDate(t.getClosureDate());
        dto.setCustomerFeedbackRating(t.getCustomerFeedbackRating());
        dto.setCustomerFeedbackComments(t.getCustomerFeedbackComments());
        dto.setCreatedAt(t.getCreatedAt());
        dto.setUpdatedAt(t.getUpdatedAt());

        if (t.getConnection() != null) {
            dto.setConnectionId(t.getConnection().getId());
            dto.setConnectionPhone(t.getConnection().getMobileNumber());
        }
        if (t.getAssignedEmployee() != null) {
            dto.setAssignedEmployeeId(t.getAssignedEmployee().getId());
            dto.setAssignedEmployeeName(t.getAssignedEmployee().getFullName());
        }

        return dto;
    }
}
