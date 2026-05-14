package com.campusconnect.app.dto;

import com.campusconnect.app.entity.CommunityType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateCommunityRequest {

    @NotBlank
    private String name;

    @NotNull
    private CommunityType type;   // CITY, COLLEGE, SCHOOL

    private String description;
}
