package com.credx.campusportal.dto.common;

import com.credx.campusportal.entity.enums.ApplicationStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ApplicationDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long postingId;
    private String postingTitle;
    private String companyName;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;
}
