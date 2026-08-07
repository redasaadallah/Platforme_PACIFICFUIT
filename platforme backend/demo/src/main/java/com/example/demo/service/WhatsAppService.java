package com.example.demo.service;

import com.example.demo.entity.Client;
import com.example.demo.entity.Produit;
import com.example.demo.entity.Prolongement;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class WhatsAppService {


    private final RestTemplate restTemplate;


    public WhatsAppService(RestTemplate restTemplate){

        this.restTemplate = restTemplate;

    }

//=========================methode pour formater le numero
private String formaterNumeroMaroc(String telephone) {

    if (telephone == null || telephone.trim().isEmpty()) {
        throw new RuntimeException("Le numéro de téléphone est vide");
    }

    telephone = telephone.replace(" ", "").trim();

    // Exemple : 0612345678 -> +212612345678
    if (telephone.startsWith("0")) {
        telephone = "+212" + telephone.substring(1);
    }

    // Exemple : 212612345678 -> +212612345678
    if (telephone.startsWith("212")) {
        telephone = "+" + telephone;
    }

    // Exemple déjà correct : +212612345678
    if (!telephone.startsWith("+")) {
        throw new RuntimeException("Format du numéro invalide : " + telephone);
    }

    return telephone;
}
//=========================envoyer la reponce
public void sendMessagePhone(
        String telephone,
        String messageText,
        String nom,
        String prenom,
        String messageClient
) {


    String numeroFormate = formaterNumeroMaroc(telephone);


    String message =
            "Bonjour " + nom + " " + prenom + ",\n\n" +
                    "Réponse à votre message :\n" +
                    messageClient + "\n\n" +
                    messageText + "\n\n" +
                    "Cordialement,\n" +
                    "L’équipe PACIFIC FRUIT";



    Map<String, String> body = new HashMap<>();

    body.put(
            "phone",
            numeroFormate.replace("+", "")
    );

    body.put(
            "message",
            message
    );



    HttpHeaders headers = new HttpHeaders();

    headers.setContentType(
            MediaType.APPLICATION_JSON
    );


    HttpEntity<Map<String,String>> request =
            new HttpEntity<>(
                    body,
                    headers
            );



    restTemplate.postForObject(
            "http://whatsapp-service:3000/send",
            request,
            String.class
    );

}
//===============pour envoyer le message dacceptation
public void envoyerMessageWhatsApp(
        Produit produit,
        String password,
        byte[] pdfBytes,
        boolean envoyerMotDePasse,
        int type
) {

    Client client = produit.getClient();


    // Format : +212612345678
    String numeroFormate =
            formaterNumeroMaroc(
                    client.getTelephone()
            );


    // Baileys utilise : 212612345678@s.whatsapp.net
    String numeroBaileys =
            numeroFormate.replace("+", "");



    String mtype;

    if(type == 1){
        mtype = "stockage";
    }
    else if(type == 2){
        mtype = "prolongation";
    }
    else{
        mtype = "demande";
    }



    String message;



    if(envoyerMotDePasse){

        message =
                "Bonjour "
                        + client.getNom()
                        + "\n\n"

                        +

                        "Nous vous informons que votre demande de stockage du produit "
                        + produit.getNom()
                        + " a été acceptée avec succès.\n\n"

                        +

                        "Vous pouvez accéder à votre espace client avec :\n\n"

                        +

                        "Numéro CIN : "
                        + client.getCin()
                        + "\n"

                        +

                        "Mot de passe : "
                        + password
                        + "\n\n"

                        +

                        "Nous vous remercions pour votre confiance.\n\n"

                        +

                        "Cordialement,\n"
                        +

                        "L’équipe PACIFIC FRUIT.";

    }

    else {


        message =
                "Bonjour "
                        + client.getNom()
                        + "\n\n"

                        +

                        "Nous vous informons que votre demande de "
                        + mtype
                        + " du produit "
                        + produit.getNom()
                        + " a été acceptée avec succès.\n\n"

                        +

                        "Vous pouvez consulter les détails depuis votre espace client.\n\n"

                        +

                        "Nous vous remercions pour votre confiance.\n\n"

                        +

                        "Cordialement,\n"
                        +

                        "L’équipe PACIFIC FRUIT.";

    }




    Map<String,Object> requestBody =
            new HashMap<>();


    requestBody.put(
            "phone",
            numeroBaileys
    );


    requestBody.put(
            "message",
            message
    );


    requestBody.put(
            "fileName",
            "recu-"
                    + produit.getCodeProduit()
                    + ".pdf"
    );


    requestBody.put(
            "pdf",
            Base64.getEncoder()
                    .encodeToString(pdfBytes)
    );



    HttpHeaders headers =
            new HttpHeaders();

    headers.setContentType(
            MediaType.APPLICATION_JSON
    );



    HttpEntity<Map<String,Object>> request =
            new HttpEntity<>(
                    requestBody,
                    headers
            );



    restTemplate.postForObject(
            "http://whatsapp-service:3000/send",
            request,
            String.class
    );

}
//==================================
// Message de refus d'une réservation
//==================================

    public void envoyerMessageRefus(
            Produit produit,
            String raison,
            int type
    ) {


        Client client = produit.getClient();


        String numeroFormate =
                formaterNumeroMaroc(
                        client.getTelephone()
                );



        String genre;


        if(type == 1){

            genre = "stockage";

        }else{

            genre = "prolongation du stockage";

        }



        String message =
                "Bonjour, "
                        + client.getNom()
                        + "\n\n"
                        + "Nous vous informons que votre demande de "
                        + genre
                        + " du produit "
                        + produit.getNom()
                        + " n’a pas pu être acceptée.\n\n"
                        + "Raison :\n\n"
                        + raison
                        + "\n\n"
                        + "Nous restons à votre disposition pour toute question ou assistance.\n\n"
                        + "Cordialement,\n"
                        + "L’équipe PACIFIC FRUIT.";



        Map<String,Object> request =
                new HashMap<>();


        request.put(
                "phone",
                numeroFormate.replace("+","")
        );


        request.put(
                "message",
                message
        );


        restTemplate.postForObject(
                "http://whatsapp-service:3000/send",
                request,
                String.class
        );


    }
    //===========================================
// Message WhatsApp envoyé 1 jour avant le début du stockage
//===========================================

    public void sendMessageBeforeStart(Produit produit) {


        Client client = produit.getClient();


        String numeroFormate =
                formaterNumeroMaroc(
                        client.getTelephone()
                );



        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("dd/MM/yyyy");


        String dateDebut =
                produit.getDateDebutStockage()
                        .format(formatter);




        String message =

                "Bonjour "
                        + client.getNom()
                        + ",\n\n"

                        + "Nous vous rappelons que votre produit \""
                        + produit.getNom()
                        + "\"\n\n"

                        + "sera mis en stockage dans 1 jour.\n\n"

                        + "Merci de bien vouloir présenter votre reçu de stockage le jour du dépôt.\n\n"

                        + "Informations importantes :\n\n"

                        + "Nom du produit : "
                        + produit.getNom()
                        + "\n"

                        + "Quantité en tonne : "
                        + produit.getQuantite()
                        + "\n"

                        + "Température de stockage : "
                        + produit.getTemperatureStockage()
                        + " °C\n"

                        + "Date début de stockage : "
                        + dateDebut
                        + "\n"

                        + "Durée de stockage : "
                        + produit.getDureeStockage()
                        + " jours\n\n"

                        + "Prix de stockage : "
                        + produit.getPrix()
                        + " DH\n\n"

                        + "Cordialement,\n"
                        + "L’équipe PACIFIC FRUIT";





        Map<String,Object> request =
                new HashMap<>();



        request.put(
                "phone",
                numeroFormate.replace("+", "")
        );


        request.put(
                "message",
                message
        );



        restTemplate.postForObject(
                "http://whatsapp-service:3000/send",
                request,
                String.class
        );


    }
    //===========================================
// Message WhatsApp envoyé 1 jour avant la fin du stockage
//===========================================

    public void sendMessageBeforeEnd(Produit produit) {


        Client client = produit.getClient();


        String numeroFormate =
                formaterNumeroMaroc(
                        client.getTelephone()
                );



        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("dd/MM/yyyy");


        String dateFin =
                produit.getDateFinStockage()
                        .format(formatter);




        String message =

                "Bonjour "
                        + client.getNom()
                        + ",\n\n"

                        + "Nous vous rappelons que le stockage de votre produit \""
                        + produit.getNom()
                        + "\"\n\n"

                        + "se terminera dans 1 jour.\n\n"

                        + "Vous pouvez prolonger la durée de stockage via votre espace client.\n\n"

                        + "Informations importantes :\n\n"

                        + "Nom du produit : "
                        + produit.getNom()
                        + "\n"

                        + "Quantité en tonne : "
                        + produit.getQuantite()
                        + "\n"

                        + "Température de stockage : "
                        + produit.getTemperatureStockage()
                        + " °C\n"

                        + "Date fin de stockage : "
                        + dateFin
                        + "\n\n"

                        + "Cordialement,\n"
                        + "L’équipe PACIFIC FRUIT";






        Map<String,Object> request =
                new HashMap<>();



        request.put(
                "phone",
                numeroFormate.replace("+", "")
        );


        request.put(
                "message",
                message
        );



        restTemplate.postForObject(
                "http://whatsapp-service:3000/send",
                request,
                String.class
        );


    }
    //===========================================
// Envoyer un message WhatsApp avant une prolongation commence
//===========================================

    public void sendMessageProlongationTomorrow(Prolongement prolongement) {


        Produit produit =
                prolongement.getProduit();


        Client client =
                produit.getClient();



        String numeroFormate =
                formaterNumeroMaroc(
                        client.getTelephone()
                );



        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("dd/MM/yyyy");



        String message =


                "Bonjour "
                        + client.getNom()
                        + ",\n\n"


                        + "Nous vous informons que la prolongation de stockage de votre produit \""
                        + produit.getNom()
                        + "\" commencera demain.\n\n"



                        + "Veuillez obligatoirement présenter le reçu de prolongation lors de votre visite.\n\n"



                        + "Informations importantes :\n\n"


                        + "Nouvelle date de fin : "
                        + prolongement
                        .getNouvelleDateFinDemandee()
                        .format(formatter)
                        + "\n"



                        + "Prix de la prolongation : "
                        + prolongement.getPrixProlongement()
                        + " DH\n\n"



                        + "Merci de prendre en compte cette mise à jour.\n\n"



                        + "Cordialement,\n"
                        + "L’équipe PACIFIC FRUIT";






        Map<String,Object> request =
                new HashMap<>();



        request.put(
                "phone",
                numeroFormate.replace("+", "")
        );


        request.put(
                "message",
                message
        );




        restTemplate.postForObject(
                "http://whatsapp-service:3000/send",
                request,
                String.class
        );


    }
    //===========================================
// Envoyer un message WhatsApp avant la fin d'une prolongation
//===========================================

    public void sendMessageProlongationEndTomorrow(Prolongement prolongement) {


        Produit produit =
                prolongement.getProduit();


        Client client =
                produit.getClient();



        String numeroFormate =
                formaterNumeroMaroc(
                        client.getTelephone()
                );



        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("dd/MM/yyyy");




        String message =


                "Bonjour "
                        + client.getNom()
                        + ",\n\n"



                        + "Nous vous rappelons que la prolongation de stockage de votre produit \""
                        + produit.getNom()
                        + "\" se terminera demain.\n\n"



                        + "Date de fin : "
                        + prolongement
                        .getNouvelleDateFinDemandee()
                        .format(formatter)
                        + "\n\n"



                        + "Vous pouvez également demander une nouvelle prolongation directement depuis votre espace client.\n\n"



                        + "Cordialement,\n"
                        + "L’équipe PACIFIC FRUIT";






        Map<String,Object> request =
                new HashMap<>();



        request.put(
                "phone",
                numeroFormate.replace("+", "")
        );


        request.put(
                "message",
                message
        );





        restTemplate.postForObject(
                "http://whatsapp-service:3000/send",
                request,
                String.class
        );


    }
    //===========================================
// Envoyer OTP WhatsApp
//===========================================

    public void envoyerOTP(
            String telephone,
            String code
    ) {


        String numeroFormate =
                formaterNumeroMaroc(
                        telephone
                );



        String message =

                "Votre code de vérification WhatsApp est : "
                        + code
                        + "\n\n"
                        + "Ce code est valable pendant 5 minutes.";



        Map<String,Object> request =
                new HashMap<>();



        request.put(
                "phone",
                numeroFormate.replace("+", "")
        );


        request.put(
                "message",
                message
        );




        restTemplate.postForObject(
                "http://whatsapp-service:3000/send",
                request,
                String.class
        );

    }

}
//whatsapp-service:3000 docker
//nginx localhost:3005