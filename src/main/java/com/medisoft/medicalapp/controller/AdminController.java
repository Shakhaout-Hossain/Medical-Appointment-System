package com.medisoft.medicalapp.controller;

import com.medisoft.medicalapp.entity.DoctorProfile;
import com.medisoft.medicalapp.entity.User;
import com.medisoft.medicalapp.exception.UserNotFoundException;
import com.medisoft.medicalapp.repository.DoctorProfileRepository;
import com.medisoft.medicalapp.repository.PatientProfileRepository;
import com.medisoft.medicalapp.repository.UserRepository;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin Controller", description = "Endpoints for admin operations")
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "basicAuth")
public class AdminController {

    @Autowired
    private DoctorProfileRepository doctorProfileRepository;

    @Autowired
    private PatientProfileRepository patientProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @PutMapping("/approve-doctor/{userName}")
    @Transactional
    public ResponseEntity<String> approveDoctor(@PathVariable String userName) {
        DoctorProfile doctorProfile = doctorProfileRepository.findByUser_UserName(userName)
                .orElseThrow(() -> new UsernameNotFoundException("Doctor profile not found for userName: " + userName));

        if (doctorProfile.isApproved()) {
            return ResponseEntity.ok("Doctor already approved.");
        }

        doctorProfile.setApproved(true);
        doctorProfileRepository.save(doctorProfile);

        User user = doctorProfile.getUser();
        user.setEnabled(true);
        userRepository.save(user);

        return ResponseEntity.ok("Doctor approved successfully.");
    }

    @DeleteMapping("/remove-doctor/{userName}")
    @Transactional
    public ResponseEntity<String> removeDoctor(@PathVariable String userName) {
        DoctorProfile doctorProfile = doctorProfileRepository.findByUser_UserName(userName)
                .orElseThrow(() -> new UserNotFoundException("Doctor not found with userName: " + userName));

        doctorProfileRepository.delete(doctorProfile);
        userRepository.delete(doctorProfile.getUser());

        return ResponseEntity.ok("Doctor removed successfully.");
    }

    @DeleteMapping("/remove-patient/{userName}")
    @Transactional
    public ResponseEntity<String> removePatient(@PathVariable String userName) {
        var patientProfile = patientProfileRepository.findByUser_UserName(userName)
                .orElseThrow(() -> new UserNotFoundException("Patient not found with userName: " + userName));

        patientProfileRepository.delete(patientProfile);
        userRepository.delete(patientProfile.getUser());

        return ResponseEntity.ok("Patient removed successfully.");
    }

    //List all doctors:
    @GetMapping("/doctors")
    public ResponseEntity<?> getAllDoctors() {
        return ResponseEntity.ok(doctorProfileRepository.findAll());
    }

    //List all patients:
    @GetMapping("/patients")
    public ResponseEntity<?> getAllPatients() {
        return ResponseEntity.ok(patientProfileRepository.findAll());
    }

    @GetMapping("/doctors/approved")
    public ResponseEntity<?> getApprovedDoctors() {
        return ResponseEntity.ok(doctorProfileRepository.findByApproved(true));
    }

    @GetMapping("/doctors/unapproved")
    public ResponseEntity<?> getUnapprovedDoctors() {
        return ResponseEntity.ok(doctorProfileRepository.findByApproved(false));
    }

    @GetMapping
    public String Test(){
        return "Hello From Admin";
    }
}

