package com.example.demo.service;


import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;


@Service
public class JwtService {


    private final String SECRET_KEY =
            "mySecretKeyMySecretKeyMySecretKey123456789";


    // Access Token validity: 15 minutes
    private final long ACCESS_TOKEN_EXPIRATION =
            1000 * 60 * 15;



    // =========================================
    // Generate JWT Token
    // =========================================

    public String generateToken(
            String userId,
            String type
    ) {


        return Jwts.builder()

                // Client CIN or Admin ID
                .setSubject(userId)


                // CLIENT or ADMIN
                .claim("type", type)


                // Creation date
                .setIssuedAt(new Date())


                // Expiration date
                .setExpiration(
                        new Date(
                                System.currentTimeMillis()
                                        +
                                        ACCESS_TOKEN_EXPIRATION
                        )
                )


                // Signature
                .signWith(
                        getSignKey(),
                        SignatureAlgorithm.HS256
                )


                .compact();
    }





    // =========================================
    // Extract User ID
    // =========================================

    public String extractUserId(
            String token
    ) {

        return getClaims(token)
                .getSubject();

    }





    // =========================================
    // Extract User Type
    // =========================================

    public String extractUserType(
            String token
    ) {

        return getClaims(token)
                .get("type", String.class);

    }





    // =========================================
    // Validate JWT Token
    // =========================================

    public boolean isValid(
            String token
    ) {


        try {

            getClaims(token);

            return true;


        } catch (JwtException | IllegalArgumentException e) {

            return false;

        }

    }





    // =========================================
    // Get Claims
    // =========================================

    private Claims getClaims(
            String token
    ) {


        return Jwts.parserBuilder()

                .setSigningKey(
                        getSignKey()
                )

                .build()

                .parseClaimsJws(token)

                .getBody();

    }





    // =========================================
    // Generate Secret Key
    // =========================================

    private Key getSignKey() {


        return Keys.hmacShaKeyFor(
                SECRET_KEY.getBytes()
        );

    }

}