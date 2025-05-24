package com.medisoft.medicalapp.repository;

import com.medisoft.medicalapp.entity.PatientProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientProfileRepository extends JpaRepository<PatientProfile, Long> {
}
