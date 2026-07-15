package com.example.demo.service;

import com.example.demo.entity.Client;
import com.example.demo.entity.Produit;
import com.example.demo.entity.Prolongement;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class NotificationAsyncService {


    private final PdfService pdfService;
    private final EmailService emailService;
    private final TwilioService twilioService;


    @Value("${app.base-url}")
    private String baseUrl;



    public NotificationAsyncService(
            PdfService pdfService,
            EmailService emailService,
            TwilioService twilioService
    ){
        this.pdfService = pdfService;
        this.emailService = emailService;
        this.twilioService = twilioService;
    }



    @Async
    public void envoyerNotification(
            Produit produit,
            String motpass,
            boolean envoyerMotDePasse
    ) {


        try {


            Client client = produit.getClient();



            byte[] pdfBytes =
                    pdfService.generatePdf(
                            "Reçu de Réservation",
                            client.getNom(),
                            client.getEmail(),
                            client.getCin(),
                            client.getTelephone(),
                            produit.getCodeProduit(),
                            produit.getDateDebutStockage().toString(),
                            String.valueOf(produit.getDureeStockage()),
                            produit.getDateFinStockage().toString(),
                            LocalDate.now().toString(),
                            String.valueOf(produit.getPrix()),
                            produit.getNom(),
                            String.valueOf(produit.getQuantite()),
                            produit.getChambre().getNomChambre(),
                            String.valueOf(produit.getTemperatureStockage())
                    );



            String fileName =
                    pdfService.savePdf(
                            pdfBytes,
                            produit.getCodeProduit()
                    );



            String pdfUrl =
                    baseUrl
                            +
                            "/api/produits/recus/"
                            +
                            fileName;



            int type = 1;



            emailService.envoyerEmail(
                    produit,
                    motpass,
                    envoyerMotDePasse,
                    type,
                    "Reçu de Réservation"
            );



            twilioService.envoyerMessageWhatsApp(
                    produit,
                    motpass,
                    pdfUrl,
                    fileName,
                    envoyerMotDePasse,
                    type
            );


        }
        catch(Exception e){

            e.printStackTrace();

        }


    }
    @Async
    public void envoyerNotificationProlongement(
            Produit produit,
            Prolongement prolongement,
            String motpass,
            boolean envoyerMotDePasse
    ) {


        try {


            Client client = produit.getClient();



            byte[] pdfBytes =
                    pdfService.generatePdf(
                            "Reçu de prolongation de réservation",
                            client.getNom(),
                            client.getEmail(),
                            client.getCin(),
                            client.getTelephone(),
                            produit.getCodeProduit(),
                            prolongement.getAncienneDateFin().toString(),
                            String.valueOf(
                                    prolongement.getNbJoursAjoutes()
                            ),
                            prolongement.getNouvelleDateFinDemandee().toString(),
                            LocalDate.now().toString(),
                            String.valueOf(produit.getPrix()),
                            produit.getNom(),
                            String.valueOf(produit.getQuantite()),
                            produit.getChambre().getNomChambre(),
                            String.valueOf(
                                    produit.getTemperatureStockage()
                            )
                    );



            String fileName =
                    pdfService.savePdf(
                            pdfBytes,
                            produit.getCodeProduit()
                    );



            String pdfUrl =
                    baseUrl
                            +
                            "/api/produits/recus/"
                            +
                            fileName;



            int type = 2;



            emailService.envoyerEmail(
                    produit,
                    motpass,
                    envoyerMotDePasse,
                    type,
                    "Reçu de prolongation de réservation"
            );



            twilioService.envoyerMessageWhatsApp(
                    produit,
                    motpass,
                    pdfUrl,
                    fileName,
                    envoyerMotDePasse,
                    type
            );


        }
        catch(Exception e){

            e.printStackTrace();

        }

    }

}