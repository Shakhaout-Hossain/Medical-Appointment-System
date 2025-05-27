package com.medisoft.medicalapp.controller;

import com.medisoft.medicalapp.entity.DoctorProfile;
import com.medisoft.medicalapp.entity.User;
import com.medisoft.medicalapp.repository.DoctorProfileRepository;
import com.medisoft.medicalapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private DoctorProfileRepository doctorProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @PutMapping("/approve-doctor/{username}")
    @Transactional
    public ResponseEntity<String> approveDoctor(@PathVariable String username) {
        DoctorProfile doctorProfile = doctorProfileRepository.findByUser_UserName(username)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found for username: " + username));

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


    @GetMapping
    public String Test(){
        return "Hello From Admin";
    }
}

