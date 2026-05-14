package com.campusconnect.app.service;

import com.campusconnect.app.dto.MessageDTO;
import com.campusconnect.app.entity.Community;
import com.campusconnect.app.entity.Message;
import com.campusconnect.app.entity.User;
import com.campusconnect.app.repository.CommunityRepository;
import com.campusconnect.app.repository.MessageRepository;
import com.campusconnect.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;

    public MessageDTO sendMessage(Long communityId, String content, String userEmail) {
        User sender = userRepository.findByEmail(userEmail).orElseThrow();
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new RuntimeException("Community not found"));

        Message message = Message.builder()
                .content(content)
                .sender(sender)
                .community(community)
                .build();

        Message saved = messageRepository.save(message);
        return toDTO(saved);
    }

    public List<MessageDTO> getMessages(Long communityId) {
        return messageRepository.findByCommunityIdOrderByTimestampAsc(communityId)
                .stream().map(this::toDTO).toList();
    }

    private MessageDTO toDTO(Message message) {
        MessageDTO dto = new MessageDTO();
        dto.setId(message.getId());
        dto.setContent(message.getContent());
        dto.setSenderId(message.getSender().getId());
        dto.setSenderName(message.getSender().getName());
        dto.setCommunityId(message.getCommunity().getId());
        dto.setTimestamp(message.getTimestamp());
        return dto;
    }
}
