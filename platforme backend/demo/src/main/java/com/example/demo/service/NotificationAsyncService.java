package com.example.demo.service;

import com.example.demo.entity.Client;
import com.example.demo.entity.Produit;
import com.example.demo.entity.Prolongement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class NotificationAsyncService {

    @Autowired
    WhatsAppService whatsappService;
    private final PdfService pdfService;
    private final EmailService emailService;






    public NotificationAsyncService(
            PdfService pdfService,
            EmailService emailService
    ){
        this.pdfService = pdfService;
        this.emailService = emailService;
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



//            String fileName =
//                    pdfService.savePdf(
//                            pdfBytes,
//                            produit.getCodeProduit()
//                    );



//            String pdfUrl =
//                    baseUrl
//                            +
//                            "/api/produits/recus/"
//                            +
//                            fileName;



            int type = 1;



            emailService.envoyerEmail(
                    produit,
                    motpass,
                    envoyerMotDePasse,
                    type,
                    "Reçu de Réservation"
            );



            whatsappService.envoyerMessageWhatsApp(
                    produit,
                    motpass,
                    pdfBytes,
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



//            String fileName =
//                    pdfService.savePdf(
//                            pdfBytes,
//                            produit.getCodeProduit()
//                    );



//            String pdfUrl =
//                    baseUrl
//                            +
//                            "/api/produits/recus/"
//                            +
//                            fileName;



            int type = 2;



            emailService.envoyerEmail(
                    produit,
                    motpass,
                    envoyerMotDePasse,
                    type,
                    "Reçu de prolongation de réservation"
            );



            whatsappService.envoyerMessageWhatsApp(
                    produit,
                    motpass,
                    pdfBytes,
                    envoyerMotDePasse,
                    type
            );


        }
        catch(Exception e){

            e.printStackTrace();

        }

    }

}