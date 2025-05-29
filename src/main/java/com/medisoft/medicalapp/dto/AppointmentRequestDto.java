package com.medisoft.medicalapp.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentRequestDto {

    private Long doctorId;
    private LocalDateTime appointmentTime;
    private String notes;

}
