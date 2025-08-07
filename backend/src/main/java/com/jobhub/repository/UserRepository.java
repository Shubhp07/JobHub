package com.jobhub.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jobhub.entity.User;
import com.jobhub.entity.UserType;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    Page<User> findByUserType(UserType userType, Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.userType = :userType AND u.isActive = true")
    Page<User> findActiveUsersByType(@Param("userType")UserType userType, Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.userType = 'JOBSEEKER' AND " +
           "(LOWER(u.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.location) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<User> searchJobSeekers(@Param("keyword") String keyword, Pageable pageable);
}