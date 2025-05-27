package com.medisoft.medicalapp.service;

import com.medisoft.medicalapp.dto.LoginRequestDto;
import com.medisoft.medicalapp.dto.RegisterRequestDto;
import com.medisoft.medicalapp.entity.DoctorProfile;
import com.medisoft.medicalapp.entity.PatientProfile;
import com.medisoft.medicalapp.entity.User;
import com.medisoft.medicalapp.enums.Role;
import com.medisoft.medicalapp.exception.AccountNotApprovedException;
import com.medisoft.medicalapp.exception.InvalidCredentialsException;
import com.medisoft.medicalapp.exception.UserNotFoundException;
import com.medisoft.medicalapp.repository.DoctorProfileRepository;
import com.medisoft.medicalapp.repository.PatientProfileRepository;
import com.medisoft.medicalapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService{
    @Autowired
    private  UserRepository userRepository;
    @Autowired
    private PatientProfileRepository patientProfileRepository;
    @Autowired
    private DoctorProfileRepository doctorProfileRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User loginUser(LoginRequestDto dto) {
        User user = userRepository.findByUserName(dto.getUserName())
                .orElseThrow(() -> new UserNotFoundException("User Not Found"));
        if(!passwordEncoder.matches(dto.getPassword(), user.getPassword())){
            throw new InvalidCredentialsException("Invalid password");
        }
        if(!user.isEnabled()){
            throw new AccountNotApprovedException("Account not approved. Please wait for admin approval.");
        }
        return user;
    }

    @Override
    @Transactional
    public User registerNewUser(RegisterRequestDto dto) {
        if(userRepository.existsByUserName(dto.getUserName())){
            throw new IllegalArgumentException("Username already in use");
        }
        if(userRepository.existsByEmail(dto.getEmail())){
            throw new IllegalArgumentException("Email already in use");
        }
        User user = new User();
        user.setUserName(dto.getUserName());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setRole(dto.getRole());
        if(dto.getRole() == Role.DOCTOR){
            user.setEnabled(false);
        }

        // Save user first to generate ID
        user = userRepository.save(user);

        if(dto.getRole() == Role.DOCTOR){
            DoctorProfile doctorProfile = new DoctorProfile();
            doctorProfile.setUser(user);
            doctorProfile.setSpecialty(dto.getSpecialty());
            doctorProfile.setQualification(dto.getQualification());
            doctorProfile.setBio(dto.getBio());
            doctorProfile.setApproved(false);
            doctorProfileRepository.save(doctorProfile);
        }
        else if(dto.getRole() == Role.PATIENT){
            PatientProfile patientProfile = new PatientProfile();
            patientProfile.setUser(user);
            patientProfile.setGender(dto.getGender());
            patientProfile.setAddress(dto.getAddress());
            patientProfile.setDateOfBirth(dto.getDateOfBirth());
            patientProfileRepository.save(patientProfile);
        }

        return user;
    }
}