package com.telecom.crm;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("dev")
class TelecomCrmApplicationTests {

    @Test
    @DisplayName("Context Loads Successfully with Flyway Migrations and H2")
    void contextLoads() {
    }
}
