package com.medisoft.medicalapp.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendWelcomeEmail(String toEmail, String fullName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Welcome to MediConnect – Medical Appointment System");
            message.setText("Hello " + fullName + ",\n\nThank you for registering. We're excited to have you on board!");
            message.setFrom("shakhaouthossainrimon@gmail.com");
            javaMailSender.send(message);
        } catch (Exception e) {
            log.error("Exception While Send Email. ", e);
        }

    }

    public void sendReminderEmail(String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("shakhaouthossainrimon@gmail.com");
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);
        javaMailSender.send(message);
    }
}
