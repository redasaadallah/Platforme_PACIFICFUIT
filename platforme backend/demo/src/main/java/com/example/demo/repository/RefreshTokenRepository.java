package com.example.demo.repository;

import com.example.demo.entity.Client;
import com.example.demo.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository
        extends JpaRepository<RefreshToken, Long> {


    Optional<RefreshToken> findByToken(String token);


    @Modifying
    @Transactional
    void deleteByUserIdAndUserType(
            String userId,
            String userType
    );

}