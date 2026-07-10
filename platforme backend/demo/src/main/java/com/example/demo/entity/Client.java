package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "client")
public class Client {

    @Id
    @Column(name = "cin", length = 50)
    private String cin;

    @Column(name = "nom", length = 100)
    private String nom;

    @Column(name = "email", length = 150)
    private String email;

    @Column(name = "telephone", length = 30)
    private String telephone;

    @Column(name = "mot_de_passe", length = 255)
    private String motDePasse;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Produit> produits;

    public Client() {
    }

    public Client(String cin, String nom, String email, String telephone, String motDePasse) {
        this.cin = cin;
        this.nom = nom;
        this.email = email;
        this.telephone = telephone;
        this.motDePasse = motDePasse;
    }

    public String getCin() {
        return cin;
    }

    public void setCin(String cin) {
        this.cin = cin;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getMotDePasse() {
        return motDePasse;
    }

    public void setMotDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
    }

    public List<Produit> getProduits() {
        return produits;
    }

    public void setProduits(List<Produit> produits) {
        this.produits = produits;
    }
}