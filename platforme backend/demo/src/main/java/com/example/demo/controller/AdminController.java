package com.example.demo.controller;

import com.example.demo.entity.Admin;
import com.example.demo.entity.RefreshToken;
import com.example.demo.repository.AdminRepository;
import com.example.demo.service.CodeGeneratorService;
import com.example.demo.service.EmailService;
import com.example.demo.service.JwtService;
import com.example.demo.service.RefreshTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private CodeGeneratorService codeGeneratorService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

//    @PostMapping("/login")
//    public Map<String, Object> login(@RequestBody Map<String, String> request) {
//
//        String email = request.get("email");
//        String password = request.get("motDePasse");
//
//        Map<String, Object> response = new HashMap<>();
//
//        Optional<Admin> optionalAdmin = adminRepository.findByEmail(email);
//
//        if (optionalAdmin.isPresent()) {
//            Admin admin = optionalAdmin.get();
//
//            if (encoder.matches(password, admin.getMotDePasse())) {
//                response.put("success", true);
//                response.put("message", "Login réussi");
//                response.put("admin", admin);
//            } else {
//                response.put("success", false);
//                response.put("message", "Mot de passe incorrect");
//            }
//
//        } else {
//            response.put("success", false);
//            response.put("message", "Email introuvable");
//        }
//
//        return response;
//    }
@PostMapping("/login")
public ResponseEntity<?> login(
        @RequestBody Map<String, String> request
) {


    String email = request.get("email");

    String password = request.get("motDePasse");



    Admin admin = adminRepository
            .findByEmail(email)
            .orElse(null);



    if(admin == null) {

        return ResponseEntity
                .ok(
                        Map.of(
                                "success", false,
                                "message", "Email ou mot de passe incorrect."
                        )
                );

    }



    // Verify password

    if(!encoder.matches(
            password,
            admin.getMotDePasse()
    )) {


        return ResponseEntity
                .ok(
                        Map.of(
                                "success", false,
                                "message",
                                "Email ou mot de passe incorrect."
                        )
                );

    }




    // ============================
    // Generate JWT Access Token
    // ============================

    String accessToken =
            jwtService.generateToken(
                    admin.getId().toString(),
                    "ADMIN"
            );




    // ============================
    refreshTokenService.deleteOldToken(
            admin.getId().toString(),
            "ADMIN"
    );
    // Generate Refresh Token
    // ============================

    RefreshToken refreshToken =
            refreshTokenService.createRefreshToken(
                    admin.getId().toString(),
                    "ADMIN"
            );




    // ============================
    // Response
    // ============================

    Map<String,Object> response =
            new HashMap<>();


    response.put(
            "success",
            true
    );


    response.put(
            "message",
            "Login réussi"
    );


    response.put(
            "accessToken",
            accessToken
    );


    response.put(
            "refreshToken",
            refreshToken.getToken()
    );


    response.put(
            "type",
            "ADMIN"
    );


    response.put(
            "admin",
            admin
    );



    return ResponseEntity.ok(response);

}
    @PostMapping("/change-password")
    public Map<String, Object> changePassword(@RequestBody Map<String, String> request) {

        Map<String, Object> response = new HashMap<>();

        String email = request.get("email");
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");

        Optional<Admin> optionalAdmin = adminRepository.findByEmail(email);

        if (optionalAdmin.isPresent()) {
            Admin admin = optionalAdmin.get();

            // Vérifier l'ancien mot de passe
            if (!passwordEncoder.matches(oldPassword, admin.getMotDePasse())) {
                response.put("status", "error");
                response.put("message", "L'ancien mot de passe n'est pas valide");
                return response;
            }

            // Encoder et sauvegarder le nouveau mot de passe
            admin.setMotDePasse(passwordEncoder.encode(newPassword));
            Admin updatedAdmin = adminRepository.save(admin);

            response.put("status", "success");
            response.put("message", "Mot de passe mis à jour avec succès !");
            response.put("admin", updatedAdmin); //Retour de l'admin mis à jour

        } else {
            response.put("status", "error");
            response.put("message", "Admin introuvable !");
        }

        return response;
    }
//    =========================================le mot de passe aublie
@PostMapping("/forgot-password")
public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {

    String email = request.get("email");

    if (email == null || email.trim().isEmpty()) {
        return ResponseEntity.ok(
                Map.of(
                        "success", false,
                        "message", "Veuillez saisir votre email."
                )
        );
    }

    Optional<Admin> optionalAdmin = adminRepository.findByEmail(email.trim());

    if (optionalAdmin.isEmpty()) {
        return ResponseEntity.ok(
                Map.of(
                        "success", false,
                        "message", "Aucun administrateur trouvé avec cet email."
                )
        );
    }

    Admin admin = optionalAdmin.get();

    String oldPassword = admin.getMotDePasse();

    String newPassword = codeGeneratorService.generateUniqueClientPassword();

    String hashedPassword = passwordEncoder.encode(newPassword);

    admin.setMotDePasse(hashedPassword);
    adminRepository.save(admin);

    try {
        emailService.sendNewPasswordEmail(admin.getEmail(), newPassword);
    } catch (MailException e) {

        // Restaure l'ancien mot de passe
        admin.setMotDePasse(oldPassword);
        adminRepository.save(admin);

        return ResponseEntity.ok(
                Map.of(
                        "success", false,
                        "message", "Erreur lors de l'envoi de l'email. Le mot de passe n'a pas été modifié."
                )
        );
    }

    // Succès
    return ResponseEntity.ok(
            Map.of(
                    "success", true,
                    "message", "Un nouveau mot de passe a été envoyé à votre email."
            )
    );
}
}