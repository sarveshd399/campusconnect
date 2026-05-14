package com.campusconnect.app.controller;

import com.campusconnect.app.dto.MessageDTO;
import com.campusconnect.app.service.ChatService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    // ── GET old messages when user opens chat ────────────────────────────────
    @GetMapping("/api/communities/{communityId}/messages")
    public ResponseEntity<List<MessageDTO>> getMessages(
            @PathVariable Long communityId) {
        return ResponseEntity.ok(chatService.getMessages(communityId));
    }

    // ── POST a new message via REST (auth works reliably via JWT) ────────────
    // After saving, broadcast to WebSocket so everyone receives it live
    @PostMapping("/api/communities/{communityId}/messages")
    public ResponseEntity<MessageDTO> sendMessage(
            @PathVariable Long communityId,
            @RequestBody SendMessageRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        // 1. Save message to database
        MessageDTO saved = chatService.sendMessage(
                communityId, request.getContent(), userDetails.getUsername());

        // 2. Broadcast to all WebSocket subscribers of this community
        messagingTemplate.convertAndSend(
                "/topic/community/" + communityId, saved);

        return ResponseEntity.ok(saved);
    }

    @Data
    public static class SendMessageRequest {
        private String content;
    }
}
