package com.telecom.crm.service;

import com.telecom.crm.dto.LoginRequest;
import com.telecom.crm.dto.LoginResponse;
import com.telecom.crm.dto.OtpVerificationRequest;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    LoginResponse login(LoginRequest request, String ipAddress, String userAgent);
    LoginResponse verifyOtp(OtpVerificationRequest request, String ipAddress, String userAgent);
    LoginResponse refreshToken(String refreshToken);
}
