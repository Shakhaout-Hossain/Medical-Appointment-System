package com.medisoft.medicalapp.controller;

import com.medisoft.medicalapp.entity.DoctorProfile;
import com.medisoft.medicalapp.entity.PatientProfile;
import com.medisoft.medicalapp.entity.User;
import com.medisoft.medicalapp.exception.UserNotFoundException;
import com.medisoft.medicalapp.repository.DoctorProfileRepository;
import com.medisoft.medicalapp.repository.PatientProfileRepository;
import com.medisoft.medicalapp.repository.UserRepository;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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


    /// Approve Doctor By userName
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

    /// Approve All UnApproved Doctors
    @PutMapping("/approve-all-doctors")
    @Transactional
    public ResponseEntity<?> approveAllUnapprovedDoctors() {
        List<DoctorProfile> unapprovedDoctors = doctorProfileRepository.findByApproved(false);

        if (unapprovedDoctors.isEmpty()) {
            return ResponseEntity.ok("No unapproved doctors found.");
        }

        for (DoctorProfile doctor : unapprovedDoctors) {
            doctor.setApproved(true);

            User user = doctor.getUser();
            if (user != null) {
                user.setEnabled(true);
                userRepository.save(user);
            }
            else {
                throw new UsernameNotFoundException("User Not Available");
            }

            doctorProfileRepository.save(doctor);
        }

        return ResponseEntity.ok(unapprovedDoctors.size() + " doctors approved successfully.");
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
    public ResponseEntity<?> getAllDoctors(@RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<DoctorProfile> doctorPage = doctorProfileRepository.findAll(pageable);
        if (doctorPage.isEmpty()) {
            throw new  UserNotFoundException("No doctors found");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("doctors", doctorPage.getContent());
        response.put("currentPage", doctorPage.getNumber()+1);
        response.put("totalItems", doctorPage.getTotalElements());
        response.put("totalPages", doctorPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    //List all patients:
    @GetMapping("/patients")
    public ResponseEntity<?> getAllPatients(@RequestParam(defaultValue = "0") int page,
                                            @RequestParam(defaultValue = "100") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PatientProfile> patientProfilesPage = patientProfileRepository.findAll(pageable);
        if (patientProfilesPage.isEmpty()) {

            throw new UserNotFoundException("No patients found");
        }
        Map<String, Object> response = new HashMap<>();
        response.put("patients", patientProfilesPage.getContent());
        response.put("currentPage", patientProfilesPage.getNumber()+1);
        response.put("totalItems", patientProfilesPage.getTotalElements());
        response.put("totalPages", patientProfilesPage.getTotalPages());

        return ResponseEntity.ok(response);
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

