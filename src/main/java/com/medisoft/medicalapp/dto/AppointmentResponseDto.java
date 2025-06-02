package com.medisoft.medicalapp.dto;

import com.medisoft.medicalapp.entity.Appointment;
import lombok.Data;

@Data
public class AppointmentResponseDto {
    private Appointment appointment;
    private String message;
}
