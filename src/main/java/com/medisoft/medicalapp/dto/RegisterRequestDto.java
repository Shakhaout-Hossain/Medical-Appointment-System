package com.medisoft.medicalapp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.medisoft.medicalapp.enums.Gender;
import com.medisoft.medicalapp.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

@Data
public class RegisterRequestDto {
    @NotBlank(message = "Username must not be blank")
    @Size(min = 4, max = 50, message = "UserName must have minimum 4 and maximum 50 characters")
    private String userName;

    @NotBlank
    @Size(min = 6, max = 100, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank
    private String fullName;

    @Email
    @NotBlank
    @Size(max = 100, message = "Email must be at maximum 100 characters")
    private String email;

    @NotNull(message = "Role type must not be blank")
    private Role role;

    @NotNull(message = "Gender must not be blank")
    private Gender gender;

    // Patient-specific fields

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "d/M/yyyy")
    private LocalDate dateOfBirth;
    private String address;
    private String description;

    // Doctor-specific fields
    private String specialty;
    private String qualification;
    @Size(max = 1000, message = "Bio must be at maximum 1000 characters")
    private String bio;

    // ⏰ Doctor's working hours
    @JsonFormat(pattern = "h:mm a")
    private LocalTime availableFrom;
    @JsonFormat(pattern = "h:mm a")
    private LocalTime availableTo;

    // 📅 Doctor's working days
    private Set<DayOfWeek> workingDays;
}