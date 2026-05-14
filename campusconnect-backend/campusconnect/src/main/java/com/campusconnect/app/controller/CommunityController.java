package com.campusconnect.app.controller;

import com.campusconnect.app.dto.CommunityDTO;
import com.campusconnect.app.dto.CreateCommunityRequest;
import com.campusconnect.app.service.CommunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/communities")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityService communityService;

    // GET /api/communities/search?query=gorakhpur&type=CITY
    @GetMapping("/search")
    public ResponseEntity<List<CommunityDTO>> search(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String type,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                communityService.searchCommunities(query, type, userDetails.getUsername()));
    }

    // GET /api/communities/mine
    @GetMapping("/mine")
    public ResponseEntity<List<CommunityDTO>> myCommunities(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                communityService.getMyCommunitites(userDetails.getUsername()));
    }

    // GET /api/communities/{id}
    @GetMapping("/{id}")
    public ResponseEntity<CommunityDTO> getCommunity(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                communityService.getCommunityById(id, userDetails.getUsername()));
    }

    // POST /api/communities — create a new community
    @PostMapping
    public ResponseEntity<CommunityDTO> createCommunity(
            @RequestBody CreateCommunityRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                communityService.createCommunity(request, userDetails.getUsername()));
    }

    // POST /api/communities/{id}/join
    @PostMapping("/{id}/join")
    public ResponseEntity<CommunityDTO> join(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                communityService.joinCommunity(id, userDetails.getUsername()));
    }

    // POST /api/communities/{id}/leave
    @PostMapping("/{id}/leave")
    public ResponseEntity<CommunityDTO> leave(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                communityService.leaveCommunity(id, userDetails.getUsername()));
    }
}
