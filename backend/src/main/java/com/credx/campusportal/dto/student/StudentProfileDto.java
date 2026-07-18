package com.credx.campusportal.dto.student;

import lombok.Data;

@Data
public class StudentProfileDto {
    private Long id;
    private String branch;
    private Double gpa;
    private Integer gradYear;
    private String resumeUrl;
}
