package com.telecom.crm.controller;

import com.telecom.crm.dto.ApiResponse;
import com.telecom.crm.dto.LoginRequest;
import com.telecom.crm.dto.LoginResponse;
import com.telecom.crm.dto.OtpVerificationRequest;
import com.telecom.crm.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication & Security", description = "Enterprise Login, 2FA OTP Step-Up, Brute-Force Shield, and Session Management")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user with brute-force protection, audit logs, and optional 2FA")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request,
                                                           HttpServletRequest httpRequest) {
        String ipAddress = extractClientIp(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");
        LoginResponse response = authService.login(request, ipAddress, userAgent);
        if (response.isMfaRequired()) {
            return ResponseEntity.ok(ApiResponse.ok("Two-Factor Authentication required. 6-digit OTP dispatched.", response));
        }
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @PostMapping("/verify-otp")
    @Operation(summary = "Verify 6-digit Two-Factor Authentication OTP code (DoT/TRAI privileged operator compliance)")
    public ResponseEntity<ApiResponse<LoginResponse>> verifyOtp(@Valid @RequestBody OtpVerificationRequest request,
                                                               HttpServletRequest httpRequest) {
        String ipAddress = extractClientIp(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");
        LoginResponse response = authService.verifyOtp(request, ipAddress, userAgent);
        return ResponseEntity.ok(ApiResponse.ok("Two-Factor Authentication verified successfully", response));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh expired access token with valid refresh token")
    public ResponseEntity<ApiResponse<LoginResponse>> refresh(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        LoginResponse response = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(ApiResponse.ok("Token refreshed successfully", response));
    }

    @PostMapping("/logout")
    @Operation(summary = "Invalidate user session")
    public ResponseEntity<ApiResponse<String>> logout() {
        return ResponseEntity.ok(ApiResponse.ok("Logged out successfully", null));
    }

    private String extractClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty() || "unknown".equalsIgnoreCase(xfHeader)) {
            return request.getRemoteAddr() != null ? request.getRemoteAddr() : "127.0.0.1";
        }
        return xfHeader.split(",")[0].trim();
    }
}
