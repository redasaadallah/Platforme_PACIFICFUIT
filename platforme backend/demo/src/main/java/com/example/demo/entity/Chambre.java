package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "chambre",
        uniqueConstraints = @UniqueConstraint(columnNames = "nomChambre"))
public class Chambre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String nomChambre;

    private double capacite;
    private double capaciteDisponible;
    private double temperature;
    private boolean visible;

    public Chambre() {
    }

    public Chambre(Long id, String nomChambre, double capacite,
                   double capaciteDisponible, double temperature,
                   boolean visible) {
        this.id = id;
        this.nomChambre = nomChambre;
        this.capacite = capacite;
        this.capaciteDisponible = capaciteDisponible;
        this.temperature = temperature;
        this.visible = visible;
    }

    // getters & setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomChambre() {
        return nomChambre;
    }

    public void setNomChambre(String nomChambre) {
        this.nomChambre = nomChambre;
    }

    public double getCapacite() {
        return capacite;
    }

    public void setCapacite(double capacite) {
        this.capacite = capacite;
    }

    public double getCapaciteDisponible() {
        return capaciteDisponible;
    }

    public void setCapaciteDisponible(double capaciteDisponible) {
        this.capaciteDisponible = capaciteDisponible;
    }

    public double getTemperature() {
        return temperature;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }

    public boolean isVisible() {
        return visible;
    }

    public void setVisible(boolean visible) {
        this.visible = visible;
    }
}