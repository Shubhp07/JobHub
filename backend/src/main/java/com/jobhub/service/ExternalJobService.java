// src/main/java/com/jobhub/service/ExternalJobService.java
package com.jobhub.service;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.jobhub.dto.job.ExternalJobDto;

@Service
public class ExternalJobService {
    
    private static final String RAPIDAPI_KEY = "db95f16959msh52440b766c47f99p1095e2jsn24cb182eb255";
    private static final String RAPIDAPI_HOST = "active-jobs-db.p.rapidapi.com";
    private static final String RAPIDAPI_URL = "https://active-jobs-db.p.rapidapi.com/active-ats-6m?description_type=text";
    
    private final RestTemplate restTemplate;
    
    public ExternalJobService() {
        this.restTemplate = new RestTemplate();
    }
    
    public List<ExternalJobDto> fetchExternalJobs() {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-RapidAPI-Key", RAPIDAPI_KEY);
            headers.set("X-RapidAPI-Host", RAPIDAPI_HOST);
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<ExternalJobDto[]> response = restTemplate.exchange(
                RAPIDAPI_URL, 
                HttpMethod.GET, 
                entity, 
                ExternalJobDto[].class
            );
            
            if (response.getBody() != null) {
                return Arrays.asList(response.getBody());
            } else {
                System.err.println("Received null response body from external API");
                return new ArrayList<>();
            }
            
        } catch (Exception e) {
            System.err.println("Error fetching external jobs: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
}
