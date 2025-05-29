package com.medisoft.medicalapp.service;

import com.medisoft.medicalapp.dto.AppointmentRequestDto;
import com.medisoft.medicalapp.entity.Appointment;

import java.nio.file.AccessDeniedException;

public interface AppointmentService {
    Appointment createAppointment(String username, AppointmentRequestDto dto) throws AccessDeniedException;
}
