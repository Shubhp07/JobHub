package com.jobhub.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum UserType {
    JOBSEEKER,
    EMPLOYER,
    ADMIN;

    // Deserialize JSON string (case-insensitive) to enum
    @JsonCreator
    public static UserType fromString(String key) {
        if (key == null) return null;
        return UserType.valueOf(key.trim().toUpperCase());
    }

    // Serialize enum to lowercase string in JSON
    @JsonValue
    public String toValue() {
        return this.name().toLowerCase();
    }
}
