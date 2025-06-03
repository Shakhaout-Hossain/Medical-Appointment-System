package com.medisoft.medicalapp.service;

import com.medisoft.medicalapp.dto.PrescriptionRequestDto;
import com.medisoft.medicalapp.entity.Prescription;
import org.springframework.data.domain.Pageable;

public interface PrescriptionService {
    Prescription createPrescriptionForPatient(Long patientId, PrescriptionRequestDto dto, String doctorUserName, Pageable pageable);
}