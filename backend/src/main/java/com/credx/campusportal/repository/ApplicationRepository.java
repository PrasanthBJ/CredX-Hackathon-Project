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

    @org.springframework.data.jpa.repository.Query(
        "SELECT c.companyName, COUNT(a.id) FROM Application a JOIN a.posting p JOIN p.company c GROUP BY c.companyName"
    )
    List<Object[]> countApplicationsPerCompany();
}
