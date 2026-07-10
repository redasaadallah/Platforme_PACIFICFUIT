package com.example.demo.repository;

import com.example.demo.entity.Parametre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParametreRepository extends JpaRepository<Parametre, Long> {
    // Tu peux ajouter des méthodes personnalisées si besoin
}