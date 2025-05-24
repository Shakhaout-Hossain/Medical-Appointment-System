package com.medisoft.medicalapp.controller;


import com.medisoft.medicalapp.dto.RegisterRequest;
import com.medisoft.medicalapp.entity.User;
import com.medisoft.medicalapp.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?>  registerUser(@Valid @RequestBody RegisterRequest registerRequest){
        User saved = userService.registerNewUser(registerRequest);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("{\\\"message\\\":\\\"User registered successfully\\\",\\\"userId\\\":\" + saved.getId() + \"}");
    }
//    public String register(@RequestBody User user){
//        return user.getFullName();
//    }

    @GetMapping
    public String Test(){
        return "Hello From Auth Controller.";
    }
}
