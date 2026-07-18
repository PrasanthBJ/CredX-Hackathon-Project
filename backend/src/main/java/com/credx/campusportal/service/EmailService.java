package com.credx.campusportal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Async
    public void sendVerificationEmail(String toEmail, String name, String token) {
        String verificationUrl = frontendUrl + "/verify-email?token=" + token;
        
        System.out.println("\n=== [DEVELOPER TESTING] EMAIL VERIFICATION URL ===");
        System.out.println("For User: " + name + " (" + toEmail + ")");
        System.out.println("Verification URL: " + verificationUrl);
        System.out.println("==================================================\n");

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
            
            String htmlContent = "<h3>Hello " + name + ",</h3>"
                    + "<p>Thank you for registering at CredX Campus Portal.</p>"
                    + "<p>Please click the link below to verify your email address and activate your account:</p>"
                    + "<p><a href=\"" + verificationUrl + "\" style=\"display: inline-block; padding: 10px 20px; color: white; background-color: #4f46e5; text-decoration: none; border-radius: 5px;\">Verify Email Address</a></p>"
                    + "<br/>"
                    + "<p>If the button doesn't work, copy and paste this URL into your browser:</p>"
                    + "<p>" + verificationUrl + "</p>"
                    + "<p>Note: This link will expire in 1 minute.</p>"
                    + "<p>Best regards,<br/>CredX Team</p>";
            
            helper.setText(htmlContent, true);
            helper.setTo(toEmail);
            helper.setSubject("Please verify your email address");
            helper.setFrom(fromEmail);
            
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            System.err.println("Failed to send verification email to " + toEmail + ": " + e.getMessage());
        }
    }
}
