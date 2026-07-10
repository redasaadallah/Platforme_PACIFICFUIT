package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "prolongement")
public class Prolongement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProlongement;

    @ManyToOne
    @JoinColumn(name = "produit_code", nullable = false)
    private Produit produit;

    private LocalDate ancienneDateFin;
    private LocalDate nouvelleDateFinDemandee;
    private Integer nbJoursAjoutes;
    private  Double prixProlongement;
    private String statut;


    private LocalDateTime dateDemande = LocalDateTime.now();


    // Constructeur vide
    public Prolongement() {}

    // Getters & Setters
    public Long getIdProlongement() { return idProlongement; }
    public void setIdProlongement(Long idProlongement) { this.idProlongement = idProlongement; }

    public Produit getProduit() { return produit; }
    public void setProduit(Produit produit) { this.produit = produit; }

    public LocalDate getAncienneDateFin() { return ancienneDateFin; }
    public void setAncienneDateFin(LocalDate ancienneDateFin) { this.ancienneDateFin = ancienneDateFin; }

    public LocalDate getNouvelleDateFinDemandee() { return nouvelleDateFinDemandee; }
    public void setNouvelleDateFinDemandee(LocalDate nouvelleDateFinDemandee) { this.nouvelleDateFinDemandee = nouvelleDateFinDemandee; }

    public Integer getNbJoursAjoutes() { return nbJoursAjoutes; }
    public void setNbJoursAjoutes(Integer nbJoursAjoutes) { this.nbJoursAjoutes = nbJoursAjoutes; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }



    public LocalDateTime getDateDemande() { return dateDemande; }
    public void setDateDemande(LocalDateTime dateDemande) { this.dateDemande = dateDemande; }


    public Double getPrixProlongement() {
        return prixProlongement;
    }

    public void setPrixProlongement(Double prixProlongement) {
        this.prixProlongement = prixProlongement;
    }


}