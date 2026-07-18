package com.credx.campusportal.dto.student;

import lombok.Data;

@Data
public class StudentProfileDto {
    private Long id;
    private Long userId;
    private String studentName;
    private String studentEmail;
    private String branch;
    private Double gpa;
    private Integer gradYear;
    private String resumeUrl;
    private String updatedByList;
}
