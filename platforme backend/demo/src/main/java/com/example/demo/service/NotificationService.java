package com.example.demo.service;
import com.example.demo.entity.Prolongement;
import com.example.demo.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.entity.Produit;

import java.time.LocalDate;
import java.util.List;

@Service
public class NotificationService {
    @Autowired
    WhatsAppService whatsappService;
    @Autowired
    private ProduitRepository produitRepository;
    @Autowired
    private ProlongementRepository prolongementRepository;
    @Autowired
    private  EmailService emailService;



    public void checkStorageDates() {

        LocalDate tomorrow = LocalDate.now().plusDays(1);

        List<Produit> produits = produitRepository.findAll();

        for (Produit r : produits) {

            // début stockage demain
            if (r.getDateDebutStockage().equals(tomorrow)) {
                emailService.sendEmailBeforeStart(r);
                whatsappService.sendMessageBeforeStart(r);
            }

            // fin stockage demain
            if (r.getDateFinStockage().equals(tomorrow)) {
                emailService.sendEmailBeforeEnd(r);
                whatsappService.sendMessageBeforeEnd(r);
            }
        }
        List<Prolongement> prolongements = prolongementRepository.findAll();

        for (Prolongement p : prolongements) {

            // début prolongation demain
            if (p.getAncienneDateFin().equals(tomorrow)) {
                emailService.sendEmailProlongationTomorrow(p);
                whatsappService.sendMessageProlongationTomorrow(p);
            }

            // fin prolongation demain
            if (p.getNouvelleDateFinDemandee().equals(tomorrow)) {
                emailService.sendEmailProlongationEndTomorrow(p);
                whatsappService.sendMessageProlongationEndTomorrow(p);
            }
        }


    }
}
