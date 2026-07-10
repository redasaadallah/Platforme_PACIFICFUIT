package com.example.demo.service;
import com.example.demo.entity.Client;
import com.example.demo.entity.Produit;
import com.example.demo.entity.Prolongement;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {
    @Autowired
    private PdfService pdfService;
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
//___________________________________________________________________________________
    public void envoyerEmail(Produit produit,String password,boolean envoi,int type,String recu) throws Exception {
        //recuperer le client pour envoyer l'email
        // define the format
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        Client client = produit.getClient();
        String dateCourante = LocalDate.now().format(formatter);
        byte[] pdf =
                pdfService.generatePdf(
                        recu,
                        client.getNom(),
                        client.getEmail(),
                        client.getCin(),
                        client.getTelephone(),
                        produit.getCodeProduit(),
                        produit.getDateDebutStockage().format(formatter),
                        Integer.toString(produit.getDureeStockage()),
                        produit.getDateFinStockage().format(formatter),
                        dateCourante,
                        String.format("%.2f",produit.getPrix()),
                        produit.getNom(),
                        Double.toString(produit.getQuantite()),
                        produit.getChambre().getNomChambre(),
                        Double.toString(produit.getTemperatureStockage()));
//        SimpleMailMessage message = new SimpleMailMessage();
        MimeMessage message =
                mailSender.createMimeMessage();

        MimeMessageHelper helper =
                new MimeMessageHelper(message, true);
        helper.setFrom("tonemail@gmail.com");
        helper.setTo(client.getEmail()); // ici l'email saisi dans le formulaire
        String mtype = null;
        String objet=null;
        if(type==1){
            mtype="stockage";
            objet="Confirmation de votre demande de stockage";
        }else if(type==2){
            mtype="prolongation du stockage";
            objet="Confirmation de votre demande de prolongation";
        }
        helper.setSubject(objet);
        String msg=null;


        if(envoi){
            msg="Bonjour, "+client.getNom()+"\n\n" +
                    "Nous vous informons que votre demande de "+mtype+" du produit "+produit.getNom()+" a été acceptée avec succès.\n\n"+
                    "Vous pouvez désormais accéder à votre espace client pour consulter tous les détails de votre produit stocké.\n\n" +
                    "Pour vous connecter, utilisez :\n"+
                    "Numéro de CIN : "+client.getCin()+"\n"+
                    "Mot de passe : "+password+"\n\n"+
                    "Nous vous remercions pour votre confiance et restons à votre disposition pour toute question.\n\n"+

                    "Cordialement,\n"+
                    "L’équipe PACIFIC FRUIT.";
        }else{
            msg="Bonjour, "+client.getNom()+"\n\n" +
                    "Nous vous informons que votre demande de "+mtype+" du produit "+produit.getNom()+" a été acceptée avec succès.\n\n"+
                    "Vous pouvez désormais accéder à votre espace client pour consulter tous les détails de votre produit stocké.\n\n" +

                    "Nous vous remercions pour votre confiance et restons à votre disposition pour toute question.\n\n"+

                    "Cordialement,\n"+
                    "L’équipe PACIFIC FRUIT.";
        }
        helper.setText(msg);
        helper.addAttachment(
                "recu.pdf",
                new ByteArrayResource(pdf)
        );

        mailSender.send(message);
    }
//    ========================une methode pour la reinitialisation du mot de passe administrateur
    public void sendNewPasswordEmail(String to, String newPassword) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject("Nouveau mot de passe");

        message.setText(
                "Bonjour,\n\n" +
                        "Vous avez demandé la réinitialisation de votre mot de passe.\n\n" +
                        "Votre nouveau mot de passe est : " + newPassword + "\n\n" +
                        "Veuillez vous connecter avec ce mot de passe.\n\n" +
                        "Cordialement."
        );

        mailSender.send(message);
    }
//====================methode pour repondre aux messages des clients
    public void sendMessageEmail(String toEmail, String messageText,String nom,String prenom,String messageClient) throws MailException {

        String fullMessage = "Bonjour " + nom +" "+prenom+ ",\n\n" +
                "Réponse à votre message :\n" +
                messageClient + "\n\n" +
                messageText + "\n\n" +
                "Cordialement,\n" +
                "L’équipe PACIFIC FRUIT";
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Réponse à votre message");
        message.setText(fullMessage);

        mailSender.send(message);
    }
//============================envoyer un email pour un produit refuse
public void sendRefuseEmail(Produit produit, String raison,int type) {

    SimpleMailMessage message = new SimpleMailMessage();
    Client client = produit.getClient();
    message.setTo(client.getEmail());
    String objet=null;
    String genre=null;
    if(type==1){
        objet="Notification de refus de votre demande de stockage";
        genre="stockage";
    }else{
        objet="Notification de refus de votre demande de prolongation";
        genre="prolongation du stockage";
    }
    message.setSubject(objet);

    message.setText(
            "Bonjour, "+client.getNom()+"\n\n" +
                    "Nous vous informons que votre demande de "+genre+" du produit "+produit.getNom()+" n’a pas pu être acceptée.\n\n"+
                    "Raison :\n\n" +
                    raison+"\n\n" +
                    "Nous restons à votre disposition pour toute question ou assistance.\n\n"+

                    "Cordialement,\n"+
                    "L’équipe PACIFIC FRUIT."

    );

    mailSender.send(message);
}
//=============================================================
// 1. Email envoyé 1 jour avant le début du stockage
public void sendEmailBeforeStart(Produit produit) {
    Client client = produit.getClient();
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    String DateDebut = produit.getDateDebutStockage().format(formatter);
    SimpleMailMessage message = new SimpleMailMessage();
    message.setTo(client.getEmail());
    message.setSubject("Rappel – Début de votre stockage dans 1 jour");

    message.setText( "Bonjour " + client.getNom() + ",\n\n" +
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

            "Cordialement,\nL’équipe PACIFIC FRUIT");

    mailSender.send(message);
}

    // 🔔 2. Email envoyé 1 jour avant la fin du stockage
    public void sendEmailBeforeEnd(Produit produit) {
    Client client = produit.getClient();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String DateFin = produit.getDateFinStockage().format(formatter);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(client.getEmail());
        message.setSubject("Rappel – Fin prochaine de votre stockage");

        String body = "Bonjour " + client.getNom() + ",\n\n" +
                "Nous vous rappelons que le stockage de votre produit \"" + produit.getNom() + "\"\n\n" +
                "\" se terminera dans 1 jour.\n\n" +

                "Vous pouvez prolonger la durée de stockage via votre espace client.\n\n" +

                "Informations importantes :\n" +
                "Nom du produit : " + produit.getNom() + "\n" +
                "Quantité en tonne: " + produit.getQuantite() + "\n" +
                "Température de stockage : " + produit.getTemperatureStockage() + " °C\n" +
                "Date fin de stockage : " + DateFin + "\n" +


                "Cordialement,\nL’équipe PACIFIC FRUIT";
        message.setText(body);
        mailSender.send(message);

    }
    public void sendEmailProlongationTomorrow(Prolongement prolongement) {

        Produit produit = prolongement.getProduit();
        Client client = produit.getClient();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(client.getEmail());
        message.setSubject("Rappel – Début de prolongation demain");

        String body =
                "Bonjour " + client.getNom() + ",\n\n" +

                        "Nous vous informons que la prolongation de stockage de votre produit \""
                        + produit.getNom() + "\" commencera demain.\n\n" +

                        "Veuillez obligatoirement présenter le reçu de prolongation lors de votre visite.\n\n" +

                        "Informations importantes :\n" +
                        "Nouvelle date de fin : "
                        + prolongement.getNouvelleDateFinDemandee().format(formatter) + "\n" +

                        "Prix de la prolongation : " + prolongement.getPrixProlongement() + " DH\n\n" +

                        "Merci de prendre en compte cette mise à jour.\n\n" +

                        "Cordialement,\nL’équipe PACIFIC FRUIT";

        message.setText(body);

        mailSender.send(message);
    }
    public void sendEmailProlongationEndTomorrow(Prolongement prolongement) {

        Produit produit = prolongement.getProduit();
        Client client = produit.getClient();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(client.getEmail());
        message.setSubject("Rappel – Fin de prolongation demain");

        String body =
                "Bonjour " + client.getNom() + ",\n\n" +

                        "Nous vous rappelons que la prolongation de stockage de votre produit \""
                        + produit.getNom() + "\" se terminera demain.\n\n" +

                        "Date de fin : "
                        + prolongement.getNouvelleDateFinDemandee().format(formatter) + "\n\n" +


                        "Vous pouvez également demander une nouvelle prolongation directement depuis votre espace client.\n\n" +

                        "Cordialement,\nL’équipe PACIFIC FRUIT";

        message.setText(body);

        mailSender.send(message);
    }
}