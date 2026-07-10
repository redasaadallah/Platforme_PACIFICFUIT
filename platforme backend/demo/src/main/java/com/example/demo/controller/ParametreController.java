package com.example.demo.controller;

import com.example.demo.entity.Parametre;
import com.example.demo.repository.ParametreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/parametres")
public class ParametreController {

    @Autowired
    private ParametreRepository parametreRepository;

    // GET : tous les paramètres
    @GetMapping
    public List<Parametre> getAllParametres() {
        return parametreRepository.findAll();
    }

    // GET : un paramètre par id
    @GetMapping("/{id}")
    public ResponseEntity<Parametre> getParametreById(@PathVariable Long id) {
        Optional<Parametre> param = parametreRepository.findById(id);
        return param.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST : créer un nouveau paramètre
    @PostMapping
    public Parametre createParametre(@RequestBody Parametre parametre) {
        return parametreRepository.save(parametre);
    }

    // PUT : mettre à jour un paramètre existant
    @PutMapping("/{id}")
    public ResponseEntity<Parametre> updateParametre(@PathVariable Long id, @RequestBody Parametre updatedParam) {
        Optional<Parametre> optionalParam = parametreRepository.findById(id);
        if (!optionalParam.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Parametre param = optionalParam.get();
        param.setPrixReservation(updatedParam.getPrixReservation());
        param.setPrixPrelangemant(updatedParam.getPrixPrelangemant());
        param.setDureeMinReservation(updatedParam.getDureeMinReservation());
        param.setDureeMaxReservation(updatedParam.getDureeMaxReservation());
        param.setDureeMinProlongement(updatedParam.getDureeMinProlongement());
        param.setDureeMaxProlongement(updatedParam.getDureeMaxProlongement());
        param.setDelaiMaxEntreDemandeEtDebut(updatedParam.getDelaiMaxEntreDemandeEtDebut());
        param.setDelaiProlongement(updatedParam.getDelaiProlongement());
        param.setQuantiteMinProduit(updatedParam.getQuantiteMinProduit());
        param.setQuantiteMaxProduit(updatedParam.getQuantiteMaxProduit());

        parametreRepository.save(param);
        return ResponseEntity.ok(param);
    }

    // DELETE : supprimer un paramètre
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParametre(@PathVariable Long id) {
        if (!parametreRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        parametreRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}