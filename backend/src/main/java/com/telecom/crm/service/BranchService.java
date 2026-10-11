package com.telecom.crm.service;

import com.telecom.crm.entity.Branch;
import java.util.List;

public interface BranchService {
    List<Branch> getAllBranches();
    Branch getBranchById(Long id);
    Branch createBranch(Branch branch);
    Branch updateBranch(Long id, Branch branch);
}
