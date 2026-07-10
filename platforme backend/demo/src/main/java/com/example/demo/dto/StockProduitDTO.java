package com.example.demo.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockProduitDTO {

    private int rang;
    private String produit;
    private double quantite;
    private double pourcentage;

    // getters + setters
}
