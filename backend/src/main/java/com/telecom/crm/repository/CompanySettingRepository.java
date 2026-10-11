package com.telecom.crm.repository;

import com.telecom.crm.entity.CompanySetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanySettingRepository extends JpaRepository<CompanySetting, Long> {
    Optional<CompanySetting> findBySettingKey(String settingKey);
    List<CompanySetting> findByCategory(String category);
}
