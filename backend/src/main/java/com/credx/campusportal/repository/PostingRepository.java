package com.credx.campusportal.repository;

import com.credx.campusportal.entity.Posting;
import com.credx.campusportal.entity.enums.PostingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostingRepository extends JpaRepository<Posting, Long> {
    List<Posting> findByStatus(PostingStatus status);
    List<Posting> findByCompanyId(Long companyId);
}
