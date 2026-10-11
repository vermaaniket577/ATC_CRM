package com.telecom.crm.service.impl;

import com.telecom.crm.dto.PlanRequestDto;
import com.telecom.crm.dto.PlanResponseDto;
import com.telecom.crm.entity.TelecomPlan;
import com.telecom.crm.exception.ResourceNotFoundException;
import com.telecom.crm.repository.TelecomPlanRepository;
import com.telecom.crm.service.PlanService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PlanServiceImpl implements PlanService {

    private final TelecomPlanRepository planRepository;

    public PlanServiceImpl(TelecomPlanRepository planRepository) {
        this.planRepository = planRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PlanResponseDto> getAllPlans(String status, String type) {
        List<TelecomPlan> plans = planRepository.findAll();
        return plans.stream()
                .filter(p -> status == null || status.isBlank() || status.equalsIgnoreCase(p.getStatus()))
                .filter(p -> type == null || type.isBlank() || type.equalsIgnoreCase(p.getPlanType()))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PlanResponseDto getPlanById(Long id) {
        TelecomPlan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TelecomPlan", "id", id));
        return mapToDto(plan);
    }

    @Override
    @Transactional
    public PlanResponseDto createPlan(PlanRequestDto request) {
        TelecomPlan plan = new TelecomPlan();
        plan.setPlanCode("PLAN-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        plan.setName(request.getName());
        plan.setPlanType(request.getPlanType());
        plan.setPrice(request.getPrice());
        plan.setValidityDays(request.getValidityDays());
        plan.setDataGbPerDay(request.getDataGbPerDay());
        plan.setVoiceBenefit(request.getVoiceBenefit());
        plan.setSmsPerDay(request.getSmsPerDay());
        plan.setRoamingBenefit(request.getRoamingBenefit());
        plan.setAdditionalBenefits(request.getAdditionalBenefits());
        plan.setIs5gEnabled(request.getIs5gEnabled() != null ? request.getIs5gEnabled() : true);
        plan.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");
        plan.setEffectiveStartDate(request.getEffectiveStartDate());
        plan.setEffectiveEndDate(request.getEffectiveEndDate());
        plan.setCreatedAt(LocalDateTime.now());
        plan.setUpdatedAt(LocalDateTime.now());

        TelecomPlan saved = planRepository.save(plan);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public PlanResponseDto updatePlan(Long id, PlanRequestDto request) {
        TelecomPlan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TelecomPlan", "id", id));

        plan.setName(request.getName());
        plan.setPlanType(request.getPlanType());
        plan.setPrice(request.getPrice());
        plan.setValidityDays(request.getValidityDays());
        plan.setDataGbPerDay(request.getDataGbPerDay());
        plan.setVoiceBenefit(request.getVoiceBenefit());
        plan.setSmsPerDay(request.getSmsPerDay());
        plan.setRoamingBenefit(request.getRoamingBenefit());
        plan.setAdditionalBenefits(request.getAdditionalBenefits());
        plan.setIs5gEnabled(request.getIs5gEnabled());
        plan.setStatus(request.getStatus());
        plan.setEffectiveStartDate(request.getEffectiveStartDate());
        plan.setEffectiveEndDate(request.getEffectiveEndDate());
        plan.setUpdatedAt(LocalDateTime.now());

        TelecomPlan updated = planRepository.save(plan);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public void deletePlan(Long id) {
        TelecomPlan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TelecomPlan", "id", id));
        plan.setStatus("RETIRED");
        planRepository.save(plan);
    }

    private PlanResponseDto mapToDto(TelecomPlan p) {
        PlanResponseDto dto = new PlanResponseDto();
        dto.setId(p.getId());
        dto.setPlanCode(p.getPlanCode());
        dto.setName(p.getName());
        dto.setPlanType(p.getPlanType());
        dto.setPrice(p.getPrice());
        dto.setValidityDays(p.getValidityDays());
        dto.setDataGbPerDay(p.getDataGbPerDay());
        dto.setVoiceBenefit(p.getVoiceBenefit());
        dto.setSmsPerDay(p.getSmsPerDay());
        dto.setRoamingBenefit(p.getRoamingBenefit());
        dto.setAdditionalBenefits(p.getAdditionalBenefits());
        dto.setIs5gEnabled(p.getIs5gEnabled());
        dto.setStatus(p.getStatus());
        dto.setEffectiveStartDate(p.getEffectiveStartDate());
        dto.setEffectiveEndDate(p.getEffectiveEndDate());
        dto.setCreatedAt(p.getCreatedAt());
        return dto;
    }
}
