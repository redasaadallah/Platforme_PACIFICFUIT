package com.example.demo.service;


import com.example.demo.entity.RefreshToken;
import com.example.demo.repository.RefreshTokenRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.UUID;



@Service
public class RefreshTokenService {



    private final RefreshTokenRepository repository;



    public RefreshTokenService(
            RefreshTokenRepository repository
    ){

        this.repository = repository;

    }




    // =================================
    // Create Refresh Token
    // =================================

    public RefreshToken createRefreshToken(
            String userId,
            String userType
    ){


        RefreshToken refreshToken =
                new RefreshToken();



        refreshToken.setToken(
                UUID.randomUUID().toString()
        );



        refreshToken.setUserId(userId);



        refreshToken.setUserType(userType);



        // 30 jours

        refreshToken.setExpiryDate(
                new Date(
                        System.currentTimeMillis()
                                +
                                1000L * 60 * 60 * 24 * 30
                )
        );



        return repository.save(refreshToken);

    }




    // =================================
    // Find token
    // =================================

    public RefreshToken findByToken(
            String token
    ){


        return repository
                .findByToken(token)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Refresh Token not found"
                        )
                );

    }





    // =================================
    // Verify expiration
    // =================================

    public RefreshToken verifyExpiration(
            RefreshToken refreshToken
    ){


        if(refreshToken
                .getExpiryDate()
                .before(new Date())){


            repository.delete(refreshToken);


            throw new RuntimeException(
                    "Refresh Token expired"
            );

        }



        return refreshToken;

    }




    // =================================
    // Delete old token
    // =================================
    @Transactional
    public void deleteOldToken(
            String userId,
            String userType
    ){

        repository.deleteByUserIdAndUserType(
                userId,
                userType
        );

    }

}