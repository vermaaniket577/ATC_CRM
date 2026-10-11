package com.telecom.crm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class OtpVerificationRequest {

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Temporary session token is required")
    private String tempToken;

    @NotBlank(message = "OTP code is required")
    @Pattern(regexp = "^[0-9]{6}$", message = "OTP must be a 6-digit numeric code")
    private String otpCode;

    public OtpVerificationRequest() {}

    public OtpVerificationRequest(String username, String tempToken, String otpCode) {
        this.username = username;
        this.tempToken = tempToken;
        this.otpCode = otpCode;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getTempToken() { return tempToken; }
    public void setTempToken(String tempToken) { this.tempToken = tempToken; }

    public String getOtpCode() { return otpCode; }
    public void setOtpCode(String otpCode) { this.otpCode = otpCode; }
}
