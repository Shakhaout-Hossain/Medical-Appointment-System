package com.medisoft.medicalapp.repository;

import com.medisoft.medicalapp.entity.DoctorProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorProfileRepository extends JpaRepository<DoctorProfile, Long> {
}
