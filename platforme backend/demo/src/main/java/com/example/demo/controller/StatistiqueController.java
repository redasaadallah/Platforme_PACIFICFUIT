package com.example.demo.controller;

import com.example.demo.dto.ChambreStatsDTO;
import com.example.demo.dto.StatistiqueMensuelleDTO;
import com.example.demo.dto.StatistiquesDTO;
import com.example.demo.dto.StockProduitDTO;
import com.example.demo.entity.Chambre;
import com.example.demo.entity.Produit;
import com.example.demo.entity.Prolongement;
import com.example.demo.repository.ChambreRepository;
import com.example.demo.repository.ClientRepository;
import com.example.demo.repository.ProduitRepository;
import com.example.demo.repository.ProlongementRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/statistiques")
public class StatistiqueController {

    @Autowired
    private ChambreRepository chambreRepository;
    @Autowired
    private ClientRepository clientRepository;
    @Autowired
    private ProduitRepository produitRepository;
    @Autowired
    private ProlongementRepository prolongementRepository;
//===================pour le dashboard
@GetMapping("/dashboard/current-month/simple")
public ResponseEntity<Map<String, Object>> getSimpleStats() {

    LocalDate now = LocalDate.now();

    LocalDate start = now.withDayOfMonth(1);
    LocalDate end = now.withDayOfMonth(now.lengthOfMonth());

    // ================= DATA =================
    List<Produit> produits =
            produitRepository.findByDateDebutStockageBetween(start, end);

    List<Prolongement> prolongements =
            prolongementRepository.findByAncienneDateFinBetween(start, end);

    // ================= RESERVATIONS =================
    long reservations = produits.size();

    // ================= PROLONGATIONS =================
    long prolongations = prolongements.size();

    // ================= ACCEPTED (R + P) =================
    long acceptedReservations = produits.stream()
            .filter(p -> "accepted".equals(p.getStatut()) || "ended".equals(p.getStatut()))
            .count();

    long acceptedProlongations = prolongements.stream()
            .filter(p -> "accepted".equals(p.getStatut()) || "ended".equals(p.getStatut()))
            .count();

    long acceptedTotal = acceptedReservations + acceptedProlongations;

    // ================= REFUSED (R + P) =================
    long refusedReservations = produits.stream()
            .filter(p -> "refused".equals(p.getStatut()))
            .count();

    long refusedProlongations = prolongements.stream()
            .filter(p -> "refused".equals(p.getStatut()))
            .count();

    long refusedTotal = refusedReservations + refusedProlongations;

    // ================= RESPONSE =================
    Map<String, Object> response = new HashMap<>();

    response.put("reservations", reservations);         // 212 R ONLY
    response.put("prolongations", prolongations);       // 86 P ONLY

    response.put("accepted", acceptedTotal);            // 188 (R + P)
    response.put("refused", refusedTotal);              // 22 (R + P)

    return ResponseEntity.ok(response);
}
    @GetMapping("/chambres")
    public ChambreStatsDTO getChambreStats() {

        List<Chambre> chambres = chambreRepository.findAll();

        double capaciteTotale = 0;
        double capaciteDisponible = 0;

        // ✔ SUM capacities
        for (Chambre c : chambres) {
            capaciteTotale += c.getCapacite();
            capaciteDisponible += c.getCapaciteDisponible();
        }

        double capaciteOccupee = capaciteTotale - capaciteDisponible;

        // ✔ PERCENTAGES
        double tauxDisponible = 0;
        double tauxOccupee = 0;

        if (capaciteTotale > 0) {
            tauxDisponible = (capaciteDisponible / capaciteTotale) * 100;
            tauxOccupee = (capaciteOccupee / capaciteTotale) * 100;
        }

        return new ChambreStatsDTO(
                capaciteTotale,
                capaciteDisponible,
                capaciteOccupee,
                tauxDisponible,
                tauxOccupee
        );
    }
//===============envoyer les statistiques pour la section 2 de demande
//  GET STATISTICS BY MONTH
@GetMapping("/{year}/{month}")
public StatistiquesDTO getStatistics(@PathVariable int year,
                                     @PathVariable int month) {

    StatistiquesDTO dto = new StatistiquesDTO();

    //  define date range (full month)
    LocalDate startDate = LocalDate.of(year, month, 1);
    LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

    // ======================================================
    //  RESERVATIONS (PRODUITS)
    // ======================================================
    List<Produit> produits =
            produitRepository.findByDateDebutStockageBetween(startDate, endDate);

    long reservations = produits.size();

    long reservationsAccepted = produits.stream()
            .filter(p -> "accepted".equals(p.getStatut()) || "ended".equals(p.getStatut()))
            .count();

    long reservationsRefused = produits.stream()
            .filter(p -> "refused".equals(p.getStatut()))
            .count();

    // ======================================================
    //  PROLONGATIONS
    // ======================================================
    List<Prolongement> prolongements =
            prolongementRepository.findByAncienneDateFinBetween(startDate, endDate);

    long prolongations = prolongements.size();

    long prolongationsAccepted = prolongements.stream()
            .filter(p -> "accepted".equals(p.getStatut())|| "ended".equals(p.getStatut()))
            .count();

    long prolongationsRefused = prolongements.stream()
            .filter(p -> "refused".equals(p.getStatut()))
            .count();

    // ======================================================
    //  TOTAL
    // ======================================================
    long totalDemandes = reservations + prolongations;

    // ======================================================
    //  PERCENTAGES (SAFE DIVISION)
    // ======================================================
    double pctReservationsAccepted = reservations == 0 ? 0 :
            (reservationsAccepted * 100.0 / reservations);

    double pctReservationsRefused = reservations == 0 ? 0 :
            (reservationsRefused * 100.0 / reservations);

    double pctProlongationsAccepted = prolongations == 0 ? 0 :
            (prolongationsAccepted * 100.0 / prolongations);

    double pctProlongationsRefused = prolongations == 0 ? 0 :
            (prolongationsRefused * 100.0 / prolongations);

    double pctTotalAccepted = totalDemandes == 0 ? 0 :
            ((reservationsAccepted + prolongationsAccepted) * 100.0 / totalDemandes);

    double pctTotalRefused = totalDemandes == 0 ? 0 :
            ((reservationsRefused + prolongationsRefused) * 100.0 / totalDemandes);

    // ======================================================
    //  SET DTO
    // ======================================================
    dto.setTotalDemandes(totalDemandes);

    dto.setReservations(reservations);
    dto.setReservationsAccepted(reservationsAccepted);
    dto.setReservationsRefused(reservationsRefused);

    dto.setProlongations(prolongations);
    dto.setProlongationsAccepted(prolongationsAccepted);
    dto.setProlongationsRefused(prolongationsRefused);

    dto.setPctReservationsAccepted(pctReservationsAccepted);
    dto.setPctReservationsRefused(pctReservationsRefused);

    dto.setPctProlongationsAccepted(pctProlongationsAccepted);
    dto.setPctProlongationsRefused(pctProlongationsRefused);

    dto.setPctTotalAccepted(pctTotalAccepted);
    dto.setPctTotalRefused(pctTotalRefused);

    return dto;
}
//=============pour les statistique de chart bar
@GetMapping("bar/{year}/{type}")
public List<StatistiqueMensuelleDTO> getStatsByType(
        @PathVariable int year,
        @PathVariable String type) {

    List<StatistiqueMensuelleDTO> result = new ArrayList<>();

    String[] months = {
            "Jan",
            "Fév",
            "Mar",
            "Avr",
            "Mai",
            "Juin",
            "Juil",
            "Aoû",
            "Sep",
            "Oct",
            "Nov",
            "Déc"
    };


    for (int month = 1; month <= 12; month++) {

        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());


        List<Produit> produits =
                produitRepository.findByDateDebutStockageBetween(start, end);


        List<Prolongement> prolongements =
                prolongementRepository.findByAncienneDateFinBetween(start, end);


        long value = 0;


        switch (type.toLowerCase()) {

            case "total":

                value = produits.size() + prolongements.size();

                break;


            case "accepted":

                long prodAccepted = produits.stream()
                        .filter(p ->
                                "accepted".equals(p.getStatut())
                                        || "ended".equals(p.getStatut()))
                        .count();


                long proAccepted = prolongements.stream()
                        .filter(p ->
                                "accepted".equals(p.getStatut())
                                        || "ended".equals(p.getStatut()))
                        .count();


                value = prodAccepted + proAccepted;

                break;



            case "refused":

                long prodRefused = produits.stream()
                        .filter(p ->
                                "refused".equals(p.getStatut()))
                        .count();


                long proRefused = prolongements.stream()
                        .filter(p ->
                                "refused".equals(p.getStatut()))
                        .count();


                value = prodRefused + proRefused;

                break;
        }


        StatistiqueMensuelleDTO dto = new StatistiqueMensuelleDTO();

        dto.setMonth(months[month - 1]); //  ici

        dto.setValue(value);


        result.add(dto);
    }


    return result;
}
//=========================================================================

@GetMapping("/stock")
public List<StockProduitDTO> getStock() {

    List<Object[]> results = produitRepository.getGroupedQuantities();

    //  Trier par quantité décroissante
    results.sort((a, b) ->
            Double.compare(
                    ((Number) b[1]).doubleValue(),
                    ((Number) a[1]).doubleValue()
            )
    );


    double total = results.stream()
            .mapToDouble(r -> ((Number) r[1]).doubleValue())
            .sum();


    List<StockProduitDTO> response = new ArrayList<>();

    int rank = 1;

    for (Object[] row : results) {

        String name = (String) row[0];

        double qty = ((Number) row[1]).doubleValue();


        StockProduitDTO dto = new StockProduitDTO();

        dto.setRang(rank++);
        dto.setProduit(name.trim().toLowerCase());
        dto.setQuantite(qty);


        double percent = total == 0
                ? 0
                : (qty * 100.0 / total);


        dto.setPourcentage(percent);

        response.add(dto);
    }

    return response;
}
//========================exporter le csv==========
//================pour les cvs de 12mois===========
@GetMapping("/export/monthly")
public ResponseEntity<byte[]> exportMonthly(@RequestParam int year) throws IOException {

    Workbook workbook = new XSSFWorkbook();
    Sheet sheet = workbook.createSheet("Statistiques Annuelles");

    // =====================================================
    //  TITLE STYLE
    // =====================================================
    CellStyle titleStyle = workbook.createCellStyle();
    Font titleFont = workbook.createFont();
    titleFont.setBold(true);
    titleFont.setFontHeightInPoints((short) 16);
    titleStyle.setFont(titleFont);
    titleStyle.setAlignment(HorizontalAlignment.CENTER);

    Row titleRow = sheet.createRow(0);
    Cell titleCell = titleRow.createCell(0);
    titleCell.setCellValue(" Statistiques Annuelles " + year);
    titleCell.setCellStyle(titleStyle);

    sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 10));

    // =====================================================
    //  HEADER STYLE (GREEN + BOLD + BORDER + CENTER)
    // =====================================================
    CellStyle headerStyle = workbook.createCellStyle();

    Font headerFont = workbook.createFont();
    headerFont.setBold(true);
    headerFont.setColor(IndexedColors.WHITE.getIndex());

    headerStyle.setFont(headerFont);
    headerStyle.setFillForegroundColor(IndexedColors.GREEN.getIndex());
    headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

    headerStyle.setBorderTop(BorderStyle.THIN);
    headerStyle.setBorderBottom(BorderStyle.THIN);
    headerStyle.setBorderLeft(BorderStyle.THIN);
    headerStyle.setBorderRight(BorderStyle.THIN);

    headerStyle.setAlignment(HorizontalAlignment.CENTER);
    headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);

    // =====================================================
    //  BODY STYLE (CENTER + BORDER)
    // =====================================================
    CellStyle bodyStyle = workbook.createCellStyle();

    bodyStyle.setBorderTop(BorderStyle.THIN);
    bodyStyle.setBorderBottom(BorderStyle.THIN);
    bodyStyle.setBorderLeft(BorderStyle.THIN);
    bodyStyle.setBorderRight(BorderStyle.THIN);

    bodyStyle.setAlignment(HorizontalAlignment.CENTER);
    bodyStyle.setVerticalAlignment(VerticalAlignment.CENTER);

    // =====================================================
    //  HEADER ROW (ROW 1)
    // =====================================================
    String[] headers = {
            "Mois",
            "Demandes",
            "Réservations",
            "Réservations acceptées",
            "Réservations refusées",
            "Prolongations",
            "Prolongations Acceptés",
            "Prolongations Refusés",
            "Clients",
            "Quantité en tonne",
            "Chiffre Affaire"
    };

    Row headerRow = sheet.createRow(1);

    for (int i = 0; i < headers.length; i++) {
        Cell cell = headerRow.createCell(i);
        cell.setCellValue(headers[i]);
        cell.setCellStyle(headerStyle);
    }

    // =====================================================
    //  LOOP 12 MONTHS
    // =====================================================
    int rowIndex = 2;

    for (int m = 1; m <= 12; m++) {

        LocalDate start = LocalDate.of(year, m, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        List<Produit> produits =
                produitRepository.findByDateDebutStockageBetween(start, end);

        List<Prolongement> prolongements =
                prolongementRepository.findByAncienneDateFinBetween(start, end);

        long resTotale = produits.size()+prolongements.size();
        long res= produits.size();
        long resAcc = produits.stream().filter(p ->
                "accepted".equals(p.getStatut()) || "ended".equals(p.getStatut())
        ).count();

        long resRef = produits.stream()
                .filter(p -> "refused".equals(p.getStatut()))
                .count();

        long pro = prolongements.size();

        long proAcc = prolongements.stream().filter(p ->
                "accepted".equals(p.getStatut()) || "ended".equals(p.getStatut())
        ).count();

        long proRef = prolongements.stream()
                .filter(p -> "refused".equals(p.getStatut()))
                .count();

        long clients = produits.stream()
                .map(p -> p.getClient().getCin())
                .distinct()
                .count();

        double quantite = produits.stream()
                .mapToDouble(Produit::getQuantite)
                .sum();

        double chiffre = produits.stream()
                .mapToDouble(Produit::getPrix)
                .sum();

        Row row = sheet.createRow(rowIndex++);

        Object[] data = {
                "Mois " + m,
                resTotale,
                res, resAcc, resRef,
                pro, proAcc, proRef,
                clients,
                quantite,
                chiffre+" DH"
        };

        for (int i = 0; i < data.length; i++) {
            Cell cell = row.createCell(i);
            cell.setCellValue(data[i].toString());
            cell.setCellStyle(bodyStyle);
        }
    }

    // =====================================================
    //  AUTO SIZE
    // =====================================================
    for (int i = 0; i < 11; i++) {
        sheet.autoSizeColumn(i);
    }

    // =====================================================
    //  RETURN FILE
    // =====================================================
    ByteArrayOutputStream out = new ByteArrayOutputStream();
    workbook.write(out);
    workbook.close();

    byte[] bytes = out.toByteArray();

    HttpHeaders headersHttp = new HttpHeaders();
    headersHttp.setContentType(
            MediaType.parseMediaType(
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            )
    );

    headersHttp.setContentDisposition(
            ContentDisposition.attachment()
                    .filename("statistiques_annuelles_"+year+".xlsx")
                    .build()
    );

    return new ResponseEntity<>(bytes, headersHttp, HttpStatus.OK);
}
//===========pour les statistiques csv detailee=============
@GetMapping("/export/details")
public ResponseEntity<byte[]> exportDetails(
        @RequestParam int year,
        @RequestParam int monthIndex) throws IOException {

    LocalDate start = LocalDate.of(year, monthIndex, 1);
    LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

    Workbook workbook = new XSSFWorkbook();
    Sheet sheet = workbook.createSheet("Détails Réservations");

    // =====================================================
    //  TITLE STYLE
    // =====================================================
    CellStyle titleStyle = workbook.createCellStyle();
    Font titleFont = workbook.createFont();
    titleFont.setBold(true);
    titleFont.setFontHeightInPoints((short) 16);

    titleStyle.setFont(titleFont);
    titleStyle.setAlignment(HorizontalAlignment.CENTER);

    Row titleRow = sheet.createRow(0);
    Cell titleCell = titleRow.createCell(0);
    titleCell.setCellValue(" Détails des Réservations 0"+monthIndex+"/"+year);
    titleCell.setCellStyle(titleStyle);

    sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 13));

    // =====================================================
    //  HEADER STYLE (GREEN + BORDER + CENTER)
    // =====================================================
    CellStyle headerStyle = workbook.createCellStyle();

    Font headerFont = workbook.createFont();
    headerFont.setBold(true);
    headerFont.setColor(IndexedColors.WHITE.getIndex());

    headerStyle.setFont(headerFont);
    headerStyle.setFillForegroundColor(IndexedColors.GREEN.getIndex());
    headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

    headerStyle.setBorderTop(BorderStyle.THIN);
    headerStyle.setBorderBottom(BorderStyle.THIN);
    headerStyle.setBorderLeft(BorderStyle.THIN);
    headerStyle.setBorderRight(BorderStyle.THIN);

    headerStyle.setAlignment(HorizontalAlignment.CENTER);

    // =====================================================
    //  BODY STYLE
    // =====================================================
    CellStyle bodyStyle = workbook.createCellStyle();

    bodyStyle.setBorderTop(BorderStyle.THIN);
    bodyStyle.setBorderBottom(BorderStyle.THIN);
    bodyStyle.setBorderLeft(BorderStyle.THIN);
    bodyStyle.setBorderRight(BorderStyle.THIN);

    bodyStyle.setAlignment(HorizontalAlignment.CENTER);

    // =====================================================
    //  HEADERS
    // =====================================================
    String[] headers = {
            "Type Demande",
            "Nom Client",
            "CIN",
            "Téléphone",
            "Email",
            "Code Produit",
            "Nom Produit",
            "Quantité",
            "Durée Stockage",
            "Date Début",
            "Date Fin",
            "Température",
            "Chambre",
            "Statut",
            "Prix"
    };

    Row headerRow = sheet.createRow(1);

    for (int i = 0; i < headers.length; i++) {
        Cell cell = headerRow.createCell(i);
        cell.setCellValue(headers[i]);
        cell.setCellStyle(headerStyle);
    }

    // =====================================================
    //  DATA ROWS
    // =====================================================
    int rowIndex = 2;

    List<Produit> produits =
            produitRepository.findByDateDebutStockageBetween(start, end);

    List<Prolongement> prolongements =
            prolongementRepository.findByAncienneDateFinBetween(start, end);

    // ================= RESERVATIONS =================
    for (Produit p : produits) {

        Row row = sheet.createRow(rowIndex++);

        String statut = p.getStatut();
        String statutLabel = null;
        if ("ended".equals(statut) || "accepted".equals(statut)) {

            statutLabel = "accepté";
        }else if ("refused".equals(statut)) {
            statutLabel = "refusé";
        }else if ("enAtente".equals(statut)) {
            statutLabel="En attente";
        }
        Object[] data = {
                "Réservation",
                p.getClient().getNom(),
                p.getClient().getCin(),
                p.getClient().getTelephone(),
                p.getClient().getEmail(),
                p.getCodeProduit(),
                p.getNom(),
                p.getQuantite(),
                p.getDureeStockage(),
                p.getDateDebutStockage(),
                p.getDateFinStockage(),
                p.getTemperatureStockage(),
                p.getChambre().getNomChambre(),
                statutLabel,
                p.getPrix()
        };

        for (int i = 0; i < data.length; i++) {
            Cell cell = row.createCell(i);
            cell.setCellValue(String.valueOf(data[i]));
            cell.setCellStyle(bodyStyle);
        }
    }

    // ================= PROLONGATIONS =================
    for (Prolongement pr : prolongements) {

        Row row = sheet.createRow(rowIndex++);

        String statut = pr.getStatut();
        String statutLabel = null;
        if ("ended".equals(statut) || "accepted".equals(statut)) {

            statutLabel = "accepté";
        }else if ("refused".equals(statut)) {
            statutLabel = "refusé";
        }else if ("enAtente".equals(statut)) {
            statutLabel="En attente";
        }

        Object[] data = {
                "Prolongation",
                pr.getProduit().getClient().getNom(),
                pr.getProduit().getClient().getCin(),
                pr.getProduit().getClient().getTelephone(),
                pr.getProduit().getClient().getEmail(),
                pr.getProduit().getCodeProduit(),
                pr.getProduit().getNom(),
                pr.getProduit().getQuantite(),
                pr.getNbJoursAjoutes(),
                pr.getAncienneDateFin(),
                pr.getNouvelleDateFinDemandee(),
                pr.getProduit().getTemperatureStockage(),
                pr.getProduit().getChambre().getNomChambre(),
                statutLabel,
                pr.getPrixProlongement()
        };

        for (int i = 0; i < data.length; i++) {
            Cell cell = row.createCell(i);
            cell.setCellValue(String.valueOf(data[i]));
            cell.setCellStyle(bodyStyle);

        }
    }

    // =====================================================
    //  AUTO SIZE
    // =====================================================
    for (int i = 0; i < 14; i++) {
        sheet.autoSizeColumn(i);
    }
    // =====================================================
//  TOTAL CHIFFRE D'AFFAIRE ROW
// =====================================================

    double totalPrix = produits.stream()
            .mapToDouble(Produit::getPrix)
            .sum()
            +
            prolongements.stream()
                    .mapToDouble(Prolongement::getPrixProlongement)
                    .sum();


    Row totalRow = sheet.createRow(rowIndex);


// Merge all columns (15 columns => index 0 to 14)
    sheet.addMergedRegion(
            new CellRangeAddress(
                    rowIndex,
                    rowIndex,
                    0,
                    14
            )
    );


// Create cell
    Cell totalCell = totalRow.createCell(0);

    totalCell.setCellValue(
            "Chiffre d'affaire : " + totalPrix + " DH"
    );


// Style
    CellStyle totalStyle = workbook.createCellStyle();

    Font totalFont = workbook.createFont();
    totalFont.setBold(true);
    totalFont.setFontHeightInPoints((short) 14);


    totalStyle.setFont(totalFont);

    totalStyle.setAlignment(HorizontalAlignment.CENTER);
    totalStyle.setVerticalAlignment(VerticalAlignment.CENTER);





// Background color (optional)
    totalStyle.setFillForegroundColor(
            IndexedColors.LIGHT_GREEN.getIndex()
    );
    totalStyle.setFillPattern(
            FillPatternType.SOLID_FOREGROUND
    );


    totalCell.setCellStyle(totalStyle);


// Row height
    totalRow.setHeightInPoints(25);

    // =====================================================
    //  RETURN FILE
    // =====================================================
    ByteArrayOutputStream out = new ByteArrayOutputStream();
    workbook.write(out);
    workbook.close();

    return ResponseEntity.ok()
            .header("Content-Disposition", "attachment; filename=details.xlsx")
            .body(out.toByteArray());
}
}