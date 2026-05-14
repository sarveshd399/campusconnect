package com.campusconnect.app.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MessageDTO {
    private Long id;
    private String content;
    private Long senderId;
    private String senderName;
    private Long communityId;
    private LocalDateTime timestamp;
}
