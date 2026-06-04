package com.jobhub.job;

import com.jobhub.job.Job;
import com.jobhub.job.SavedJob;
import com.jobhub.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    Page<SavedJob> findByUser(User user, Pageable pageable);
    
    Optional<SavedJob> findByUserAndJob(User user, Job job);
    
    boolean existsByUserAndJob(User user, Job job);
    
    void deleteByUserAndJob(User user, Job job);
}