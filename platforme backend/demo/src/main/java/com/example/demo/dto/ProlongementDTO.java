package com.example.demo.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ProlongementDTO {

    private Long id; // identifiant du prolongement
    private LocalDateTime dateDemande; // date et heure de la demande
    private LocalDate nouvelleDateFinDemandee; // nouvelle date de fin souhaitée
    private int nbJoursAjoutes; // nombre de jours ajoutés
    private String statut; // "enAtente", "accepté", "refusé", etc.
    private LocalDate ancienneDateFin;
    private Double prix;

    // ===================== Getters =====================
    public Long getId() { return id; }
    public LocalDateTime getDateDemande() { return dateDemande; }
    public LocalDate getNouvelleDateFinDemandee() { return nouvelleDateFinDemandee; }
    public int getNbJoursAjoutes() { return nbJoursAjoutes; }
    public String getStatut() { return statut; }

    public LocalDate getAncienneDateFin() {
        return this.ancienneDateFin;
    }

    public Double getPrix() {
        return this.prix;
    }

    // ===================== Setters =====================
    public void setId(Long id) { this.id = id; }
    public void setDateDemande(LocalDateTime dateDemande) { this.dateDemande = dateDemande; }
    public void setNouvelleDateFinDemandee(LocalDate nouvelleDateFinDemandee) { this.nouvelleDateFinDemandee = nouvelleDateFinDemandee; }
    public void setNbJoursAjoutes(int nbJoursAjoutes) { this.nbJoursAjoutes = nbJoursAjoutes; }
    public void setStatut(String statut) { this.statut = statut; }

    public void setAncienneDateFin(LocalDate ancienneDateFin) {
        this.ancienneDateFin=ancienneDateFin;
    }

    public void setPrix(Double prixProlongement) {
        this.prix=prixProlongement;
    }
}