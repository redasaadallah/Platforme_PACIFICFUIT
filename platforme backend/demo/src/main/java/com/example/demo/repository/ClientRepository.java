package com.example.demo.repository;

import com.example.demo.entity.Admin;
import com.example.demo.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, String> {
    // Vérifie si un mot de passe existe déjà pour un client
    boolean existsByMotDePasse(String motDePasse);
    Optional<Client> findByEmail(String email);
    Optional<Client> findByTelephone(String telephone);

}
