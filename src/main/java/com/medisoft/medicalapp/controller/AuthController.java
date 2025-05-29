package com.medisoft.medicalapp.controller;


import com.medisoft.medicalapp.dto.LoginRequestDto;
import com.medisoft.medicalapp.dto.RegisterRequestDto;
import com.medisoft.medicalapp.entity.User;
import com.medisoft.medicalapp.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Auth Controller", description = "Endpoints for Auth operations")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // Register a new user
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@Valid @RequestBody RegisterRequestDto registerRequestDto) {
        User registeredUser = userService.registerNewUser(registerRequestDto);
        return ResponseEntity.ok(registeredUser);
    }

    // Batch Register
    @Operation(summary = "Batch register users")
    @PostMapping("/register/batch")
    public ResponseEntity<?> registerMultipleUsers(@Valid @RequestBody List<RegisterRequestDto> users) {
        var registeredUsers = userService.registerMultipleUsers(users);
        return ResponseEntity.ok(registeredUsers);
    }

    // Authenticate and log in a user
    @PostMapping("/login")
    public ResponseEntity<User> loginUser(@Valid @RequestBody LoginRequestDto loginRequestDto) {
        User authenticatedUser = userService.loginUser(loginRequestDto);
        return ResponseEntity.ok(authenticatedUser);
    }

    @GetMapping
    public String Test(){
        return "Hello From Auth Controller.";
    }
}
