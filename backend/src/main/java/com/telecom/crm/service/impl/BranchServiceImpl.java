package com.telecom.crm.service.impl;

import com.telecom.crm.entity.Branch;
import com.telecom.crm.exception.BadRequestException;
import com.telecom.crm.exception.ResourceNotFoundException;
import com.telecom.crm.repository.BranchRepository;
import com.telecom.crm.service.BranchService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class BranchServiceImpl implements BranchService {

    private final BranchRepository branchRepository;

    public BranchServiceImpl(BranchRepository branchRepository) {
        this.branchRepository = branchRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Branch> getAllBranches() {
        return branchRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Branch getBranchById(Long id) {
        return branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch", "id", id));
    }

    @Override
    @Transactional
    public Branch createBranch(Branch branch) {
        if (branch.getBranchCode() == null || branch.getBranchCode().isBlank()) {
            branch.setBranchCode("BR-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        }
        if (branchRepository.findByBranchCode(branch.getBranchCode()).isPresent()) {
            throw new BadRequestException("Branch with code " + branch.getBranchCode() + " already exists");
        }
        branch.setCreatedAt(LocalDateTime.now());
        branch.setUpdatedAt(LocalDateTime.now());
        return branchRepository.save(branch);
    }

    @Override
    @Transactional
    public Branch updateBranch(Long id, Branch branch) {
        Branch existing = branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch", "id", id));

        existing.setName(branch.getName());
        existing.setAddressLine(branch.getAddressLine());
        existing.setCity(branch.getCity());
        existing.setState(branch.getState());
        existing.setPinCode(branch.getPinCode());
        existing.setContactPhone(branch.getContactPhone());
        existing.setContactEmail(branch.getContactEmail());
        existing.setStatus(branch.getStatus());
        existing.setUpdatedAt(LocalDateTime.now());

        return branchRepository.save(existing);
    }
}
