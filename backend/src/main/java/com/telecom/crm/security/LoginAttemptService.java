package com.telecom.crm.security;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service to protect against brute-force password guessing attacks and credential stuffing.
 * Locks accounts/IPs temporarily after multiple consecutive failed attempts.
 */
@Service
public class LoginAttemptService {

    public static final int MAX_ATTEMPTS = 5;
    public static final int LOCKOUT_MINUTES = 15;

    public static class AttemptRecord {
        private int failedAttempts = 0;
        private LocalDateTime lockedUntil = null;
        private LocalDateTime lastAttempt = LocalDateTime.now();

        public int getFailedAttempts() { return failedAttempts; }
        public void setFailedAttempts(int failedAttempts) { this.failedAttempts = failedAttempts; }
        public LocalDateTime getLockedUntil() { return lockedUntil; }
        public void setLockedUntil(LocalDateTime lockedUntil) { this.lockedUntil = lockedUntil; }
        public LocalDateTime getLastAttempt() { return lastAttempt; }
        public void setLastAttempt(LocalDateTime lastAttempt) { this.lastAttempt = lastAttempt; }
    }

    private final Map<String, AttemptRecord> userAttempts = new ConcurrentHashMap<>();
    private final Map<String, AttemptRecord> ipAttempts = new ConcurrentHashMap<>();

    public boolean isBlocked(String username, String ip) {
        cleanOldRecords();
        return isKeyBlocked(userAttempts.get(username.toLowerCase())) ||
               isKeyBlocked(ipAttempts.get(ip));
    }

    private boolean isKeyBlocked(AttemptRecord record) {
        if (record == null) return false;
        if (record.getLockedUntil() != null) {
            if (LocalDateTime.now().isBefore(record.getLockedUntil())) {
                return true;
            } else {
                // Lockout period expired
                record.setLockedUntil(null);
                record.setFailedAttempts(0);
                return false;
            }
        }
        return false;
    }

    public int recordFailedAttempt(String username, String ip) {
        cleanOldRecords();
        String uKey = username.toLowerCase();
        AttemptRecord userRec = userAttempts.computeIfAbsent(uKey, k -> new AttemptRecord());
        AttemptRecord ipRec = ipAttempts.computeIfAbsent(ip, k -> new AttemptRecord());

        userRec.setFailedAttempts(userRec.getFailedAttempts() + 1);
        userRec.setLastAttempt(LocalDateTime.now());

        ipRec.setFailedAttempts(ipRec.getFailedAttempts() + 1);
        ipRec.setLastAttempt(LocalDateTime.now());

        if (userRec.getFailedAttempts() >= MAX_ATTEMPTS) {
            userRec.setLockedUntil(LocalDateTime.now().plusMinutes(LOCKOUT_MINUTES));
        }
        if (ipRec.getFailedAttempts() >= MAX_ATTEMPTS * 2) {
            ipRec.setLockedUntil(LocalDateTime.now().plusMinutes(LOCKOUT_MINUTES));
        }

        return Math.max(0, MAX_ATTEMPTS - userRec.getFailedAttempts());
    }

    public void recordSuccess(String username, String ip) {
        if (username != null) {
            userAttempts.remove(username.toLowerCase());
        }
        if (ip != null) {
            ipAttempts.remove(ip);
        }
    }

    public long getRemainingLockoutMinutes(String username, String ip) {
        AttemptRecord userRec = userAttempts.get(username.toLowerCase());
        if (userRec != null && userRec.getLockedUntil() != null && LocalDateTime.now().isBefore(userRec.getLockedUntil())) {
            return ChronoUnit.MINUTES.between(LocalDateTime.now(), userRec.getLockedUntil()) + 1;
        }
        AttemptRecord ipRec = ipAttempts.get(ip);
        if (ipRec != null && ipRec.getLockedUntil() != null && LocalDateTime.now().isBefore(ipRec.getLockedUntil())) {
            return ChronoUnit.MINUTES.between(LocalDateTime.now(), ipRec.getLockedUntil()) + 1;
        }
        return 0;
    }

    public int getRemainingAttempts(String username) {
        AttemptRecord rec = userAttempts.get(username.toLowerCase());
        if (rec == null) return MAX_ATTEMPTS;
        return Math.max(0, MAX_ATTEMPTS - rec.getFailedAttempts());
    }

    private void cleanOldRecords() {
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        userAttempts.entrySet().removeIf(e -> e.getValue().getLastAttempt().isBefore(oneHourAgo) && e.getValue().getLockedUntil() == null);
        ipAttempts.entrySet().removeIf(e -> e.getValue().getLastAttempt().isBefore(oneHourAgo) && e.getValue().getLockedUntil() == null);
    }
}
