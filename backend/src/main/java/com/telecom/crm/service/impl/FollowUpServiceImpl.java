package com.telecom.crm.service.impl;

import com.telecom.crm.dto.FollowUpDto;
import com.telecom.crm.dto.TaskDto;
import com.telecom.crm.entity.*;
import com.telecom.crm.exception.ResourceNotFoundException;
import com.telecom.crm.repository.*;
import com.telecom.crm.service.FollowUpService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FollowUpServiceImpl implements FollowUpService {

    private final FollowUpRepository followUpRepository;
    private final TaskRepository taskRepository;
    private final EmployeeRepository employeeRepository;
    private final CustomerRepository customerRepository;
    private final LeadRepository leadRepository;

    public FollowUpServiceImpl(FollowUpRepository followUpRepository,
                               TaskRepository taskRepository,
                               EmployeeRepository employeeRepository,
                               CustomerRepository customerRepository,
                               LeadRepository leadRepository) {
        this.followUpRepository = followUpRepository;
        this.taskRepository = taskRepository;
        this.employeeRepository = employeeRepository;
        this.customerRepository = customerRepository;
        this.leadRepository = leadRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<FollowUpDto> getAllFollowUps(String status, Long employeeId) {
        List<FollowUp> list = followUpRepository.findAll();
        return list.stream()
                .filter(f -> status == null || status.isBlank() || status.equalsIgnoreCase(f.getStatus()))
                .filter(f -> employeeId == null || (f.getAssignedEmployee() != null && f.getAssignedEmployee().getId().equals(employeeId)))
                .map(this::mapFollowUpToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public FollowUpDto createFollowUp(FollowUpDto dto) {
        Employee employee = employeeRepository.findById(dto.getAssignedEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", dto.getAssignedEmployeeId()));

        FollowUp followUp = new FollowUp();
        followUp.setTitle(dto.getTitle());
        followUp.setAssignedEmployee(employee);
        followUp.setScheduledAt(dto.getScheduledAt());
        followUp.setPriority(dto.getPriority() != null ? dto.getPriority() : "MEDIUM");
        followUp.setStatus("SCHEDULED");
        followUp.setNotes(dto.getNotes());
        followUp.setCreatedAt(LocalDateTime.now());

        if (dto.getCustomerId() != null) {
            customerRepository.findById(dto.getCustomerId()).ifPresent(followUp::setCustomer);
        }
        if (dto.getLeadId() != null) {
            leadRepository.findById(dto.getLeadId()).ifPresent(followUp::setLead);
        }

        FollowUp saved = followUpRepository.save(followUp);
        return mapFollowUpToDto(saved);
    }

    @Override
    @Transactional
    public FollowUpDto completeFollowUp(Long id, String notes) {
        FollowUp followUp = followUpRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FollowUp", "id", id));
        followUp.setStatus("COMPLETED");
        followUp.setCompletedAt(LocalDateTime.now());
        if (notes != null && !notes.isBlank()) {
            followUp.setNotes((followUp.getNotes() != null ? followUp.getNotes() + " | " : "") + notes);
        }
        return mapFollowUpToDto(followUpRepository.save(followUp));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskDto> getAllTasks(String status, Long employeeId) {
        List<Task> list = taskRepository.findAll();
        return list.stream()
                .filter(t -> status == null || status.isBlank() || status.equalsIgnoreCase(t.getStatus()))
                .filter(t -> employeeId == null || (t.getAssignedEmployee() != null && t.getAssignedEmployee().getId().equals(employeeId)))
                .map(this::mapTaskToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TaskDto createTask(TaskDto dto) {
        Employee employee = employeeRepository.findById(dto.getAssignedEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", dto.getAssignedEmployeeId()));

        Task task = new Task();
        task.setTaskCode("TSK-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setAssignedEmployee(employee);
        task.setDueDate(dto.getDueDate());
        task.setPriority(dto.getPriority() != null ? dto.getPriority() : "MEDIUM");
        task.setStatus("PENDING");
        task.setNotes(dto.getNotes());
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());

        if (dto.getCustomerId() != null) {
            customerRepository.findById(dto.getCustomerId()).ifPresent(task::setCustomer);
        }
        if (dto.getLeadId() != null) {
            leadRepository.findById(dto.getLeadId()).ifPresent(task::setLead);
        }

        Task saved = taskRepository.save(task);
        return mapTaskToDto(saved);
    }

    @Override
    @Transactional
    public TaskDto updateTaskStatus(Long id, String status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        task.setStatus(status);
        if ("COMPLETED".equalsIgnoreCase(status)) {
            task.setCompletedAt(LocalDateTime.now());
        }
        task.setUpdatedAt(LocalDateTime.now());
        return mapTaskToDto(taskRepository.save(task));
    }

    private FollowUpDto mapFollowUpToDto(FollowUp f) {
        FollowUpDto dto = new FollowUpDto();
        dto.setId(f.getId());
        dto.setTitle(f.getTitle());
        dto.setScheduledAt(f.getScheduledAt());
        dto.setPriority(f.getPriority());
        dto.setStatus(f.getStatus());
        dto.setNotes(f.getNotes());
        dto.setCompletedAt(f.getCompletedAt());
        dto.setCreatedAt(f.getCreatedAt());

        if (f.getAssignedEmployee() != null) {
            dto.setAssignedEmployeeId(f.getAssignedEmployee().getId());
            dto.setAssignedEmployeeName(f.getAssignedEmployee().getFullName());
        }
        if (f.getCustomer() != null) {
            dto.setCustomerId(f.getCustomer().getId());
            dto.setCustomerName(f.getCustomer().getDisplayName());
        }
        if (f.getLead() != null) {
            dto.setLeadId(f.getLead().getId());
            dto.setLeadName(f.getLead().getProspectName());
        }
        return dto;
    }

    private TaskDto mapTaskToDto(Task t) {
        TaskDto dto = new TaskDto();
        dto.setId(t.getId());
        dto.setTaskCode(t.getTaskCode());
        dto.setTitle(t.getTitle());
        dto.setDescription(t.getDescription());
        dto.setDueDate(t.getDueDate());
        dto.setPriority(t.getPriority());
        dto.setStatus(t.getStatus());
        dto.setNotes(t.getNotes());
        dto.setCompletedAt(t.getCompletedAt());
        dto.setCreatedAt(t.getCreatedAt());

        if (t.getAssignedEmployee() != null) {
            dto.setAssignedEmployeeId(t.getAssignedEmployee().getId());
            dto.setAssignedEmployeeName(t.getAssignedEmployee().getFullName());
        }
        if (t.getCustomer() != null) {
            dto.setCustomerId(t.getCustomer().getId());
            dto.setCustomerName(t.getCustomer().getDisplayName());
        }
        if (t.getLead() != null) {
            dto.setLeadId(t.getLead().getId());
            dto.setLeadName(t.getLead().getProspectName());
        }
        return dto;
    }
}
