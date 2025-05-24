package com.medisoft.medicalapp.service;

import com.medisoft.medicalapp.dto.RegisterRequest;
import com.medisoft.medicalapp.entity.DoctorProfile;
import com.medisoft.medicalapp.entity.PatientProfile;
import com.medisoft.medicalapp.entity.User;
import com.medisoft.medicalapp.enums.Role;
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

//    public User registerUser(String userName, String password, String fullName, String email, Role role) {
//        if (userRepository.existsByUserName(userName)) {
//            throw new RuntimeException("Username already exists");
//        }
//
//        User user = new User();
//        user.setUserName(userName);
//        user.setPassword(password);
////        user.setPassword(passwordEncoder.encode(password));
//        user.setFullName(fullName);
//        user.setEmail(email);
//        user.setRole(role);
//        user.setEnabled(true);
//
//        user = userRepository.save(user);
//
//        if (role == Role.PATIENT) {
//            PatientProfile profile = new PatientProfile();
//            profile.setUser(user);
//            profile.setId(user.getId());
//            patientProfileRepository.save(profile);
//        } else if (role == Role.DOCTOR) {
//            DoctorProfile profile = new DoctorProfile();
//            profile.setUser(user);
//            profile.setId(user.getId());
//            profile.setApproved(false);
//            doctorProfileRepository.save(profile);
//        }
//
//        return user;
//    }

    @Override
    @Transactional
    public User registerNewUser(RegisterRequest dto) {
        if(userRepository.existsByUserName(dto.getUserName())){
            throw new IllegalArgumentException("Username already in use");
        }
        if(userRepository.existByEmail(dto.getEmail())){
            throw new IllegalArgumentException("Email already in use");
        }
        User user = new User();
        user.setUserName(dto.getUserName());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setRole(dto.getRole());

        if(dto.getRole() == Role.DOCTOR){
            DoctorProfile doctorProfile = new DoctorProfile();
            doctorProfile.setUser(user);
            doctorProfile.setSpecialty(dto.getSpecialty());
            doctorProfile.setQualification(dto.getQualification());
            doctorProfile.setBio(dto.getBio());
            doctorProfile.setApproved(false);
        }
        else if(dto.getRole() == Role.PATIENT){
            PatientProfile patientProfile = new PatientProfile();
            patientProfile.setUser(user);
            patientProfile.setGender(dto.getGender());
            patientProfile.setAddress(dto.getAddress());
            patientProfile.setDateOfBirth(dto.getDateOfBirth());
        }

        return userRepository.save(user);
    }
}