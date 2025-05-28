package com.medisoft.medicalapp.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/patient")
@Tag(name = "Patient Controller", description = "Endpoints for patient operations")
@PreAuthorize("hasRole('PATIENT')")
@SecurityRequirement(name = "basicAuth")
public class PatientController {
    @GetMapping
    public String Test(){
        return "Hello From Patient";
    }
}
