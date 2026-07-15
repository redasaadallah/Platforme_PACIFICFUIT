package com.example.demo.repository;

import com.example.demo.entity.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VerificationCodeRepository
        extends JpaRepository<VerificationCode,Long> {


    VerificationCode
    findTopByTelephoneOrderByIdDesc(
            String telephone
    );

}
