package com.fms.service;

import com.fms.dto.AuthResponse;
import com.fms.dto.LoginRequest;
import com.fms.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
