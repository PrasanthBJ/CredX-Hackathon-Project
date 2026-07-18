package com.credx.campusportal.service;

import com.credx.campusportal.dto.company.CompanyProfileDto;
import com.credx.campusportal.dto.common.PostingDto;
import com.credx.campusportal.entity.CompanyProfile;
import com.credx.campusportal.entity.Posting;
import com.credx.campusportal.entity.User;
import com.credx.campusportal.entity.enums.PostingStatus;
import com.credx.campusportal.exception.ResourceNotFoundException;
import com.credx.campusportal.repository.CompanyProfileRepository;
import com.credx.campusportal.repository.PostingRepository;
import com.credx.campusportal.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompanyService {

    private final CompanyProfileRepository companyProfileRepository;
    private final PostingRepository postingRepository;
    private final UserRepository userRepository;

    public CompanyService(CompanyProfileRepository companyProfileRepository,
                          PostingRepository postingRepository,
                          UserRepository userRepository) {
        this.companyProfileRepository = companyProfileRepository;
        this.postingRepository = postingRepository;
        this.userRepository = userRepository;
    }

    public CompanyProfileDto createOrUpdateProfile(Long userId, CompanyProfileDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CompanyProfile profile = companyProfileRepository.findByUserId(userId)
                .orElse(new CompanyProfile());

        profile.setUser(user);
        profile.setCompanyName(dto.getCompanyName());
        profile.setDescription(dto.getDescription());
        profile.setWebsite(dto.getWebsite());

        CompanyProfile saved = companyProfileRepository.save(profile);
        return mapToDto(saved);
    }

    public CompanyProfileDto getProfileByUserId(Long userId) {
        CompanyProfile profile = companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));
        return mapToDto(profile);
    }

    public PostingDto createJobPosting(Long userId, PostingDto dto) {
        CompanyProfile company = companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Company profile must be created first"));

        Posting posting = Posting.builder()
                .company(company)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .eligibility(dto.getEligibility())
                .minGpa(dto.getMinGpa())
                .deadline(dto.getDeadline())
                .status(PostingStatus.PENDING)
                .build();

        Posting saved = postingRepository.save(posting);
        return mapToPostingDto(saved);
    }

    public List<PostingDto> getOwnJobPostings(Long userId) {
        CompanyProfile company = companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));

        return postingRepository.findByCompanyId(company.getId())
                .stream()
                .map(this::mapToPostingDto)
                .collect(Collectors.toList());
    }

    private CompanyProfileDto mapToDto(CompanyProfile profile) {
        CompanyProfileDto dto = new CompanyProfileDto();
        dto.setId(profile.getId());
        dto.setCompanyName(profile.getCompanyName());
        dto.setDescription(profile.getDescription());
        dto.setWebsite(profile.getWebsite());
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
}
