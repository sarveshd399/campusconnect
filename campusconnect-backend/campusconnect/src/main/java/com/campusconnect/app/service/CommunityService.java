package com.campusconnect.app.service;

import com.campusconnect.app.dto.CommunityDTO;
import com.campusconnect.app.dto.CreateCommunityRequest;
import com.campusconnect.app.entity.Community;
import com.campusconnect.app.entity.CommunityType;
import com.campusconnect.app.entity.User;
import com.campusconnect.app.repository.CommunityRepository;
import com.campusconnect.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommunityService {

    private final CommunityRepository communityRepository;
    private final UserRepository userRepository;

    public List<CommunityDTO> searchCommunities(String query, String type, String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        List<Community> communities;

        if (type != null && !type.isEmpty()) {
            CommunityType communityType = CommunityType.valueOf(type.toUpperCase());
            if (query != null && !query.isEmpty()) {
                communities = communityRepository.findByNameContainingIgnoreCaseAndType(query, communityType);
            } else {
                communities = communityRepository.findByType(communityType);
            }
        } else if (query != null && !query.isEmpty()) {
            communities = communityRepository.findByNameContainingIgnoreCase(query);
        } else {
            communities = communityRepository.findAll();
        }

        return communities.stream().map(c -> toDTO(c, user)).toList();
    }

    public List<CommunityDTO> getMyCommunitites(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        return user.getCommunities().stream().map(c -> toDTO(c, user)).toList();
    }

    // ── Create a new community ───────────────────────────────────────────────
    @Transactional
    public CommunityDTO createCommunity(CreateCommunityRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow();

        // Check if community with same name and type already exists
        List<Community> existing = communityRepository
                .findByNameContainingIgnoreCaseAndType(request.getName(), request.getType());

        if (!existing.isEmpty()) {
            throw new RuntimeException("A community with this name already exists");
        }

        Community community = Community.builder()
                .name(request.getName())
                .type(request.getType())
                .description(request.getDescription())
                .build();

        // Auto-join the creator
        community.getMembers().add(user);
        Community saved = communityRepository.save(community);

        return toDTO(saved, user);
    }

    @Transactional
    public CommunityDTO joinCommunity(Long communityId, String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new RuntimeException("Community not found"));

        if (!community.getMembers().contains(user)) {
            community.getMembers().add(user);
            communityRepository.save(community);
        }

        return toDTO(community, user);
    }

    @Transactional
    public CommunityDTO leaveCommunity(Long communityId, String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new RuntimeException("Community not found"));

        community.getMembers().remove(user);
        communityRepository.save(community);

        return toDTO(community, user);
    }

    public CommunityDTO getCommunityById(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        Community community = communityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Community not found"));
        return toDTO(community, user);
    }

    private CommunityDTO toDTO(Community community, User user) {
        CommunityDTO dto = new CommunityDTO();
        dto.setId(community.getId());
        dto.setName(community.getName());
        dto.setType(community.getType());
        dto.setDescription(community.getDescription());
        dto.setMemberCount(community.getMembers().size());
        dto.setJoined(community.getMembers().contains(user));
        return dto;
    }
}
