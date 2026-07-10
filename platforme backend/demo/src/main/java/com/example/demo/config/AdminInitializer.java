package com.example.demo.config;

import com.example.demo.entity.Admin;
import com.example.demo.repository.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner initAdmin(AdminRepository adminRepository) {
        return args -> {

            // Vérifier si admin existe déjà
            if (adminRepository.count() == 0) {

                BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
                Admin admin = new Admin();
                admin.setEmail("redasaadallah77@gmail.com");
                admin.setMotDePasse(encoder.encode("reda2001"));

                adminRepository.save(admin);

                System.out.println("Admin créé avec succès !");
            }
        };
    }
}