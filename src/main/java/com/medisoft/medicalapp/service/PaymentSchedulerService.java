package com.medisoft.medicalapp.service;

import com.medisoft.medicalapp.entity.Appointment;
import com.medisoft.medicalapp.enums.AppointmentStatus;
import com.medisoft.medicalapp.enums.PaymentStatus;
import com.medisoft.medicalapp.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentSchedulerService {
    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PaymentService paymentService;

    @Scheduled(fixedRate = 600000) // every 60 seconds
    public void checkPendingPayments() {
        List<Appointment> pendingAppointments = appointmentRepository.findByStatus(AppointmentStatus.PENDING);

        for (Appointment appointment : pendingAppointments) {
            try {
                if (paymentService.isPaymentSuccessful(appointment.getId())) {
                    //System.out.println("\n\n"+appointment.getPaymentStatus()+"\n\n");
                    appointment.setPaymentStatus(PaymentStatus.SUCCESS);
                    appointment.setStatus(AppointmentStatus.CONFIRMED);
                    appointmentRepository.save(appointment);
                }
            } catch (Exception e) {
                // Log error, but continue with other appointments
                System.err.println("Failed to verify payment for appointment ID: " + appointment.getId());
                e.printStackTrace(); // or use a Logger
            }
        }
    }
}
