package com.medisoft.medicalapp.service;

import com.medisoft.medicalapp.dto.RegisterRequest;
import com.medisoft.medicalapp.entity.User;

public interface UserService {
    User registerNewUser(RegisterRequest dto);
}
