package com.medisoft.medicalapp.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/doctor")
@Tag(name = "Doctor Controller", description = "Endpoints for doctor operations")
@PreAuthorize("hasRole('Doctor')")
@SecurityRequirement(name = "basicAuth")
public class DoctorController {
    @GetMapping
    public String Test(){
        return "Hello From Doctor";
    }
}
