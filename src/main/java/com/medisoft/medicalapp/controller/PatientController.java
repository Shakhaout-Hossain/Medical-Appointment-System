package com.medisoft.medicalapp.controller;

import com.medisoft.medicalapp.dto.AppointmentRequestDto;
import com.medisoft.medicalapp.dto.AppointmentResponseDto;
import com.medisoft.medicalapp.entity.Appointment;
import com.medisoft.medicalapp.entity.DoctorProfile;
import com.medisoft.medicalapp.exception.UserNotFoundException;
import com.medisoft.medicalapp.repository.AppointmentRepository;
import com.medisoft.medicalapp.repository.DoctorProfileRepository;
import com.medisoft.medicalapp.repository.PatientProfileRepository;
import com.medisoft.medicalapp.service.AppointmentService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

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

    @Autowired
    private AppointmentRepository appointmentRepository;

    @GetMapping
    public String Test(){
        return "Hello From Patient";
    }

    //List all doctors:
    @GetMapping("/doctors")
    public ResponseEntity<?> getAllDoctors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size,
            @RequestParam(defaultValue = "specialty") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<DoctorProfile> doctorProfilePage = doctorProfileRepository.findByApprovedTrue(pageable);
//        List<DoctorProfile> doctorProfiles = doctorProfileRepository.findAll();
        if (doctorProfilePage.isEmpty()) {
            throw new  UserNotFoundException("No doctors found");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("doctors", doctorProfilePage.getContent());
        response.put("currentPage", doctorProfilePage.getNumber()+1);
        response.put("totalItems", doctorProfilePage.getTotalElements());
        response.put("totalPages", doctorProfilePage.getTotalPages());

        return ResponseEntity.ok(response);

    }

    @PostMapping("/appointment")
    public ResponseEntity<?> createAppointmentRequest(
            @RequestBody AppointmentRequestDto dto,
            @AuthenticationPrincipal UserDetails userDetails
            ) throws AccessDeniedException {
        Appointment appointment = appointmentService.createAppointment(userDetails.getUsername(), dto);
        AppointmentResponseDto appointmentResponseDto = new AppointmentResponseDto();
        appointmentResponseDto.setAppointment(appointment);
        appointmentResponseDto.setMessage("Appointment created successfully");
        return ResponseEntity.ok(appointmentResponseDto);
    }

    /// Get All Requirements
    @GetMapping("/appointments")
    public ResponseEntity<?> getAllAppointments(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "appointmentTime") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        String userName = userDetails.getUsername();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortDir), sortBy));

        Page<Appointment> appointmentPage = appointmentRepository.findByPatientUserUserName(
                userName,
                pageable
        );

        if (appointmentPage.isEmpty()) {
            throw new UserNotFoundException("No appointments found.");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("appointments", appointmentPage.getContent());
        response.put("currentPage", appointmentPage.getNumber() + 1);
        response.put("totalItems", appointmentPage.getTotalElements());
        response.put("totalPages", appointmentPage.getTotalPages());

        return ResponseEntity.ok(response);
    }


    @GetMapping("/appointments/upcoming")
    public ResponseEntity<?> getUpcomingAppointments(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "appointmentTime") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        String userName = userDetails.getUsername();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortDir), sortBy));
        Page<Appointment> appointmentPage = appointmentRepository.findByPatientUserUserNameAndAppointmentTimeAfter(
                userName,
                LocalDateTime.now(),
                pageable
        );
        if(appointmentPage.isEmpty()){
            throw new UserNotFoundException("No upcoming appointments found.");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("appointments", appointmentPage.getContent());
        response.put("currentPage", appointmentPage.getNumber()+1);
        response.put("totalItems", appointmentPage.getTotalElements());
        response.put("totalPages", appointmentPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/appointments/previous")
    public ResponseEntity<?> getPreviousAppointments(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "appointmentTime") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        String userName = userDetails.getUsername();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortDir), sortBy));
        Page<Appointment> appointmentPage = appointmentRepository.findByPatientUserUserNameAndAppointmentTimeBefore(
                userName,
                LocalDateTime.now(),
                pageable
        );

        if(appointmentPage.isEmpty()){
            throw new UserNotFoundException("No previous appointments found.");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("appointments", appointmentPage.getContent());
        response.put("currentPage", appointmentPage.getNumber()+1);
        response.put("totalItems", appointmentPage.getTotalElements());
        response.put("totalPages", appointmentPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/appointments/doctor/{doctorId}")
    public ResponseEntity<?> getAppointmentsByDoctor(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long doctorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "appointmentTime") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        String userName = userDetails.getUsername();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortDir), sortBy));
        Page<Appointment> appointmentPage = appointmentRepository.findByPatientUserUserNameAndDoctorId(
                userName,
                doctorId,
                pageable
        );

        if(appointmentPage.isEmpty()){
            throw new UserNotFoundException("No appointments found with doctor id: " + doctorId);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("appointments", appointmentPage.getContent());
        response.put("currentPage", appointmentPage.getNumber()+1);
        response.put("totalItems", appointmentPage.getTotalElements());
        response.put("totalPages", appointmentPage.getTotalPages());

        return ResponseEntity.ok(response);
    }


}
