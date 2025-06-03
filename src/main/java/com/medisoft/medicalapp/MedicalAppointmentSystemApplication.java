package com.medisoft.medicalapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class MedicalAppointmentSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(MedicalAppointmentSystemApplication.class, args);
	}

}
