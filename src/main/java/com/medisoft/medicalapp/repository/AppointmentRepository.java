package com.medisoft.medicalapp.repository;

import com.medisoft.medicalapp.entity.Appointment;
import com.medisoft.medicalapp.entity.DoctorProfile;
import com.medisoft.medicalapp.entity.PatientProfile;
import com.medisoft.medicalapp.enums.AppointmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    Page<Appointment> findByPatientUserUserNameAndAppointmentTimeAfter(String userName, LocalDateTime time, Pageable pageable);
    Page<Appointment> findByPatientUserUserNameAndAppointmentTimeBefore(String userName, LocalDateTime time, Pageable pageable);
    Page<Appointment> findByPatientUserUserNameAndDoctorId(String userName, Long doctorId, Pageable pageable);

    Page<Appointment> findByPatientUserUserName(String username, Pageable pageable);



    List<Appointment> findByPatient(PatientProfile patient);
    List<Appointment> findByDoctor(DoctorProfile doctor);


    // Find any appointments for the doctor that start within the provided window.
    @Query("SELECT a FROM Appointment a WHERE a.doctor = :doctor AND " +
            "a.appointmentTime BETWEEN :start AND :end")
    List<Appointment> findOverlappingAppointments(
            @Param("doctor") DoctorProfile doctor,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    Page<Appointment> findByDoctor_User_UserNameAndAppointmentTimeAfter(String userName, LocalDateTime now, Pageable pageable);

    Page<Appointment> findByDoctor_User_UserNameAndAppointmentTimeBefore(String userName, LocalDateTime now, Pageable pageable);

    Page<Appointment> findByDoctorAndPatientAndStatusOrderByAppointmentTimeDesc(DoctorProfile doctor, PatientProfile patient, AppointmentStatus appointmentStatus, Pageable pageable);

    List<Appointment> findByStatus(AppointmentStatus appointmentStatus);
}
