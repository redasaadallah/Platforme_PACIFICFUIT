package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class DemandeCompletDTO {

    // ===================== Getters =====================
    // ===================== Setters =====================
    @Getter
    @Setter
    private String type; // "Reservation" ou "Prolongement"

    // Produit
    @Setter
    private String codeProduit;

    private Long idProlongement;
    @Getter
    @Setter
    private String nomProduit;
    @Setter
    private Double prixProduit;
    @Setter
    private Double quantiteProduit;
    @Setter
    private double temperatureStockage;
    @Setter
    private String statutProduit;
    @Setter
    private LocalDate dateDebutStockage;
    @Setter
    private LocalDate dateFinStockage;
    @Setter
    private int dureeStockage;

    // Chambre
    @Setter
    private String nomChambre;

    // Document
    @Getter
    @Setter
    private Long idDocument;
    @Setter
    private String facture;
    @Setter
    private String onssa;
    @Setter
    private String rc;

    // Client
    @Setter
    private String cinClient;
    @Getter
    @Setter
    private String nomClient;
    @Setter
    private String emailClient;
    @Setter
    private String telephoneClient;

    @Getter
    @Setter
    private LocalDateTime dateDemande;
    @Getter
    @Setter
    private Double capaciteDisponible;
    public DemandeCompletDTO() {

    }

    public String getCodeProduit() { return this.codeProduit; }

    public Double getPrixProduit() { return this.prixProduit; }
    public Double getQuantiteProduit() { return this.quantiteProduit; }
    public double getTemperatureStockage() { return this.temperatureStockage; }
    public String getStatutProduit() { return this.statutProduit; }

    public int getDureeStockage() {
        return this.dureeStockage;
    }

    public LocalDate getDateDebutStockage() {
        return this.dateDebutStockage;
    }

    public LocalDate getDateFinStockage() {
        return this.dateFinStockage;
    }

    public String getNomChambre() { return this.nomChambre; }

    public String getFacture() { return this.facture; }
    public String getOnssa() { return this.onssa; }
    public String getRc() { return this.rc; }

    public String getCinClient() { return this.cinClient; }

    public String getEmailClient() { return this.emailClient; }
    public String getTelephoneClient() { return this.telephoneClient; }

    public Long getIdProlongement() {
        return idProlongement;
    }

    public void setIdProlongement(Long idProlongement) {
        this.idProlongement = idProlongement;
    }

    public void setCapaciteDisponible(double capaciteDisponible) {
        this.capaciteDisponible=capaciteDisponible;
    }
    public Double getCapaciteDisponible() {
        return capaciteDisponible;
    }
}
