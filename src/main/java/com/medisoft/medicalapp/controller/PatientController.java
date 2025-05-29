package com.medisoft.medicalapp.controller;

import com.medisoft.medicalapp.dto.AppointmentRequestDto;
import com.medisoft.medicalapp.entity.Appointment;
import com.medisoft.medicalapp.entity.DoctorProfile;
import com.medisoft.medicalapp.entity.PatientProfile;
import com.medisoft.medicalapp.enums.AppointmentStatus;
import com.medisoft.medicalapp.exception.UserNotFoundException;
import com.medisoft.medicalapp.repository.AppointmentRepository;
import com.medisoft.medicalapp.repository.DoctorProfileRepository;
import com.medisoft.medicalapp.repository.PatientProfileRepository;
import com.medisoft.medicalapp.service.AppointmentService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/api/patient")
@Tag(name = "Patient Controller", description = "Endpoints for patient operations")
@PreAuthorize("hasRole('PATIENT')")
@SecurityRequirement(name = "basicAuth")
public class PatientController {

    @Autowired
    private DoctorProfileRepository doctorProfileRepository;

    @Autowired
    private PatientProfileRepository patientProfileRepository;

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping
    public String Test(){
        return "Hello From Patient";
    }

    //List all doctors:
    @GetMapping("/doctors")
    public ResponseEntity<?> getAllDoctors() {
        List<DoctorProfile> doctorProfiles = doctorProfileRepository.findAll();
        if (doctorProfiles.isEmpty()) {
            throw new  UserNotFoundException("No doctors found");
        }
        return ResponseEntity.ok(doctorProfiles);
    }

    @PostMapping("/appointments")
    public ResponseEntity<?> createAppointmentRequest(
            @RequestBody AppointmentRequestDto dto,
            @AuthenticationPrincipal UserDetails userDetails
            ) throws AccessDeniedException {
        Appointment appointment = appointmentService.createAppointment(userDetails.getUsername(), dto);

        return ResponseEntity.ok(appointment);
    }

}
