package com.medisoft.medicalapp.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Test {
    @GetMapping
    public String Hello(){
        return "Hello";
    }
}
