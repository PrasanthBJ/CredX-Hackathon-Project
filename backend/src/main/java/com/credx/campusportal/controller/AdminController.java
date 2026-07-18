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
        List<PostingDto> postings = adminService.getAllJobPostings();
        return ResponseEntity.ok(postings);
    }

    @PostMapping("/postings/{id}/approve")
    public ResponseEntity<PostingDto> approveJobPosting(
            @PathVariable Long id,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.credx.campusportal.security.CustomUserDetails userDetails) {
        PostingDto posting = adminService.approveOrRejectJobPosting(id, com.credx.campusportal.entity.enums.PostingStatus.APPROVED, userDetails.getId());
        return ResponseEntity.ok(posting);
    }

    @PostMapping("/postings/{id}/reject")
    public ResponseEntity<PostingDto> rejectJobPosting(
            @PathVariable Long id,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.credx.campusportal.security.CustomUserDetails userDetails) {
        PostingDto posting = adminService.approveOrRejectJobPosting(id, com.credx.campusportal.entity.enums.PostingStatus.REJECTED, userDetails.getId());
        return ResponseEntity.ok(posting);
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
