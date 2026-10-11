package com.telecom.crm.repository;

import com.telecom.crm.entity.TelecomPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TelecomPlanRepository extends JpaRepository<TelecomPlan, Long> {
    Optional<TelecomPlan> findByPlanCode(String planCode);
    List<TelecomPlan> findByStatus(String status);
    List<TelecomPlan> findByPlanType(String planType);
    List<TelecomPlan> findByPlanTypeAndStatus(String planType, String status);
}
