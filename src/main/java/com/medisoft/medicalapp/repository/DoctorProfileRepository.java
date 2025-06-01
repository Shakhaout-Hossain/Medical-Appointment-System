package com.medisoft.medicalapp.repository;

import com.medisoft.medicalapp.entity.DoctorProfile;
import org.springframework.data.jpa.repository.JpaRepository;


import java.awt.print.Pageable;
import java.util.List;
import java.util.Optional;


public interface DoctorProfileRepository extends JpaRepository<DoctorProfile, Long> {

    Optional<DoctorProfile> findByUser_UserName(String userName);
    boolean existsByUserUserName(String userName);


    List<DoctorProfile> findByApproved(boolean approved);
}
