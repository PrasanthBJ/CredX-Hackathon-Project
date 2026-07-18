package com.credx.campusportal.dto.company;

import lombok.Data;

@Data
public class CompanyProfileDto {
    private Long id;
    private String companyName;
    private String description;
    private String website;
}
