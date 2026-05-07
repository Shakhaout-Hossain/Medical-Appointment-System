package com.medisoft.medicalapp.repository;

import com.medisoft.medicalapp.entity.DoctorProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
import java.util.Optional;


public interface DoctorProfileRepository extends JpaRepository<DoctorProfile, Long> {

    Optional<DoctorProfile> findByUser_UserName(String userName);
    boolean existsByUserUserName(String userName);


    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"user", "workingDays"})
    List<DoctorProfile> findByApproved(boolean approved);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"user", "workingDays"})
    org.springframework.data.domain.Page<DoctorProfile> findAll(org.springframework.data.domain.Pageable pageable);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"user", "workingDays"})
    org.springframework.data.domain.Page<DoctorProfile> findByApprovedTrue(org.springframework.data.domain.Pageable pageable);

    Optional<DoctorProfile> findByIdAndApprovedTrue(Long id);

}
