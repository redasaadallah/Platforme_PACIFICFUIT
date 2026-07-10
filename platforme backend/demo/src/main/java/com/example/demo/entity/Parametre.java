package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Parametre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idParametre;

    private double prixReservation;
    private double prixPrelangemant;

    private int dureeMinReservation;
    private int dureeMaxReservation;

    private int dureeMinProlongement;
    private int dureeMaxProlongement;

    private int delaiMaxEntreDemandeEtDebut;
    private int delaiProlongement;

    private int quantiteMinProduit;
    private int quantiteMaxProduit;

    // Constructors
    public Parametre() {
    }

    public Parametre(double prixReservation, double prixPrelangemant,
                     int dureeMinReservation, int dureeMaxReservation,
                     int dureeMinProlongement, int dureeMaxProlongement,
                     int delaiMaxEntreDemandeEtDebut, int delaiProlongement,
                     int quantiteMinProduit, int quantiteMaxProduit) {
        this.prixReservation = prixReservation;
        this.prixPrelangemant = prixPrelangemant;
        this.dureeMinReservation = dureeMinReservation;
        this.dureeMaxReservation = dureeMaxReservation;
        this.dureeMinProlongement = dureeMinProlongement;
        this.dureeMaxProlongement = dureeMaxProlongement;
        this.delaiMaxEntreDemandeEtDebut = delaiMaxEntreDemandeEtDebut;
        this.delaiProlongement = delaiProlongement;
        this.quantiteMinProduit = quantiteMinProduit;
        this.quantiteMaxProduit = quantiteMaxProduit;
    }

    // Getters & Setters
    public Long getIdParametre() { return idParametre; }
    public void setIdParametre(Long idParametre) { this.idParametre = idParametre; }

    public double getPrixReservation() { return prixReservation; }
    public void setPrixReservation(double prixReservation) { this.prixReservation = prixReservation; }

    public double getPrixPrelangemant() { return prixPrelangemant; }
    public void setPrixPrelangemant(double prixPrelangemant) { this.prixPrelangemant = prixPrelangemant; }

    public int getDureeMinReservation() { return dureeMinReservation; }
    public void setDureeMinReservation(int dureeMinReservation) { this.dureeMinReservation = dureeMinReservation; }

    public int getDureeMaxReservation() { return dureeMaxReservation; }
    public void setDureeMaxReservation(int dureeMaxReservation) { this.dureeMaxReservation = dureeMaxReservation; }

    public int getDureeMinProlongement() { return dureeMinProlongement; }
    public void setDureeMinProlongement(int dureeMinProlongement) { this.dureeMinProlongement = dureeMinProlongement; }

    public int getDureeMaxProlongement() { return dureeMaxProlongement; }
    public void setDureeMaxProlongement(int dureeMaxProlongement) { this.dureeMaxProlongement = dureeMaxProlongement; }

    public int getDelaiMaxEntreDemandeEtDebut() { return delaiMaxEntreDemandeEtDebut; }
    public void setDelaiMaxEntreDemandeEtDebut(int delaiMaxEntreDemandeEtDebut) { this.delaiMaxEntreDemandeEtDebut = delaiMaxEntreDemandeEtDebut; }

    public int getQuantiteMinProduit() { return quantiteMinProduit; }
    public void setQuantiteMinProduit(int quantiteMinProduit) { this.quantiteMinProduit = quantiteMinProduit; }

    public int getQuantiteMaxProduit() { return quantiteMaxProduit; }
    public void setQuantiteMaxProduit(int quantiteMaxProduit) { this.quantiteMaxProduit = quantiteMaxProduit; }

    public int getDelaiProlongement() {
        return this.delaiProlongement;
    }
    public void setDelaiProlongement(int delaiProlongement) {
        this.delaiProlongement = delaiProlongement;
    }
}