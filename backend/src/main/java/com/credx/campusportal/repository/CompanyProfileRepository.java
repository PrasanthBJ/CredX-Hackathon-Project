package com.credx.campusportal.repository;

import com.credx.campusportal.entity.CompanyProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CompanyProfileRepository extends JpaRepository<CompanyProfile, Long> {
    Optional<CompanyProfile> findByUserId(Long userId);
}
