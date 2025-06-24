package com.medisoft.medicalapp.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class EmailServiceTests {
    @Autowired
    private EmailService emailService;

    @Test
    void testSendWelcomeEmail(){
        emailService.sendWelcomeEmail("shakhaout126@gmail.com", "Rimon");
    }
}
