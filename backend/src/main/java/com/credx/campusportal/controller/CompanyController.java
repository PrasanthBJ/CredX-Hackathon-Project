package com.credx.campusportal.controller;

import com.credx.campusportal.dto.company.CompanyProfileDto;
import com.credx.campusportal.dto.common.PostingDto;
import com.credx.campusportal.security.CustomUserDetails;
import com.credx.campusportal.service.CompanyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/company")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping("/profile")
    public ResponseEntity<CompanyProfileDto> createOrUpdateProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CompanyProfileDto dto) {
        CompanyProfileDto profile = companyService.createOrUpdateProfile(userDetails.getId(), dto);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/profile")
    public ResponseEntity<CompanyProfileDto> getProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        CompanyProfileDto profile = companyService.getProfileByUserId(userDetails.getId());
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/postings")
    public ResponseEntity<PostingDto> createJobPosting(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody PostingDto dto) {
        PostingDto posting = companyService.createJobPosting(userDetails.getId(), dto);
        return ResponseEntity.ok(posting);
    }

    @GetMapping("/postings")
    public ResponseEntity<List<PostingDto>> getOwnJobPostings(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<PostingDto> postings = companyService.getOwnJobPostings(userDetails.getId());
        return ResponseEntity.ok(postings);
    }
}
