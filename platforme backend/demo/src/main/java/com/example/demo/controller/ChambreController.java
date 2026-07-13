package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.Chambre;
import com.example.demo.repository.ChambreRepository;

@RestController
@RequestMapping("/api/chambres")
@CrossOrigin("*")
public class ChambreController {

    @Autowired
    private ChambreRepository chambreRepository;
    @Autowired
    private SimpMessagingTemplate template;

    // Récupérer toutes les chambres
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Chambre> getAllChambres() {
        return chambreRepository.findAll();
    }
//======================================pour la demande des client
    @GetMapping("/visible")
    public List<Chambre> getAllVisibleChambres() {
        // Retourne uniquement les chambres visibles
        return chambreRepository.findByVisibleTrue();
    }

    // Récupérer une chambre par son id ==========================
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Chambre getChambreById(@PathVariable Long id) {
        return chambreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chambre introuvable"));
    }

    // Ajouter une chambre======================================
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Chambre> createChambre(@RequestBody Chambre chambre) {

        // 1. Save in database
        Chambre saved =chambreRepository.save(chambre);

        // 2. Notify all clients in real time
        template.convertAndSend("/topic/chambres", "chambre");

        return chambreRepository.findAll();
    }
    // Modifier une chambre
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Chambre updateChambre(@PathVariable Long id,
                                 @RequestBody Chambre chambreDetails) {

        Chambre chambre = chambreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chambre introuvable"));
        chambre.setNomChambre(chambreDetails.getNomChambre());
        chambre.setCapacite(chambreDetails.getCapacite());
        chambre.setCapaciteDisponible(chambreDetails.getCapaciteDisponible());
        chambre.setTemperature(chambreDetails.getTemperature());
        chambre.setVisible(chambreDetails.isVisible());
        template.convertAndSend("/topic/chambres", "chambre");

        return chambreRepository.save(chambre);
    }

    // Supprimer une chambre=======================================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String deleteChambre(@PathVariable Long id) {

        Chambre chambre = chambreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chambre introuvable"));

        chambreRepository.delete(chambre);
        template.convertAndSend("/topic/chambres", "chambre");

        return "Chambre supprimée avec succès";
    }
}