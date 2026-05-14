package com.campusconnect.app.controller;

import com.campusconnect.app.entity.User;
import com.campusconnect.app.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow();

        ProfileResponse profile = new ProfileResponse();
        profile.setId(user.getId());
        profile.setName(user.getName());
        profile.setEmail(user.getEmail());
        profile.setCity(user.getCity());
        profile.setCommunitiesJoined(user.getCommunities().size());

        return ResponseEntity.ok(profile);
    }

    @Data
    public static class ProfileResponse {
        private Long id;
        private String name;
        private String email;
        private String city;
        private int communitiesJoined;
    }
}
