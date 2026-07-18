package com.credx.campusportal.service;

import com.credx.campusportal.dto.company.CompanyProfileDto;
import com.credx.campusportal.dto.common.PostingDto;
import com.credx.campusportal.entity.CompanyProfile;
import com.credx.campusportal.entity.Posting;
import com.credx.campusportal.entity.enums.PostingStatus;
import com.credx.campusportal.exception.ResourceNotFoundException;
import com.credx.campusportal.repository.CompanyProfileRepository;
import com.credx.campusportal.repository.PostingRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final CompanyProfileRepository companyProfileRepository;
    private final PostingRepository postingRepository;

    public AdminService(CompanyProfileRepository companyProfileRepository,
                        PostingRepository postingRepository) {
        this.companyProfileRepository = companyProfileRepository;
        this.postingRepository = postingRepository;
    }

    public List<PostingDto> getPendingJobPostings() {
        return postingRepository.findByStatus(PostingStatus.PENDING)
                .stream()
                .map(this::mapToPostingDto)
                .collect(Collectors.toList());
    }

    public PostingDto approveOrRejectJobPosting(Long postingId, PostingStatus status) {
        Posting posting = postingRepository.findById(postingId)
                .orElseThrow(() -> new ResourceNotFoundException("Job posting not found"));

        posting.setStatus(status);
        Posting saved = postingRepository.save(posting);
        return mapToPostingDto(saved);
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
