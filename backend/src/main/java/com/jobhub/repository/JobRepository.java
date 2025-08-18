package com.jobhub.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jobhub.entity.Job;
import com.jobhub.entity.User;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    Page<Job> findByStatus(Job.JobStatus status, Pageable pageable);

    @Query("SELECT j FROM Job j WHERE LOWER(j.title) = LOWER(:title) AND LOWER(j.location) = LOWER(:location) AND j.employer = :employer")
    List<Job> findByTitleIgnoreCaseAndLocationIgnoreCaseAndEmployer(
        @Param("title") String title,
        @Param("location") String location,
        @Param("employer") User employer);

    Page<Job> findByEmployer(User employer, Pageable pageable);

    @Query("SELECT COUNT(j) FROM Job j WHERE j.employer.id = :employerId AND j.status = :status")
    int countByEmployer_IdAndStatus(@Param("employerId") Long employerId, @Param("status") Job.JobStatus status);

    @Query("SELECT j FROM Job j WHERE j.status = 'ACTIVE' AND "
            + "(LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
            + "LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
            + "LOWER(j.company) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Job> searchActiveJobs(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT j FROM Job j WHERE j.status = 'ACTIVE' AND "
            + "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND "
            + "(:jobType IS NULL OR j.jobType = :jobType) AND "
            + "(:experienceLevel IS NULL OR j.experienceLevel = :experienceLevel) AND "
            + "(:minSalary IS NULL OR j.salaryMin >= :minSalary) AND "
            + "(:maxSalary IS NULL OR j.salaryMax <= :maxSalary)")
    Page<Job> findJobsWithFilters(
        @Param("location") String location,
        @Param("jobType") Job.JobType jobType,
        @Param("experienceLevel") Job.ExperienceLevel experienceLevel,
        @Param("minSalary") BigDecimal minSalary,
        @Param("maxSalary") BigDecimal maxSalary,
        Pageable pageable);

    @Query("SELECT j FROM Job j WHERE j.status = 'ACTIVE' AND j.applicationDeadline > :now")
    Page<Job> findActiveJobsWithValidDeadline(@Param("now") LocalDateTime now, Pageable pageable);

    @Query("SELECT j FROM Job j JOIN j.requiredSkills js JOIN js.skill s WHERE s.name IN :skillNames AND j.status = 'ACTIVE'")
    Page<Job> findJobsBySkills(@Param("skillNames") List<String> skillNames, Pageable pageable);

}
