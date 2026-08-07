package com.example.demo.controller;

import com.example.demo.entity.Chambre;
import com.example.demo.entity.Client;
import com.example.demo.entity.Produit;
import com.example.demo.entity.Prolongement;
import com.example.demo.repository.ChambreRepository;
import com.example.demo.repository.ProduitRepository;
import com.example.demo.repository.ProlongementRepository;
import com.example.demo.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prolongements")
public class ProlongementController {

    @Autowired
    WhatsAppService whatsappService;

    @Autowired
    private ProlongementRepository prolongementRepository;

    @Autowired
    private ProduitRepository produitRepository;

    @Autowired
    private ChambreRepository chambreRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PdfService pdfService;

    @Autowired
    private SimpMessagingTemplate template;

    @Autowired
    NotificationAsyncService notificationAsyncService;






//=================================pour faire un prolongement=============================
    @PostMapping("/demande")
    @PreAuthorize("hasAnyAuthority('CLIENT')")
    public Prolongement creerProlongementDirect(@RequestBody Map<String, Object> request) {
        // Récupérer les infos du client
        String codeProduit = (String) request.get("codeProduit");
        int nbJours = (Integer) request.get("nbJours");
        String dateString = (String) request.get("dateFinStockage");
        LocalDate dateFinStockage = LocalDate.parse(dateString);
        Object prixObj = request.get("prixProlongement");
        Double prix;
        if (prixObj instanceof Number) {
            prix = ((Number) prixObj).doubleValue(); // convertit Integer ou Double en Double
        } else {
            throw new RuntimeException("prixProlongement invalide : " + prixObj);
        }
        //=================================================
        //=================================================
        // Récupérer le produit existant
        Produit produit = produitRepository.findById(codeProduit)
                .orElseThrow(() -> new RuntimeException("Produit introuvable"));

        // Créer le prolongement
        Prolongement pr = new Prolongement();
        pr.setProduit(produit);
        pr.setPrixProlongement(prix);
        pr.setAncienneDateFin(dateFinStockage.plusDays(1));
        pr.setNouvelleDateFinDemandee(pr.getAncienneDateFin().plusDays(nbJours));
        pr.setNbJoursAjoutes(nbJours);
        pr.setStatut("enAtente"); // statut initial
        pr.setDateDemande(java.time.LocalDateTime.now());

        // Sauvegarder et retourner le prolongement
        // 2. Notify admins
        Prolongement saved = prolongementRepository.save(pr);

        template.convertAndSend(
                "/topic/demandes",
                "demande"

        );

        return saved;
    }
//    =============pour annuler un prolongation en atente
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('CLIENT')")
    public Map<String, String> supprimerProlongement(@PathVariable Long id) {
        Prolongement p = prolongementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prolongement introuvable"));

        if (!"enAtente".equals(p.getStatut())) {
            throw new RuntimeException("Impossible de supprimer un prolongement déjà traité");
        }

        // Option 1 : supprimer la ligne de la base
        prolongementRepository.delete(p);
        // 2. Notify admins
        template.convertAndSend(
                "/topic/demandes",
                "demande"
        );

        return Map.of("message", "Prolongement annulé avec succès");
    }
//    pour modifier une prolongation en atente
    @PutMapping("/modifier/{id}")
    @PreAuthorize("hasAnyAuthority('CLIENT')")

    public Prolongement modifierProlongement(@PathVariable Long id,
                                             @RequestBody Map<String, Object> request) {
        Prolongement prolongement = prolongementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prolongement introuvable"));

        // Exemple : modifier le nombre de jours
        Integer nbJours = (Integer) request.get("nbJours");
        Object prixObj = request.get("prix");
        Double prix;
        if (prixObj instanceof Number) {
            prix = ((Number) prixObj).doubleValue(); // convertit Integer ou Double en Double
        } else {
            throw new RuntimeException("prixProlongement invalide : " + prixObj);
        }
        if (nbJours != null && nbJours > 0) {
            prolongement.setNbJoursAjoutes(nbJours);
            // recalcul de la nouvelle date de fin
            prolongement.setNouvelleDateFinDemandee(prolongement.getAncienneDateFin().plusDays(nbJours));
            prolongement.setPrixProlongement(prix);
        }
        // 2. Notify admins

        Prolongement saved = prolongementRepository.save(prolongement);

        template.convertAndSend(
                "/topic/demandes",
                "demande"

        );

        return saved;
    }
    //===================================================================

    //========================= accepter une prolongation ==================

    @PutMapping("/accepter/{code}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> accepterProlongation(
            @PathVariable Long code
    ) throws Exception {



        Prolongement prolongement =
                prolongementRepository.findById(code)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Prolongation introuvable"
                                )
                        );



        Produit produit =
                prolongement.getProduit();



        Double quantiteOccupee =
                prolongementRepository
                        .getQuantiteOccupeePourProlongement(
                                produit.getChambre(),
                                produit.getCodeProduit(),
                                prolongement.getAncienneDateFin(),
                                prolongement.getNouvelleDateFinDemandee()
                        );



        if(
                quantiteOccupee + produit.getQuantite()
                        >
                        produit.getChambre().getCapacite()
        ){


            return ResponseEntity.ok(
                    Map.of(
                            "success",
                            false,

                            "message",
                            "Capacité insuffisante pour cette prolongation"
                    )
            );

        }





        prolongement.setStatut("accepted");


        Prolongement prolongementSauvegarde =
                prolongementRepository.save(prolongement);




        template.convertAndSend(
                "/topic/reservations",
                "reservation"
        );





        Client client =
                produit.getClient();




        List<Produit> produitsAcceptes =
                produitRepository.findByClientAndStatutIn(
                        client,
                        List.of(
                                "accepted",
                                "ended",
                                "stocked",
                                "canceled"
                        )
                );



        boolean envoyerMotDePasse =
                produitsAcceptes.isEmpty();



        String motpass =
                client.getMotDePasse();





        notificationAsyncService
                .envoyerNotificationProlongement(
                        produit,
                        prolongementSauvegarde,
                        motpass,
                        envoyerMotDePasse
                );





        return ResponseEntity.ok(
                Map.of(
                        "success",
                        true,

                        "message",
                        "La prolongation a été acceptée avec succès."


                )
        );


    }
    //============================================================================
    //===========================refuse une reservation=======================
    @DeleteMapping("/refuser/{code}/{message}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")

    public String refuserReservation(@PathVariable Long code, @PathVariable String message) throws Exception {

        Prolongement prolongement = prolongementRepository.findById(code)
                .orElseThrow(() -> new RuntimeException("Produit introuvable"));
        prolongement.setStatut("refused");
        prolongementRepository.save(prolongement);
        template.convertAndSend(
                "/topic/reservations",
                "reservation"
        );
        Produit produit = prolongement.getProduit();

        //envoyer le email

        emailService.sendRefuseEmail(produit, message,2);
        whatsappService.envoyerMessageRefus(produit,message,2);
        return "refusée avec succès";
    }
    //=====================================telecharger le recu
    @GetMapping("/download/{id}")

    public ResponseEntity<byte[]> telechargerRecu(@PathVariable Long id) throws Exception {

        Prolongement prolongement = prolongementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prolongation introuvable"));
        Produit produit =prolongement.getProduit();
        // Générer PDF en mémoire
        byte[] pdfBytes = pdfService.generatePdf(
                "Reçu de prolongation de réservation",
                produit.getClient().getNom(),
                produit.getClient().getEmail(),
                produit.getClient().getCin(),
                produit.getClient().getTelephone(),
                produit.getCodeProduit(),
                prolongement.getAncienneDateFin().toString(),
                String.valueOf(produit.getDureeStockage()),
                prolongement.getNouvelleDateFinDemandee().toString(),
                LocalDate.now().toString(),
                String.valueOf(prolongement.getPrixProlongement()),
                produit.getNom(),
                String.valueOf(produit.getQuantite()),
                produit.getChambre().getNomChambre(),
                String.valueOf(produit.getTemperatureStockage())
        );

        // Retourner le PDF directement, sans le stocker
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"recu_" + produit.getCodeProduit() + ".pdf\"")
                .body(pdfBytes);
    }
//===================================================

//==================pour changer statut to stocked
@PutMapping("/statutstockage/{idProlongement}")
@PreAuthorize("hasAuthority('ADMIN')")
public ResponseEntity<?> changerStatutProlongement(
        @PathVariable Long idProlongement,
        @RequestBody Map<String, String> request
) {


    Prolongement prolongement =
            prolongementRepository.findById(idProlongement)
                    .orElseThrow(
                            () -> new RuntimeException(
                                    "Prolongement introuvable"
                            )
                    );


    String nouveauStatut =
            request.get("statut");


    prolongement.setStatut(
            nouveauStatut
    );


    prolongementRepository.save(
            prolongement
    );



    return ResponseEntity.ok(
            Map.of(
                    "success",
                    true,

                    "message",
                    "Statut modifié avec succès",

                    "statut",
                    nouveauStatut
            )
    );

}
//====================================supprimer une reservation==================================
@PutMapping("/statut/{idProlongement}")
@PreAuthorize("hasAuthority('ADMIN')")
public ResponseEntity<?> SupprimerProlongement(
        @PathVariable Long idProlongement,
        @RequestBody Map<String,String> request
) {


    Prolongement prolongement =
            prolongementRepository.findById(idProlongement)
                    .orElseThrow(
                            () -> new RuntimeException(
                                    "Prolongement introuvable"
                            )
                    );


    String nouveauStatut =
            request.get("statut");



    if(
            !nouveauStatut.equals("canceled")
                    &&
                    !nouveauStatut.equals("ended")
    ){

        return ResponseEntity
                .badRequest()
                .body(
                        Map.of(
                                "success", false,
                                "message",
                                "Statut non autorisé"
                        )
                );
    }



    prolongement.setStatut(
            nouveauStatut
    );


    prolongementRepository.save(
            prolongement
    );
    template.convertAndSend(
            "/topic/reservations",
            "reservation"
    );


    return ResponseEntity.ok(
            Map.of(
                    "success", true,
                    "message",
                    "Statut du prolongement modifié avec succès",
                    "statut",
                    nouveauStatut
            )
    );

}

}