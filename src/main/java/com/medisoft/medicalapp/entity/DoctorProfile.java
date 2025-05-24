package com.medisoft.medicalapp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "doctor_profiles")
public class DoctorProfile {
    @Id
    private Long id;

    @OneToOne
    @MapsId
    private User user;

    private String specialty;
    private String qualification;
    private String bio;
    private boolean approved = false;

    // Availability, etc., can be added later

    // Constructors, getters, setters
}
