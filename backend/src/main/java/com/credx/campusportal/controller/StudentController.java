package com.credx.campusportal.controller;

import com.credx.campusportal.dto.student.StudentProfileDto;
import com.credx.campusportal.dto.common.PostingDto;
import com.credx.campusportal.dto.common.ApplicationDto;
import com.credx.campusportal.security.CustomUserDetails;
import com.credx.campusportal.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/profile")
    public ResponseEntity<StudentProfileDto> createOrUpdateProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody StudentProfileDto dto) {
        StudentProfileDto profile = studentService.createOrUpdateProfile(userDetails.getId(), dto);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/profile")
    public ResponseEntity<StudentProfileDto> getProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        StudentProfileDto profile = studentService.getProfileByUserId(userDetails.getId());
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/all")
    public ResponseEntity<List<StudentProfileDto>> getAllProfiles() {
        List<StudentProfileDto> profiles = studentService.getAllProfiles();
        return ResponseEntity.ok(profiles);
    }

    @PutMapping("/{userId}/profile-other")
    public ResponseEntity<StudentProfileDto> updateProfileByOther(
            @PathVariable Long userId,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody StudentProfileDto dto) {
        StudentProfileDto profile = studentService.updateProfileByOther(
                userId,
                dto,
                userDetails.getUser().getName(),
                userDetails.getUser().getRole().name()
        );
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/postings")
    public ResponseEntity<List<PostingDto>> getApprovedJobPostings() {
        List<PostingDto> postings = studentService.getApprovedPostings();
        return ResponseEntity.ok(postings);
    }

    @PostMapping("/applications")
    public ResponseEntity<ApplicationDto> applyToJobPosting(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam Long postingId) {
        ApplicationDto application = studentService.applyToPosting(userDetails.getId(), postingId);
        return ResponseEntity.ok(application);
    }

    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationDto>> getOwnApplications(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<ApplicationDto> applications = studentService.getOwnApplications(userDetails.getId());
        return ResponseEntity.ok(applications);
    }
}
