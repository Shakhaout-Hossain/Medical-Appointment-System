package com.medisoft.medicalapp.repository;

import com.medisoft.medicalapp.entity.Appointment;
import com.medisoft.medicalapp.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    Prescription findByAppointment(Appointment appointment);
}