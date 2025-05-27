package com.medisoft.medicalapp.dto;

import com.medisoft.medicalapp.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RegisterRequestDto {
    @NotBlank(message = "Username must not be blank")
    @Size(min = 4, max = 50)
    private String userName;

    @NotBlank
    @Size(min = 6, max = 100, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank
    private String fullName;

    @Email
    @NotBlank
    @Size(max = 100)
    private String email;

    @NotNull
    private Role role;

    // Patient-specific fields
    private LocalDate dateOfBirth;
    private String gender;
    private String address;

    // Doctor-specific fields
    private String specialty;
    private String qualification;
    private String bio;
}

