package com.credx.campusportal.controller;

import com.credx.campusportal.dto.common.PostingDto;
import com.credx.campusportal.service.AdminService;
import com.credx.campusportal.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final AnalyticsService analyticsService;

    public AdminController(AdminService adminService, AnalyticsService analyticsService) {
        this.adminService = adminService;
        this.analyticsService = analyticsService;
    }

    @GetMapping("/postings/pending")
    public ResponseEntity<List<PostingDto>> getPendingJobPostings() {
        List<PostingDto> postings = adminService.getPendingJobPostings();
        return ResponseEntity.ok(postings);
    }

    @GetMapping("/postings")
    public ResponseEntity<List<PostingDto>> getAllJobPostings() {
        // Will be fully implemented in the Service module
        return ResponseEntity.ok(List.of());
    }

    @PostMapping("/postings/{id}/approve")
    public ResponseEntity<PostingDto> approveJobPosting(@PathVariable Long id) {
        // Will be fully implemented in the Service module
        return ResponseEntity.ok(new PostingDto());
    }

    @PostMapping("/postings/{id}/reject")
    public ResponseEntity<PostingDto> rejectJobPosting(@PathVariable Long id) {
        // Will be fully implemented in the Service module
        return ResponseEntity.ok(new PostingDto());
    }

    @GetMapping("/analytics/applications-per-company")
    public ResponseEntity<Map<String, Long>> getApplicationsPerCompany() {
        Map<String, Long> stats = analyticsService.getApplicationsPerCompany();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/analytics/placement-rate")
    public ResponseEntity<Map<String, Object>> getPlacementRate() {
        Map<String, Object> analytics = analyticsService.getSystemAnalytics();
        return ResponseEntity.ok(analytics);
    }
}
