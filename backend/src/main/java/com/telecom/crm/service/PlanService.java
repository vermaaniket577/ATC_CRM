package com.telecom.crm.service;

import com.telecom.crm.dto.PlanRequestDto;
import com.telecom.crm.dto.PlanResponseDto;

import java.util.List;

public interface PlanService {
    List<PlanResponseDto> getAllPlans(String status, String type);
    PlanResponseDto getPlanById(Long id);
    PlanResponseDto createPlan(PlanRequestDto request);
    PlanResponseDto updatePlan(Long id, PlanRequestDto request);
    void deletePlan(Long id);
}
