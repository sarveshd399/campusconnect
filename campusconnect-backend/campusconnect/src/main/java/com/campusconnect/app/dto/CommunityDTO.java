package com.campusconnect.app.dto;

import com.campusconnect.app.entity.CommunityType;
import lombok.Data;

@Data
public class CommunityDTO {
    private Long id;
    private String name;
    private CommunityType type;
    private String description;
    private int memberCount;
    private boolean joined;
}
