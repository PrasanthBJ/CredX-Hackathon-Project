package com.credx.campusportal.dto.common;

import com.credx.campusportal.entity.enums.PostingStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PostingDto {
    private Long id;
    private Long companyId;
    private String companyName;
    private String title;
    private String description;
    private String eligibility;
    private Double minGpa;
    private LocalDateTime deadline;
    private PostingStatus status;
    private LocalDateTime createdAt;
    private Long reviewedById;
    private String reviewedByName;
    private LocalDateTime reviewedAt;
}
