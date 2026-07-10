package com.example.demo.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatistiquesDTO {

    // ===================== TOTAL =====================
    private long totalDemandes;

    // ===================== RESERVATIONS =====================
    private long reservations;
    private long reservationsAccepted;
    private long reservationsRefused;

    // % reservations (accepted / total reservations)
    private double pctReservationsAccepted;
    private double pctReservationsRefused;

    // ===================== PROLONGATIONS =====================
    private long prolongations;
    private long prolongationsAccepted;
    private long prolongationsRefused;

    // % prolongations (accepted / total prolongations)
    private double pctProlongationsAccepted;
    private double pctProlongationsRefused;

    // ===================== GLOBAL PERCENTAGES =====================
    private double pctTotalAccepted;
    private double pctTotalRefused;
}