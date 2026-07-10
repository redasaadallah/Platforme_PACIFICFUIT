package com.example.demo.service;

import com.example.demo.entity.Client;
import com.example.demo.entity.Prolongement;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;

import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;
import com.example.demo.entity.Produit;

import java.io.File;
import java.net.URI;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class TwilioService {

    @Value("${twilio.accountSid}")
    private String accountSid;

    @Value("${twilio.authToken}")
    private String authToken;

    @Value("${twilio.whatsappFrom}")
    private String whatsappFrom;

    @PostConstruct
    public void init() {
        Twilio.init(accountSid, authToken);
    }
//=================envoyer un message pour repondres aux messagesduclients=============================
public void sendMessagePhone(String telephone, String messageText,String nom,String prenom,String messageClient) throws MailException {
    String numeroFormate = formaterNumeroMaroc(telephone);
    Message textMessage = Message.creator(
            new PhoneNumber("whatsapp:" + numeroFormate),
            new PhoneNumber("whatsapp:+14155238886"),
    "Bonjour " + nom +" "+prenom+ ",\n\n" +
            "Réponse à votre message :\n" +
            messageClient + "\n\n" +
            messageText + "\n\n" +
            "Cordialement,\n" +
            "L’équipe PACIFIC FRUIT").create();
}
//=========================pour envoyer le message dacceptation=======================================
public void envoyerMessageWhatsApp(Produit produit, String password, String pdfUrl, String fileName, boolean envoi,int type) {
        Client client=produit.getClient();
    String numeroFormate = formaterNumeroMaroc(client.getTelephone());
    String msg=null;
    String mtype = null;
    if(type==1){
        mtype="stockage";
    }else if(type==2){
        mtype="prolongation";
    }
    // 1. Send text message
    if(envoi) {
        msg="Bonjour, "+client.getNom()+"\n\n" +
                "Nous vous informons que votre demande de stockage du produit "+produit.getNom()+" a été acceptée avec succès.\n\n"+
                "Vous pouvez désormais accéder à votre espace client pour consulter tous les détails de votre produit stocké.\n\n" +
                "Pour vous connecter, utilisez :\n"+
                "Numéro de CIN : "+client.getCin()+"\n"+
                "Mot de passe : "+password+"\n\n"+
                "Nous vous remercions pour votre confiance et restons à votre disposition pour toute question.\n\n"+

                "Cordialement,\n"+
                "L’équipe PACIFIC FRUIT.";
        Message textMessage = Message.creator(
                new PhoneNumber("whatsapp:" + numeroFormate),
                new PhoneNumber("whatsapp:+14155238886"),
                msg
        ).create();


        // 2. Send PDF
        Message pdfMessage = Message.creator(
                        new PhoneNumber("whatsapp:" + numeroFormate),
                        new PhoneNumber("whatsapp:+14155238886"),
                        ""
                )
                .setMediaUrl(List.of(URI.create(pdfUrl)))
                .create();
    }else{
        msg="Bonjour, "+client.getNom()+"\n\n" +
                "Nous vous informons que votre demande de "+mtype+" du produit "+produit.getNom()+" a été acceptée avec succès.\n\n"+
                "Vous pouvez désormais accéder à votre espace client pour consulter tous les détails de votre produit stocké.\n\n" +

                "Nous vous remercions pour votre confiance et restons à votre disposition pour toute question.\n\n"+

                "Cordialement,\n"+
                "L’équipe PACIFIC FRUIT.";
        Message textMessage = Message.creator(
                new PhoneNumber("whatsapp:" + numeroFormate),
                new PhoneNumber("whatsapp:+14155238886"),
                msg
        ).create();
        // 2. Send PDF
        Message pdfMessage = Message.creator(
                        new PhoneNumber("whatsapp:" + numeroFormate),
                        new PhoneNumber("whatsapp:+14155238886"),
                        ""
                )
                .setMediaUrl(List.of(URI.create(pdfUrl)))
                .create();
    }

//    // 3. DELETE FILE (correct)
//    deleteFile(fileName);ginve
}
//==================================pour le message de refus dune reservation===================================
    public void envoyerMessageRefus(Produit produit,String raison,int type){
        Client client=produit.getClient();
        String numeroFormate = formaterNumeroMaroc(client.getTelephone());
        String genre=null;
        if(type==1){
            genre="stockage";
        }else{
            genre="prolongation du stockage";
        }
        Message textMessage = Message.creator(
                new PhoneNumber("whatsapp:" + numeroFormate),
                new PhoneNumber("whatsapp:+14155238886"),
                "Bonjour, "+client.getNom()+"\n\n" +
                        "Nous vous informons que votre demande de "+genre+" du produit "+produit.getNom()+" n’a pas pu être acceptée.\n\n"+
                        "Raison :\n\n" +
                        raison+"\n\n" +
                        "Nous restons à votre disposition pour toute question ou assistance.\n\n"+

                        "Cordialement,\n"+
                        "L’équipe PACIFIC FRUIT."
        ).create();
    }
    public void deleteFile(String fileName) {
        File file = new File("uploads/recus/" + fileName);


    }
//=================================================================================
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
    //=============================================================
// 1. message whatsapp envoyé 1 jour avant le début du stockage
    public void sendMessageBeforeStart(Produit produit) {
        Client client=produit.getClient();
        String numeroFormate = formaterNumeroMaroc(client.getTelephone());
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String DateDebut = produit.getDateDebutStockage().format(formatter);
        Message textMessage = Message.creator(
                new PhoneNumber("whatsapp:" + numeroFormate),
                new PhoneNumber("whatsapp:+14155238886"),
         "Bonjour " + client.getNom() + ",\n\n" +
                "Nous vous rappelons que votre produit \"" + produit.getNom() + "\"\n\n" +
                "sera mis en stockage dans 1 jour.\n\n" +

                "Merci de bien vouloir présenter votre reçu de stockage le jour du dépôt.\n\n" +

                "Informations importantes :\n\n" +
                "Nom du produit : " + produit.getNom() + "\n" +
                "Quantité en tonne: " + produit.getQuantite() + "\n" +
                "Température de stockage : " + produit.getTemperatureStockage() + " °C\n" +
                "Date début de stockage : " + DateDebut + "\n" +
                "Durée de stockage : " + produit.getDureeStockage() + " jours\n\n" +
                "Prix de stockage : " + produit.getPrix() + " DH \n\n" +

                "Cordialement,\nL’équipe PACIFIC FRUIT").create();
    }

    //  2. message whatsapp envoyé 1 jour avant la fin du stockage
    public void sendMessageBeforeEnd(Produit produit) {
        Client client = produit.getClient();
        String numeroFormate = formaterNumeroMaroc(client.getTelephone());
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String DateFin = produit.getDateFinStockage().format(formatter);
        Message textMessage = Message.creator(
                new PhoneNumber("whatsapp:" + numeroFormate),
                new PhoneNumber("whatsapp:+14155238886"),


        "Bonjour " + client.getNom() + ",\n\n" +
                "Nous vous rappelons que le stockage de votre produit \"" + produit.getNom() + "\"\n\n" +
                "\" se terminera dans 1 jour.\n\n" +

                "Vous pouvez prolonger la durée de stockage via votre espace client.\n\n" +

                "Informations importantes :\n" +
                "Nom du produit : " + produit.getNom() + "\n" +
                "Quantité en tonne: " + produit.getQuantite() + "\n" +
                "Température de stockage : " + produit.getTemperatureStockage() + " °C\n" +
                "Date fin de stockage : " + DateFin + "\n" +


                "Cordialement,\nL’équipe PACIFIC FRUIT").create();

    }
//    =============envoyer un message whatsapp avant une prolonation commence
    public void sendMessageProlongationTomorrow(Prolongement prolongement) {

        Produit produit = prolongement.getProduit();
        Client client = produit.getClient();
        String numeroFormate = formaterNumeroMaroc(client.getTelephone());
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");



        Message textMessage = Message.creator(
                new PhoneNumber("whatsapp:" + numeroFormate),
                new PhoneNumber("whatsapp:+14155238886"),
                "Bonjour " + client.getNom() + ",\n\n" +

                        "Nous vous informons que la prolongation de stockage de votre produit \""
                        + produit.getNom() + "\" commencera demain.\n\n" +

                        "Veuillez obligatoirement présenter le reçu de prolongation lors de votre visite.\n\n" +

                        "Informations importantes :\n" +
                        "Nouvelle date de fin : "
                        + prolongement.getNouvelleDateFinDemandee().format(formatter) + "\n" +

                        "Prix de la prolongation : " + prolongement.getPrixProlongement() + " DH\n\n" +

                        "Merci de prendre en compte cette mise à jour.\n\n" +

                        "Cordialement,\nL’équipe PACIFIC FRUIT").create();
    }
    public void sendMessageProlongationEndTomorrow(Prolongement prolongement) {

        Produit produit = prolongement.getProduit();
        Client client = produit.getClient();
        String numeroFormate = formaterNumeroMaroc(client.getTelephone());
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        Message textMessage = Message.creator(
                new PhoneNumber("whatsapp:" + numeroFormate),
                new PhoneNumber("whatsapp:+14155238886"),

                "Bonjour " + client.getNom() + ",\n\n" +

                        "Nous vous rappelons que la prolongation de stockage de votre produit \""
                        + produit.getNom() + "\" se terminera demain.\n\n" +

                        "Date de fin : "
                        + prolongement.getNouvelleDateFinDemandee().format(formatter) + "\n\n" +


                        "Vous pouvez également demander une nouvelle prolongation directement depuis votre espace client.\n\n" +

                        "Cordialement,\nL’équipe PACIFIC FRUIT").create();
    }
}