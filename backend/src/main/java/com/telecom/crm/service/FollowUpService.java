package com.telecom.crm.service;

import com.telecom.crm.dto.FollowUpDto;
import com.telecom.crm.dto.TaskDto;

import java.util.List;

public interface FollowUpService {
    List<FollowUpDto> getAllFollowUps(String status, Long employeeId);
    FollowUpDto createFollowUp(FollowUpDto dto);
    FollowUpDto completeFollowUp(Long id, String notes);

    List<TaskDto> getAllTasks(String status, Long employeeId);
    TaskDto createTask(TaskDto dto);
    TaskDto updateTaskStatus(Long id, String status);
}
