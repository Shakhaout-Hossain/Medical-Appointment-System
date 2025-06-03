package com.medisoft.medicalapp.service;

import com.medisoft.medicalapp.dto.PrescriptionRequestDto;
import com.medisoft.medicalapp.entity.Appointment;
import com.medisoft.medicalapp.entity.DoctorProfile;
import com.medisoft.medicalapp.entity.PatientProfile;
import com.medisoft.medicalapp.entity.Prescription;
import com.medisoft.medicalapp.enums.AppointmentStatus;
import com.medisoft.medicalapp.exception.UserNotFoundException;
import com.medisoft.medicalapp.repository.AppointmentRepository;
import com.medisoft.medicalapp.repository.DoctorProfileRepository;
import com.medisoft.medicalapp.repository.PatientProfileRepository;
import com.medisoft.medicalapp.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PrescriptionServiceImpl implements PrescriptionService{

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorProfileRepository doctorProfileRepository;

    @Autowired
    private PatientProfileRepository patientProfileRepository;


    @Override
    @Transactional
    public Prescription createPrescriptionForPatient(Long patientId, PrescriptionRequestDto dto, String doctorUserName, Pageable pageable) {
        // Get the doctor profile
        DoctorProfile doctor = doctorProfileRepository.findByUser_UserName(doctorUserName)
                .orElseThrow(() -> new UserNotFoundException("Doctor not found"));

        // Get the patient profile
        PatientProfile patient = patientProfileRepository.findById(patientId)
                .orElseThrow(() -> new UserNotFoundException("Patient not found"));

        // Find the most recent completed appointment
        Page<Appointment> appointments = appointmentRepository.findByDoctorAndPatientAndStatusOrderByAppointmentTimeDesc(
                doctor, patient, AppointmentStatus.CONFIRMED, pageable);
        if (appointments.isEmpty()) {
            throw new IllegalStateException("No confirmed appointments found for this patient with this doctor");
        }

        Appointment latestAppointment = appointments.getContent().getFirst();

        /// Logic for payment to appointment status


        // Check for existing prescription
        if (prescriptionRepository.findByAppointment(latestAppointment) != null) {
            throw new IllegalStateException("Prescription already exists for the most recent completed appointment");
        }



        // Create and save the prescription
        Prescription prescription = new Prescription();
        prescription.setAppointment(latestAppointment);
        prescription.setDiagnosis(dto.getDiagnosis());
        prescription.setMedications(dto.getMedications());
        prescription.setAdvice(dto.getAdvice());

        ///  Set Appointment Status Confirmed to Completed
        latestAppointment.setStatus(AppointmentStatus.COMPLETED);
        appointmentRepository.save(latestAppointment);

        return prescriptionRepository.save(prescription);
    }
}
