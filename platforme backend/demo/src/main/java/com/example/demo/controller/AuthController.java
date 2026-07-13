package com.example.demo.controller;

import com.example.demo.entity.RefreshToken;
import com.example.demo.repository.RefreshTokenRepository;
import com.example.demo.service.JwtService;
import com.example.demo.service.RefreshTokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {


    private final RefreshTokenService refreshTokenService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;


    public AuthController(
            RefreshTokenService refreshTokenService,
            RefreshTokenRepository refreshTokenRepository,
            JwtService jwtService
    ){
        this.refreshTokenService = refreshTokenService;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtService = jwtService;
    }



    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(
            @RequestBody Map<String,String> request
    ){


        String refreshToken =
                request.get("refreshToken");



        // Find token in database
        RefreshToken token =
                refreshTokenService.findByToken(refreshToken);



        // Check expiration
        refreshTokenService.verifyExpiration(token);



        // Generate new access token

        String newAccessToken =
                jwtService.generateToken(
                        token.getUserId(),
                        token.getUserType()
                );



        return ResponseEntity.ok(
                Map.of(
                        "accessToken",
                        newAccessToken
                )
        );

    }

}
