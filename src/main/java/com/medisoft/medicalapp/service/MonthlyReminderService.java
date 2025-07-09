package com.medisoft.medicalapp.service;

import com.medisoft.medicalapp.entity.User;
import com.medisoft.medicalapp.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.Executor;

@Service
@Slf4j
public class MonthlyReminderService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private  EmailService emailService;

    @Autowired
    @Qualifier("emailTaskExecutor")
    private Executor emailTaskExecutor;

    @Scheduled(cron = "0 0 9 1 * ?") // 9 AM on 1st day of each month
    //@Scheduled(cron = "0 33 16 * * ?") /// For Test
    public void sendMonthlyReminders() {
        List<User> users = userRepository.findAll();

        for (User user : users) {
            String body = "Hello " + user.getFullName() + "\n" + "This is your monthly reminder!";
            emailTaskExecutor.execute(() -> {
                try {
                    emailService.sendReminderEmail(
                            user.getEmail(),
                            "Monthly Reminder",
                            body
                    );
                } catch (Exception e) {
                    log.error("Failed to send reminder email to: {}", user.getEmail(), e);
                }
            });
        }

    }

}
