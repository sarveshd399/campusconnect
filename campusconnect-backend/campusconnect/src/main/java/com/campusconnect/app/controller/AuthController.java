// controller is the entry point of the application
package com.campusconnect.app.controller;

import com.campusconnect.app.dto.AuthDTO.*;
import com.campusconnect.app.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController //tells spring that it's controller class
@RequestMapping("/api/auth") // Directs the path
@RequiredArgsConstructor //no need to write constructors
public class AuthController {

    private final AuthService authService; //object of authService

    @PostMapping("/register") //postmapping path
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
