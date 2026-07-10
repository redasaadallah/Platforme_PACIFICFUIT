package com.example.demo.dto;

import com.example.demo.entity.Prolongement;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class ProduitDTO {

    private String idProduit;
    private String nomProduit;
    private Double quantite;
    private Double prix;
    private double temperatureStockage;
    private LocalDate dateDebutStockage;
    private LocalDate dateFinStockage;
    private int dureeStockage;
    private LocalDateTime dateDemande;
    private String statut;

    // URLs des documents
    private String factureUrl;
    private String onssaUrl;
    private String rcUrl;

    // Infos sur le client
    private String clientCin;
    private String clientNom;
    private String clientEmail;
    private String clientTelephone;

    // Infos sur la chambre
    private String chambreNom;
    private double chambreCapacite;
    private double chambreCapaciteDisponible;
    private double chambreTemperature;
    private boolean chambreVisible;
    private List<ProlongementDTO> prolongements;
    public ProduitDTO(String idProduit, String nomProduit, Double quantite, Double prix,
                      double temperatureStockage, LocalDate dateDebutStockage,LocalDate dateFinStockage, int dureeStockage,
                      LocalDateTime dateDemande, String statut, String factureUrl, String onssaUrl, String rcUrl,
                      String clientCin, String clientNom,String clientEmail, String clientTelephone,
                      String chambreNom, double chambreCapacite, double chambreCapaciteDisponible,
                      double chambreTemperature, boolean chambreVisible) {

        this.idProduit = idProduit;
        this.nomProduit = nomProduit;
        this.quantite = quantite;
        this.prix = prix;
        this.temperatureStockage = temperatureStockage;
        this.dateDebutStockage = dateDebutStockage;
        this.dateFinStockage = dateFinStockage;
        this.dureeStockage = dureeStockage;
        this.dateDemande = dateDemande;
        this.statut = statut;

        this.factureUrl = factureUrl;
        this.onssaUrl = onssaUrl;
        this.rcUrl = rcUrl;

        this.clientCin = clientCin;
        this.clientNom = clientNom;
        this.clientEmail = clientEmail;
        this.clientTelephone = clientTelephone;

        this.chambreNom = chambreNom;
        this.chambreCapacite = chambreCapacite;
        this.chambreCapaciteDisponible = chambreCapaciteDisponible;
        this.chambreTemperature = chambreTemperature;
        this.chambreVisible = chambreVisible;

    }

    // GETTERS
    public String getIdProduit() { return idProduit; }
    public String getNomProduit() { return nomProduit; }
    public Double getQuantite() { return quantite; }
    public Double getPrix() { return prix; }
    public double getTemperatureStockage() { return temperatureStockage; }
    public LocalDate getDateDebutStockage() { return dateDebutStockage; }
    public LocalDate getDateFinStockage() { return dateFinStockage; }
    public int getDureeStockage() { return dureeStockage; }
    public LocalDateTime getDateDemande() { return dateDemande; }
    public String getStatut() { return statut; }
    public String getFactureUrl() { return factureUrl; }
    public String getOnssaUrl() { return onssaUrl; }
    public String getRcUrl() { return rcUrl; }
    public String getClientCin() { return clientCin; }
    public String getClientNom() { return clientNom; }
    public String getClientEmail() { return clientEmail; }
    public String getClientTelephone() { return clientTelephone; }
    public String getChambreNom() { return chambreNom; }
    public double getChambreCapacite() { return chambreCapacite; }
    public double getChambreCapaciteDisponible() { return chambreCapaciteDisponible; }
    public double getChambreTemperature() { return chambreTemperature; }
    public boolean isChambreVisible() { return chambreVisible; }



    public List<ProlongementDTO> getProlongements() {
        return prolongements;
    }

    public void setProlongements(List<ProlongementDTO> prolongementDTOs) {
        this.prolongements = prolongementDTOs;
    }

}