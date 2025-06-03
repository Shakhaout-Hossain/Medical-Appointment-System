package com.medisoft.medicalapp.dto;

import lombok.Data;

@Data
public class PrescriptionRequestDto {
    private String diagnosis;
    private String medications;
    private String advice;
}
