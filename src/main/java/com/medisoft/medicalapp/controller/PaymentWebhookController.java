package com.medisoft.medicalapp.controller;

import com.medisoft.medicalapp.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/webhooks")
public class PaymentWebhookController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("/payment")
    public ResponseEntity<String> handlePaymentWebhook() {
        return ResponseEntity.ok("Received");
    }
}
