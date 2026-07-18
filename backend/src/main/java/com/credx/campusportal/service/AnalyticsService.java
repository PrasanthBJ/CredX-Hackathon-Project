package com.credx.campusportal.service;

import com.credx.campusportal.entity.enums.ApplicationStatus;
import com.credx.campusportal.repository.ApplicationRepository;
import com.credx.campusportal.repository.CompanyProfileRepository;
import com.credx.campusportal.repository.StudentProfileRepository;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class AnalyticsService {

    private final ApplicationRepository applicationRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final StudentProfileRepository studentProfileRepository;

    public AnalyticsService(ApplicationRepository applicationRepository,
                            CompanyProfileRepository companyProfileRepository,
                            StudentProfileRepository studentProfileRepository) {
        this.applicationRepository = applicationRepository;
        this.companyProfileRepository = companyProfileRepository;
        this.studentProfileRepository = studentProfileRepository;
    }

    public Map<String, Object> getSystemAnalytics() {
        Map<String, Object> analytics = new HashMap<>();

        long totalStudents = studentProfileRepository.count();
        long totalCompanies = companyProfileRepository.count();
        long totalApplications = applicationRepository.count();

        long acceptedApplications = applicationRepository.countByStatus(ApplicationStatus.SELECTED);
        double placementRate = totalStudents > 0 
                ? ((double) acceptedApplications / totalStudents) * 100.0 
                : 0.0;

        analytics.put("totalStudents", totalStudents);
        analytics.put("totalCompanies", totalCompanies);
        analytics.put("totalApplications", totalApplications);
        analytics.put("placementRatePercentage", placementRate);

        return analytics;
    }

    public Map<String, Long> getApplicationsPerCompany() {
        Map<String, Long> appCountPerCompany = new HashMap<>();
        
        // Initialize all companies with 0 application count
        companyProfileRepository.findAll().forEach(company -> {
            appCountPerCompany.put(company.getCompanyName(), 0L);
        });
        
        // Overlay the actual non-zero counts using a single aggregate query
        applicationRepository.countApplicationsPerCompany().forEach(row -> {
            String companyName = (String) row[0];
            Long count = (Long) row[1];
            appCountPerCompany.put(companyName, count);
        });
        
        return appCountPerCompany;
    }
}
