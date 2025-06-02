package com.medisoft.medicalapp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

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

    @Column(length = 1000)
    private String bio;
    private boolean approved = false;

    // ⏰ Available working hours
    private LocalTime availableFrom;
    private LocalTime availableTo;

    // 📅 Working days (e.g., MONDAY to FRIDAY)
    @ElementCollection(targetClass = DayOfWeek.class)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "doctor_working_days", joinColumns = @JoinColumn(name = "doctor_id"))
    @Column(name = "day_of_week")
    private Set<DayOfWeek> workingDays;


    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Appointment> appointments = new ArrayList<>();
    // Constructors, getters, setters
}
