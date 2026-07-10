package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChambreStatsDTO {

    private double capaciteTotale;
    private double capaciteDisponible;
    private double capaciteOccupee;
    private double tauxDisponible;
    private double tauxOccupee;
}