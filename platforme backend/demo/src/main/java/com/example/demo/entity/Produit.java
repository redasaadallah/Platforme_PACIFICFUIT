package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "produit")
public class Produit {

    @Id
    private String codeProduit; // code généré manuellement

    private String nom;

    private Double quantite;

    private Double prix;

    private double temperatureStockage;

    private LocalDate dateDebutStockage;

    private LocalDate dateFinStockage;

    private int dureeStockage;

    private LocalDateTime dateDemande;

    @ManyToOne
    @JoinColumn(name = "cin")
    private Client client;

    @ManyToOne
    @JoinColumn(name = "id")
    private Chambre chambre;

    @OneToOne(mappedBy = "produit", cascade = CascadeType.ALL)
    private Document document;

    private String statut;

    // Constructeur vide
    public Produit() {}

    // Getters & Setters
    public String getCodeProduit() {
        return codeProduit;
    }

    public void setCodeProduit(String codeProduit) {
        this.codeProduit = codeProduit;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Double getQuantite() {
        return quantite;
    }

    public void setQuantite(Double quantite) {
        this.quantite = quantite;
    }

    public Double getPrix() {
        return prix;
    }

    public void setPrix(Double prix) {
        this.prix = prix;
    }

    public double getTemperatureStockage() {
        return temperatureStockage;
    }

    public void setTemperatureStockage(double temperatureStockage) {
        this.temperatureStockage = temperatureStockage;
    }

    public LocalDate getDateDebutStockage() {
        return dateDebutStockage;
    }

    public void setDateDebutStockage(LocalDate dateDebutStockage) {
        this.dateDebutStockage = dateDebutStockage;
    }

    public LocalDate getDateFinStockage() {
        return dateFinStockage;
    }

    public void setDateFinStockage(LocalDate dateFinStockage) {
        this.dateFinStockage = dateFinStockage;
    }

    public int getDureeStockage() {
        return dureeStockage;
    }

    public void setDureeStockage(int dureeStockage) {
        this.dureeStockage = dureeStockage;
    }

    public LocalDateTime getDateDemande() {
        return dateDemande;
    }

    public void setDateDemande(LocalDateTime dateDemande) {
        this.dateDemande = dateDemande;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public Chambre getChambre() {
        return chambre;
    }

    public void setChambre(Chambre chambre) {
        this.chambre = chambre;
    }

    public Document getDocument() {
        return document;
    }

    public void setDocument(Document document) {
        this.document = document;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }
}