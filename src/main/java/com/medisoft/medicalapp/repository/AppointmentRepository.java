package com.medisoft.medicalapp.repository;

import com.medisoft.medicalapp.entity.Appointment;
import com.medisoft.medicalapp.entity.DoctorProfile;
import com.medisoft.medicalapp.entity.PatientProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatient(PatientProfile patient);
    List<Appointment> findByDoctor(DoctorProfile doctor);

    // Find any appointments for the doctor that start within the provided window.
    @Query("SELECT a FROM Appointment a WHERE a.doctor = :doctor AND " +
            "a.appointmentTime BETWEEN :start AND :end")
    List<Appointment> findOverlappingAppointments(
            @Param("doctor") DoctorProfile doctor,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);
}
