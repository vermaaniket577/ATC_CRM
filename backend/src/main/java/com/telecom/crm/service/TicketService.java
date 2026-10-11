package com.telecom.crm.service;

import com.telecom.crm.dto.PageResponse;
import com.telecom.crm.dto.TicketCommentDto;
import com.telecom.crm.dto.TicketRequestDto;
import com.telecom.crm.dto.TicketResponseDto;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TicketService {
    PageResponse<TicketResponseDto> getTickets(String query, String status, String priority, String category, Pageable pageable);
    TicketResponseDto getTicketById(Long id);
    TicketResponseDto createTicket(TicketRequestDto request);
    TicketResponseDto assignTicket(Long id, Long employeeId);
    TicketResponseDto updateTicketStatus(Long id, String status, String resolutionNotes, Long currentUserId);
    TicketCommentDto addComment(Long ticketId, TicketCommentDto commentDto, Long currentUserId);
    List<TicketCommentDto> getComments(Long ticketId, boolean includeInternal);
}
