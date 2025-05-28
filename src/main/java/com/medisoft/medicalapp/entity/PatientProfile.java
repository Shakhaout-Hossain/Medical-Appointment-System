package com.medisoft.medicalapp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

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
    private String address;

    // 📝 New field for patient's health notes or description
    @Column(length = 1000)
    private String description;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Appointment> appointments = new ArrayList<>();
}



