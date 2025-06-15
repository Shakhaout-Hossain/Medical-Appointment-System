package com.medisoft.medicalapp.service;


import com.medisoft.medicalapp.entity.Appointment;
import com.medisoft.medicalapp.enums.PaymentStatus;
import com.medisoft.medicalapp.exception.UserNotFoundException;
import com.medisoft.medicalapp.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;


@Service  // ✅ Marks this class as a Spring service component
public class PaymentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Transactional
    public boolean isPaymentSuccessful(Long id) {
        Optional<Appointment> optionalAppointment = appointmentRepository.findById(id);

        if (optionalAppointment.isEmpty()) {
            throw new UserNotFoundException("Appointment Not Found");
        }

        Appointment appointment = optionalAppointment.get();
        if (appointment.getPaymentStatus() == PaymentStatus.PENDING) {
//            appointment.setPaymentStatus(PaymentStatus.SUCCESS);
//            appointmentRepository.save(appointment);
            //logic for payment
            return true;
        }

        return false; // You may also return a boolean based on whether a change was made
    }
}