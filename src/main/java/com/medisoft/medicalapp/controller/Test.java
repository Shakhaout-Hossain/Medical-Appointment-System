package com.medisoft.medicalapp.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
@Tag(name = "Test Controller", description = "Endpoints for Test operations")
public class Test {
    @GetMapping
    public String Hello(){
        return "Hello";
    }
}
