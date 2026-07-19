package com.credx.campusportal.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            // Alter the table users to ensure profile_image can store long base64 strings
            jdbcTemplate.execute("ALTER TABLE users MODIFY COLUMN profile_image LONGTEXT;");
            System.out.println("Database Initializer: Successfully altered users.profile_image to LONGTEXT");
        } catch (Exception e) {
            // Ignore errors if table/column does not exist yet or column already modified
            System.out.println("Database Initializer: Column modification skipped or already done: " + e.getMessage());
        }
    }
}
