package com.telecom.crm.controller;

import com.telecom.crm.dto.ApiResponse;
import com.telecom.crm.dto.FollowUpDto;
import com.telecom.crm.dto.TaskDto;
import com.telecom.crm.service.FollowUpService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/followups")
@Tag(name = "Follow-ups & Tasks", description = "Daily schedules, call follow-ups, and field tasks")
public class FollowUpController {

    private final FollowUpService followUpService;

    public FollowUpController(FollowUpService followUpService) {
        this.followUpService = followUpService;
    }

    @GetMapping
    @Operation(summary = "List scheduled follow-ups")
    public ResponseEntity<ApiResponse<List<FollowUpDto>>> getFollowUps(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long employeeId) {
        return ResponseEntity.ok(ApiResponse.ok(followUpService.getAllFollowUps(status, employeeId)));
    }

    @PostMapping
    @Operation(summary = "Schedule new prospect/customer follow-up")
    public ResponseEntity<ApiResponse<FollowUpDto>> createFollowUp(@Valid @RequestBody FollowUpDto dto) {
        FollowUpDto created = followUpService.createFollowUp(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Follow-up scheduled", created));
    }

    @PatchMapping("/{id}/complete")
    @Operation(summary = "Mark follow-up as completed")
    public ResponseEntity<ApiResponse<FollowUpDto>> completeFollowUp(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String notes = body != null ? body.get("notes") : null;
        FollowUpDto completed = followUpService.completeFollowUp(id, notes);
        return ResponseEntity.ok(ApiResponse.ok("Follow-up completed", completed));
    }

    @GetMapping("/tasks")
    @Operation(summary = "List staff tasks and to-dos")
    public ResponseEntity<ApiResponse<List<TaskDto>>> getTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long employeeId) {
        return ResponseEntity.ok(ApiResponse.ok(followUpService.getAllTasks(status, employeeId)));
    }

    @PostMapping("/tasks")
    @Operation(summary = "Create task assignment")
    public ResponseEntity<ApiResponse<TaskDto>> createTask(@Valid @RequestBody TaskDto dto) {
        TaskDto created = followUpService.createTask(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Task created", created));
    }

    @PatchMapping("/tasks/{id}/status")
    @Operation(summary = "Update task status")
    public ResponseEntity<ApiResponse<TaskDto>> updateTaskStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        TaskDto updated = followUpService.updateTaskStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Task status updated", updated));
    }
}
