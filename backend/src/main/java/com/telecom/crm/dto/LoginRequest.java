package com.telecom.crm.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    private Boolean requireMfa = false;

    private String mfaCode;

    public LoginRequest() {}

    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Boolean getRequireMfa() { return requireMfa; }
    public void setRequireMfa(Boolean requireMfa) { this.requireMfa = requireMfa; }

    public String getMfaCode() { return mfaCode; }
    public void setMfaCode(String mfaCode) { this.mfaCode = mfaCode; }
}
