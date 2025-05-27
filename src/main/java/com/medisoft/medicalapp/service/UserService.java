package com.medisoft.medicalapp.service;

import com.medisoft.medicalapp.dto.LoginRequestDto;
import com.medisoft.medicalapp.dto.RegisterRequestDto;
import com.medisoft.medicalapp.entity.User;
import com.medisoft.medicalapp.exception.AccountNotApprovedException;
import com.medisoft.medicalapp.exception.InvalidCredentialsException;
import com.medisoft.medicalapp.exception.UserNotFoundException;

public interface UserService {
    User loginUser(LoginRequestDto dto) throws UserNotFoundException, InvalidCredentialsException, AccountNotApprovedException;
    User registerNewUser(RegisterRequestDto dto);
}
