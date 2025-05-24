package com.medisoft.medicalapp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "patient_profiles")
public class PatientProfile {
    @Id
    private Long id;

    @OneToOne
    @MapsId
    private User user;

    private LocalDate dateOfBirth;
    private String gender;
    private String address;

}



