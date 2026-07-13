// src/main/java/com/jobhub/service/ExternalJobService.java
package com.jobhub.job;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import org.springframework.beans.factory.annotation.Value;

import com.jobhub.job.dto.ExternalJobDto;

@Service
public class ExternalJobService {
    
    @Value("${app.rapidapi.key}")
    private String rapidApiKey;

    @Value("${app.rapidapi.host}")
    private String rapidApiHost;

    @Value("${app.rapidapi.url}")
    private String rapidApiUrl;
    
    private final RestTemplate restTemplate;
    
    public ExternalJobService() {
        this.restTemplate = new RestTemplate();
    }
    
    public List<ExternalJobDto> fetchExternalJobs() {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-RapidAPI-Key", rapidApiKey);
            headers.set("X-RapidAPI-Host", rapidApiHost);
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<ExternalJobDto[]> response = restTemplate.exchange(
                rapidApiUrl, 
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
