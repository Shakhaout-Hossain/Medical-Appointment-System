package com.medisoft.medicalapp.repository;

import com.medisoft.medicalapp.entity.DoctorProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;



import java.util.List;
import java.util.Optional;


public interface DoctorProfileRepository extends JpaRepository<DoctorProfile, Long> {

    Optional<DoctorProfile> findByUser_UserName(String userName);
    boolean existsByUserUserName(String userName);


    List<DoctorProfile> findByApproved(boolean approved);
    Page<DoctorProfile> findByApprovedTrue(Pageable pageable);

}
