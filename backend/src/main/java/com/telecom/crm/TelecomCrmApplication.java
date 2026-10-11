package com.telecom.crm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TelecomCrmApplication {

    public static void main(String[] args) {
        SpringApplication.run(TelecomCrmApplication.class, args);
    }
}
