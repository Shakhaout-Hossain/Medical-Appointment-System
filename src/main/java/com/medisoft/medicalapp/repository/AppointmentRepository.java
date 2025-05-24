package com.medisoft.medicalapp.repository;

import com.medisoft.medicalapp.entity.Appointment;
import com.medisoft.medicalapp.entity.DoctorProfile;
import com.medisoft.medicalapp.entity.PatientProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatient(PatientProfile patient);
    List<Appointment> findByDoctor(DoctorProfile doctor);
}
