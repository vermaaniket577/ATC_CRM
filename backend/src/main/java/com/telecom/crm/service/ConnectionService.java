package com.telecom.crm.service;

import com.telecom.crm.dto.ConnectionRequestDto;
import com.telecom.crm.dto.ConnectionResponseDto;
import com.telecom.crm.dto.PageResponse;
import org.springframework.data.domain.Pageable;

public interface ConnectionService {
    PageResponse<ConnectionResponseDto> getConnections(String query, String status, String type, Pageable pageable);
    ConnectionResponseDto getConnectionById(Long id);
    ConnectionResponseDto createConnection(ConnectionRequestDto request);
    ConnectionResponseDto updateConnectionStatus(Long id, String status);
    ConnectionResponseDto updateConnectionPlan(Long id, Long planId);
}
