package com.medisoft.medicalapp.controller;

import com.medisoft.medicalapp.dto.PrescriptionRequestDto;
import com.medisoft.medicalapp.entity.Appointment;
import com.medisoft.medicalapp.entity.DoctorProfile;
import com.medisoft.medicalapp.entity.Prescription;
import com.medisoft.medicalapp.entity.User;
import com.medisoft.medicalapp.exception.UserNotFoundException;
import com.medisoft.medicalapp.repository.AppointmentRepository;
import com.medisoft.medicalapp.service.PrescriptionService;
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

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/doctor")
@Tag(name = "Doctor Controller", description = "Endpoints for doctor operations")
@PreAuthorize("hasRole('DOCTOR')")
@SecurityRequirement(name = "basicAuth")
public class DoctorController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PrescriptionService prescriptionService;

    ///  Upcoming Appointment List
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
        Page<Appointment> appointmentPage = appointmentRepository.findByDoctor_User_UserNameAndAppointmentTimeAfter(
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


    ///  Previous Appointment List
    @GetMapping("/appointments/previous")
    public ResponseEntity<?> getPreviousAppointments(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "appointmentTime") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        String userName = userDetails.getUsername();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortDir), sortBy));
        Page<Appointment> appointmentPage = appointmentRepository.findByDoctor_User_UserNameAndAppointmentTimeBefore(
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

    @PostMapping("/patients/{patientId}/prescription")
    public ResponseEntity<Prescription> createPrescription(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size,
            @PathVariable Long patientId,
            @RequestBody PrescriptionRequestDto dto,
            @AuthenticationPrincipal UserDetails userDetails
    ) {

        Pageable pageable = PageRequest.of(page, size);

        String doctorUserName =  userDetails.getUsername();

        // Create the prescription using the service
        Prescription prescription = prescriptionService.createPrescriptionForPatient(patientId, dto, doctorUserName, pageable);
        return ResponseEntity.ok(prescription);
    }

    @GetMapping
    public String Test(){
        return "Hello From Doctor";
    }
}
