package com.medisoft.medicalapp.repository;

import com.medisoft.medicalapp.entity.PatientProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatientProfileRepository extends JpaRepository<PatientProfile, Long> {
    Optional<PatientProfile> findByUser_UserName(String username);
}
