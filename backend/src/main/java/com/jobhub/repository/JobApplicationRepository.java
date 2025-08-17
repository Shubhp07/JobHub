package com.jobhub.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jobhub.dto.job.ApplicantSummary;
import com.jobhub.entity.Job;
import com.jobhub.entity.JobApplication;
import com.jobhub.entity.User;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    @Query("SELECT ja FROM JobApplication ja JOIN FETCH ja.user JOIN FETCH ja.job WHERE ja.user = :user")
    Page<JobApplication> findByUser(@Param("user") User user, Pageable pageable);

    Page<JobApplication> findByStatus(JobApplication.ApplicationStatus status, Pageable pageable);

    Page<JobApplication> findByUserAndStatus(User user, JobApplication.ApplicationStatus status, Pageable pageable);

    Optional<JobApplication> findByUserAndJob(User user, Job job);

    boolean existsByUserAndJob(User user, Job job);

    @Query("SELECT ja FROM JobApplication ja JOIN FETCH ja.user JOIN FETCH ja.job WHERE ja.job.employer = :employer")
    Page<JobApplication> findApplicationsForEmployer(@Param("employer") User employer, Pageable pageable);

    @Query("SELECT ja FROM JobApplication ja JOIN FETCH ja.user JOIN FETCH ja.job WHERE ja.job.employer = :employer AND ja.status = :status")
    Page<JobApplication> findApplicationsForEmployerByStatus(
            @Param("employer") User employer,
            @Param("status") JobApplication.ApplicationStatus status,
            Pageable pageable
    );

    @Query("""
  SELECT 
    ja.user.id as userId,
    CONCAT(ja.user.firstName, ' ', ja.user.lastName) as userName,
    ja.user.email as userEmail,
    ja.user.resumeUrl as resumeUrl, 
    ja.id as applicationId
  FROM JobApplication ja
  WHERE ja.job = :job
""")
    List<ApplicantSummary> findApplicantsByJob(@Param("job") Job job);

    List<JobApplication> findByJob_Id(Long jobId);

    @Query("SELECT ja FROM JobApplication ja JOIN FETCH ja.user JOIN FETCH ja.job WHERE ja.job = :job AND ja.status = :status")
    Page<JobApplication> findByJobAndStatus(@Param("job") Job job, @Param("status") JobApplication.ApplicationStatus status, Pageable pageable);

    @Query("SELECT ja FROM JobApplication ja JOIN FETCH ja.user JOIN FETCH ja.job WHERE ja.job = :job")
    Page<JobApplication> findByJob(@Param("job") Job job, Pageable pageable);

    @Query("SELECT COUNT(ja) FROM JobApplication ja WHERE ja.user = :user")
    long countApplicationsByUser(@Param("user") User user);

    @Query("SELECT COUNT(ja) FROM JobApplication ja WHERE ja.job = :job")
    long countApplicationsByJob(@Param("job") Job job);
}
