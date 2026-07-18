package com.credx.campusportal.service;

import com.credx.campusportal.dto.student.StudentProfileDto;
import com.credx.campusportal.dto.common.PostingDto;
import com.credx.campusportal.dto.common.ApplicationDto;
import com.credx.campusportal.entity.*;
import com.credx.campusportal.entity.enums.PostingStatus;
import com.credx.campusportal.entity.enums.ApplicationStatus;
import com.credx.campusportal.exception.*;
import com.credx.campusportal.repository.*;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentProfileRepository studentProfileRepository;
    private final PostingRepository postingRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public StudentService(StudentProfileRepository studentProfileRepository,
                          PostingRepository postingRepository,
                          ApplicationRepository applicationRepository,
                          UserRepository userRepository) {
        this.studentProfileRepository = studentProfileRepository;
        this.postingRepository = postingRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    public StudentProfileDto createOrUpdateProfile(Long userId, StudentProfileDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElse(new StudentProfile());

        profile.setUser(user);
        profile.setBranch(dto.getBranch());
        profile.setGpa(dto.getGpa());
        profile.setGradYear(dto.getGradYear());
        profile.setResumeUrl(dto.getResumeUrl());

        StudentProfile saved = studentProfileRepository.save(profile);
        return mapToDto(saved);
    }

    public StudentProfileDto getProfileByUserId(Long userId) {
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return mapToDto(profile);
    }

    public List<PostingDto> getApprovedPostings() {
        return postingRepository.findByStatus(PostingStatus.APPROVED)
                .stream()
                .map(this::mapToPostingDto)
                .collect(Collectors.toList());
    }

    public ApplicationDto applyToPosting(Long userId, Long postingId) {
        StudentProfile student = studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile must be created first"));

        Posting posting = postingRepository.findById(postingId)
                .orElseThrow(() -> new ResourceNotFoundException("Job posting not found"));

        if (posting.getStatus() != PostingStatus.APPROVED) {
            throw new InvalidStateTransitionException("Cannot apply to a non-approved job posting");
        }

        if (applicationRepository.existsByStudentIdAndPostingId(student.getId(), postingId)) {
            throw new DuplicateApplicationException("You have already applied to this job posting");
        }

        Application application = Application.builder()
                .student(student)
                .posting(posting)
                .status(ApplicationStatus.APPLIED)
                .build();

        Application saved = applicationRepository.save(application);
        return mapToApplicationDto(saved);
    }

    public List<ApplicationDto> getOwnApplications(Long userId) {
        StudentProfile student = studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        return applicationRepository.findByStudentId(student.getId())
                .stream()
                .map(this::mapToApplicationDto)
                .collect(Collectors.toList());
    }

    private StudentProfileDto mapToDto(StudentProfile profile) {
        StudentProfileDto dto = new StudentProfileDto();
        dto.setId(profile.getId());
        dto.setBranch(profile.getBranch());
        dto.setGpa(profile.getGpa());
        dto.setGradYear(profile.getGradYear());
        dto.setResumeUrl(profile.getResumeUrl());
        return dto;
    }

    private PostingDto mapToPostingDto(Posting posting) {
        PostingDto dto = new PostingDto();
        dto.setId(posting.getId());
        dto.setCompanyId(posting.getCompany().getId());
        dto.setCompanyName(posting.getCompany().getCompanyName());
        dto.setTitle(posting.getTitle());
        dto.setDescription(posting.getDescription());
        dto.setEligibility(posting.getEligibility());
        dto.setMinGpa(posting.getMinGpa());
        dto.setDeadline(posting.getDeadline());
        dto.setStatus(posting.getStatus());
        dto.setCreatedAt(posting.getCreatedAt());
        if (posting.getReviewedBy() != null) {
            dto.setReviewedById(posting.getReviewedBy().getId());
            dto.setReviewedByName(posting.getReviewedBy().getName());
        }
        dto.setReviewedAt(posting.getReviewedAt());
        return dto;
    }

    private ApplicationDto mapToApplicationDto(Application app) {
        ApplicationDto dto = new ApplicationDto();
        dto.setId(app.getId());
        dto.setStudentId(app.getStudent().getId());
        dto.setStudentName(app.getStudent().getUser().getName());
        dto.setPostingId(app.getPosting().getId());
        dto.setPostingTitle(app.getPosting().getTitle());
        dto.setCompanyName(app.getPosting().getCompany().getCompanyName());
        dto.setStatus(app.getStatus());
        dto.setAppliedAt(app.getAppliedAt());
        return dto;
    }
}
