package com.medisoft.medicalapp.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/doctor")
@PreAuthorize("hasRole('Doctor')")
public class DoctorController {
    @GetMapping
    public String Test(){
        return "Hello From Doctor";
    }
}
