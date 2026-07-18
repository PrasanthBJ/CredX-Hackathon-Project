package com.credx.campusportal.repository;

import com.credx.campusportal.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentId(Long studentId);
    List<Application> findByPostingId(Long postingId);
    boolean existsByStudentIdAndPostingId(Long studentId, Long postingId);
    long countByPostingCompanyId(Long companyId);
    long countByStatus(com.credx.campusportal.entity.enums.ApplicationStatus status);
}
