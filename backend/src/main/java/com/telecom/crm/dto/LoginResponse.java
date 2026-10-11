package com.telecom.crm.dto;

import java.util.Set;

public class LoginResponse {
    private String token;
    private String refreshToken;
    private String tokenType = "Bearer";
    private Long userId;
    private String username;
    private String email;
    private String fullName;
    private Set<String> roles;

    // Security & MFA Challenge Fields
    private boolean mfaRequired = false;
    private String tempToken;
    private String maskedPhone;
    private String sandboxOtp; // For instant testing in dev/sandbox mode

    public LoginResponse() {}

    public LoginResponse(String token, String refreshToken, Long userId, String username, String email, String fullName, Set<String> roles) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.roles = roles;
    }

    public static LoginResponse mfaChallenge(String tempToken, String username, String maskedPhone, String sandboxOtp) {
        LoginResponse resp = new LoginResponse();
        resp.setMfaRequired(true);
        resp.setTempToken(tempToken);
        resp.setUsername(username);
        resp.setMaskedPhone(maskedPhone);
        resp.setSandboxOtp(sandboxOtp);
        return resp;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }

    public boolean isMfaRequired() { return mfaRequired; }
    public void setMfaRequired(boolean mfaRequired) { this.mfaRequired = mfaRequired; }

    public String getTempToken() { return tempToken; }
    public void setTempToken(String tempToken) { this.tempToken = tempToken; }

    public String getMaskedPhone() { return maskedPhone; }
    public void setMaskedPhone(String maskedPhone) { this.maskedPhone = maskedPhone; }

    public String getSandboxOtp() { return sandboxOtp; }
    public void setSandboxOtp(String sandboxOtp) { this.sandboxOtp = sandboxOtp; }
}
