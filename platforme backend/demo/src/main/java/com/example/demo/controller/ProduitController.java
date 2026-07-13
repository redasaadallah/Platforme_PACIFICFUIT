package com.example.demo.controller;

import com.example.demo.dto.ProduitDTO;
import com.example.demo.entity.Chambre;
import com.example.demo.entity.Client;
import com.example.demo.entity.Produit;
import com.example.demo.entity.Document;
import com.example.demo.repository.*;
import com.example.demo.service.CodeGeneratorService;
import com.example.demo.service.EmailService;
import com.example.demo.service.PdfService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.demo.dto.DemandeCompletDTO;
import org.springframework.core.io.Resource;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import jakarta.servlet.http.HttpServletRequest;
import com.example.demo.service.TwilioService;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/produits")
public class ProduitController {

    @Autowired
    private ProduitRepository produitRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ChambreRepository chambreRepository;

    @Autowired
    private ProlongementRepository prolongementRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CodeGeneratorService codeGeneratorService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private TwilioService twilioService;

    @Value("${app.base-url}")
    private String baseUrl;

    @Autowired
    private PdfService pdfService;

    @Autowired
    private SimpMessagingTemplate template;



//    // Récupérer les produits d'un client par son CIN
//    @GetMapping("/produits/client/{cin}")
//    public List<ProduitDTO> getProduitsByClient(@PathVariable String cin) {
//
//        String baseUrl = "http://localhost:8080/uploads/";
//
//
//        // Récupérer tous les produits du client
//        List<Produit> produits = produitRepository.findByClientCin(cin);
//
//        // Mapper chaque produit vers ProduitDTO complet
//        return produits.stream().map(p -> {
//            var d = p.getDocument();
//            var c = p.getClient();
//            var ch = p.getChambre();
//
//            return new ProduitDTO(
//                    p.getCodeProduit(),
//                    p.getNom(),
//                    p.getQuantite(),
//                    p.getPrix(),
//                    p.getTemperatureStockage(),
//                    p.getDateDebutStockage(),
//                    p.getDateFinStockage(),
//                    p.getDureeStockage(),
//                    p.getDateDemande(),
//                    p.getStatut(),
//
//                    d != null ? baseUrl + d.getFacture() : null,
//                    d != null ? baseUrl + d.getOnssa() : null,
//                    d != null ? baseUrl + d.getRc() : null,
//
//                    c != null ? c.getCin() : null,
//                    c != null ? c.getNom() : null,
//                    c != null ? c.getEmail() : null,
//                    c != null ? c.getTelephone() : null,
//
//                    ch != null ? ch.getNomChambre() : null,
//                    ch != null ? ch.getCapacite() : 0,
//                    ch != null ? ch.getCapaciteDisponible() : 0,
//                    ch != null ? ch.getTemperature() : 0,
//                    ch != null && ch.isVisible()
//
//            );
//        }).toList();
//    }
//    -------------------------------------------------------------------
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
@PostMapping("/add")
@Transactional
public ResponseEntity<?> ajouterClientEtProduits(
        @RequestPart("data") String data,
        HttpServletRequest request
) throws Exception {

    JsonNode root = objectMapper.readTree(data);
    JsonNode clientNode = root.get("client");
    JsonNode produitsNode = root.get("produits");
    String email = clientNode.get("email").asText();
    String telephone = clientNode.get("telephone").asText();


    // ====================================
    // 2 Ajouter le client s'il n'existe pas
    // ====================================
    String cin = clientNode.get("cin").asText();
    Optional<Client> optionalClient = clientRepository.findById(cin);
    Client client;

    if (optionalClient.isPresent()) {
        client = optionalClient.get();
        if(!client.getEmail().equals(email)) {
        return ResponseEntity
                .ok(Map.of("success", false, "message", "L'email saisi ne correspond pas à votre compte existant"));
            }
            if(!client.getTelephone().equals(telephone)) {
            return ResponseEntity
                    .ok(Map.of("success", false, "message", "Le numéro de téléphone saisi ne correspond pas à votre compte existant"));
            }

    } else {
        // ====================================
        // 1 Vérifier email et téléphone
        // ====================================

        if(clientRepository.findByEmail(email).isPresent()) {
            return ResponseEntity
                    .ok(Map.of("success", false, "message", "Cet email est déjà utilisé par un autre client"));
        }

        if(clientRepository.findByTelephone(telephone).isPresent()) {
            return ResponseEntity
                    .ok(Map.of("success", false, "message", "Ce numéro de téléphone est déjà utilisé par un autre client"));
        }
        client = new Client();
        client.setCin(cin);
        client.setNom(clientNode.get("nom").asText());
        client.setEmail(email);
        client.setTelephone(telephone);
        String password = codeGeneratorService.generateUniqueClientPassword();
        client.setMotDePasse(password);
        client.setRole("CLIENT");
        client = clientRepository.save(client);
    }

    // ====================================
    // 3 Récupérer les fichiers multipart
    // ====================================
    MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;

    // ====================================
    // 4 Ajouter les produits et documents
    // ====================================
//    List<Produit> produitsEnregistres = new ArrayList<>();
    for (int i = 0; i < produitsNode.size(); i++) {
        JsonNode produitNode = produitsNode.get(i);

        Produit produit = new Produit();
        String code = codeGeneratorService.generateUniqueProductCode();
        produit.setCodeProduit(code);
        produit.setNom(produitNode.get("nom").asText());
        produit.setQuantite(produitNode.get("quantite").asDouble());
        produit.setPrix(produitNode.get("prix").asDouble());
        produit.setTemperatureStockage(produitNode.get("temperatureStockage").asDouble());
        produit.setDateDebutStockage(LocalDate.parse(produitNode.get("dateDebutStockage").asText()));
        produit.setDateFinStockage(LocalDate.parse(produitNode.get("dateFinStockage").asText()));
        produit.setDureeStockage(produitNode.get("dureeStockage").asInt());
        produit.setDateDemande(LocalDateTime.now());
        produit.setStatut(produitNode.get("statut").asText());

        // Associer le client
        produit.setClient(client);

        // Associer la chambre via idChambre
        Long idChambre = produitNode.get("id").asLong();
        var chambre = chambreRepository.findById(idChambre)
                .orElseThrow(() -> new RuntimeException("Chambre introuvable : " + idChambre));
        produit.setChambre(chambre);

        Produit savedProduit = produitRepository.save(produit);
//        produitsEnregistres.add(savedProduit);

        // Fichiers
        MultipartFile factureFile = multipartRequest.getFile("facture_" + i);
        MultipartFile oncaFile = multipartRequest.getFile("onca_" + i);
        MultipartFile rcFile = multipartRequest.getFile("rc_" + i);

        String factureName = saveFile(factureFile);
        String oncaName = saveFile(oncaFile);
        String rcName = saveFile(rcFile);

        Document document = new Document();
        document.setFacture(factureName);
        document.setOnca(oncaName);
        document.setRc(rcName);

        // Associer le document au produit
        document.setProduit(savedProduit);
        documentRepository.save(document);
        // 2. Notify admins
        template.convertAndSend(
                "/topic/demandes",
                "demande"
        );
    }

    // ====================================
    // 5 Retourner un message avec succès
    // ====================================
    return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Client, produits et documents ajoutés avec succès"
//            "produits", produitsEnregistres
    ));
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    private String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }
        Path uploadPath = Paths.get(System.getProperty("user.dir"), "uploads");
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return fileName;
    }
//===================================================================
//=========================accepter une reservation==================
    @PutMapping("/accepter/{code}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Produit accepterProduit(@PathVariable String code) throws Exception {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        Produit produit = produitRepository.findById(code)
                .orElseThrow(() -> new RuntimeException("Reservation introuvable"));
        produit.setStatut("accepted");
        Chambre chambre = produit.getChambre();
        Client client=produit.getClient();
        // Vérifier si le client a déjà une réservation acceptée
        List<Produit> produitsAcceptes = produitRepository.findByClientAndStatutIn(client, List.of("accepted", "ended"));
        boolean envoyerMotDePasse = produitsAcceptes.isEmpty(); // true si c’est la première réservation acceptée
        String motpass=client.getMotDePasse();
        Double reste=chambre.getCapaciteDisponible()-produit.getQuantite();
        chambre.setCapaciteDisponible(reste);
        // Générer le PDF

        byte[] pdfBytes = pdfService.generatePdf(
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

        // Sauvegarder le PDF
        String fileName = pdfService.savePdf(pdfBytes, produit.getCodeProduit());

        // Créer l’URL du PDF
        String pdfUrl = baseUrl + "/api/produits/recus/" + fileName;
        int type=1;
        //envoyer le email
        emailService.envoyerEmail(produit,motpass,envoyerMotDePasse,type,"Reçu de Réservation");
        //emvoyer le message whatsapp
        twilioService.envoyerMessageWhatsApp(produit,motpass,pdfUrl,fileName,envoyerMotDePasse,type);
        if(envoyerMotDePasse){
        client.setMotDePasse(encoder.encode(client.getMotDePasse()));
        }
        template.convertAndSend(
                "/topic/reservations",
                "reservation"
        );
        return produitRepository.save(produit);
    }

//________________________________________________________________________


    @GetMapping("/recus/{fileName}")
    public ResponseEntity<Resource> getRecu(@PathVariable String fileName) throws Exception {

        Path path = Paths.get("uploads/recus")
                .resolve(fileName)
                .normalize();

        Resource resource = new UrlResource(path.toUri());

        if (!resource.exists()) {
            throw new RuntimeException("Reçu introuvable : " + fileName);
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                .body(resource);
    }



//============================================================================
    //===========================refuse une reservation=======================
    @DeleteMapping("/refuser/{code}/{message}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String refuserReservation(@PathVariable String code, @PathVariable String message) throws Exception {

        Produit produit = produitRepository.findById(code)
                .orElseThrow(() -> new RuntimeException("Produit introuvable"));

        //envoyer le email

            emailService.sendRefuseEmail(produit, message,1);
            twilioService.envoyerMessageRefus(produit,message,1);
        produit.setStatut("refused");
        produitRepository.save(produit);
        template.convertAndSend(
                "/topic/reservations",
                "reservation"
        );
        return "refusée avec succès";
    }
//==============================================================================
    //===========================suprimer une reservation=======================
    @DeleteMapping("/suprimer/{code}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String supprimerReservation(@PathVariable String code) throws Exception {

        Produit produit = produitRepository.findById(code)
                .orElseThrow(() -> new RuntimeException("Produit introuvable"));
        produit.setStatut("ended");
        produitRepository.save(produit);
        Chambre chambre = produit.getChambre();

        // check if there is accepted prolongation linked
        boolean hasActiveProlongation =
                prolongementRepository.existsByProduitAndStatut(
                        produit, "accepted"
                );

        if (!hasActiveProlongation) {

            // only then we free capacity
            chambre.setCapaciteDisponible(
                    chambre.getCapaciteDisponible() + produit.getQuantite()
            );

            chambreRepository.save(chambre);
        }
        return "Supprimé avec succès";
    }


//=====================================telecharger le recu
    @GetMapping("/download/{codeProduit}")
    public ResponseEntity<byte[]> telechargerRecu(@PathVariable String codeProduit) throws Exception {

        Produit produit = produitRepository.findById(codeProduit)
                .orElseThrow(() -> new RuntimeException("Produit introuvable"));

        // Générer PDF en mémoire
        byte[] pdfBytes = pdfService.generatePdf(
                "Reçu de Réservation",
                produit.getClient().getNom(),
                produit.getClient().getEmail(),
                produit.getClient().getCin(),
                produit.getClient().getTelephone(),
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

        // Retourner le PDF directement, sans le stocker
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"recu_" + codeProduit + ".pdf\"")
                .body(pdfBytes);
    }
//===================================================
//===================pour les demande complet en accepted
@GetMapping("/demandes-accepted")
@PreAuthorize("hasAnyAuthority('ADMIN')")
public List<DemandeCompletDTO> getDemandesAccepted() {

    List<DemandeCompletDTO> demandes = new ArrayList<>();
    String baseUrl = "http://localhost:8080/uploads/";

    // Prolongements en attente
    prolongementRepository.findByStatut("accepted").forEach(p -> {
        DemandeCompletDTO dto = new DemandeCompletDTO();
        dto.setType("prolongation");

        Produit prod = p.getProduit();
        dto.setIdProlongement(p.getIdProlongement());
        dto.setNomProduit(prod.getNom());
        dto.setPrixProduit(prod.getPrix());
        dto.setQuantiteProduit(prod.getQuantite());
        dto.setTemperatureStockage(prod.getTemperatureStockage());
        dto.setStatutProduit(p.getStatut());
        dto.setDateDebutStockage(p.getAncienneDateFin());
        dto.setDateFinStockage(p.getNouvelleDateFinDemandee());
        dto.setDureeStockage(p.getNbJoursAjoutes());

        // Chambre
        if(prod.getChambre() != null) {
            dto.setNomChambre(prod.getChambre().getNomChambre());
            dto.setCapaciteDisponible(prod.getChambre().getCapaciteDisponible());

        }

        // Document
        if(prod.getDocument() != null) {
            dto.setIdDocument(prod.getDocument().getIdDocument());
            dto.setFacture(baseUrl+prod.getDocument().getFacture());
            dto.setOnssa(baseUrl+prod.getDocument().getOnssa());
            dto.setRc(baseUrl+prod.getDocument().getRc());
        }

        // Client
        Client client = prod.getClient();
        dto.setCinClient(client.getCin());
        dto.setNomClient(client.getNom());
        dto.setEmailClient(client.getEmail());
        dto.setTelephoneClient(client.getTelephone());

        dto.setDateDemande(p.getDateDemande());

        demandes.add(dto);
    });

    // Produits qui sont des réservations en attente
    // On suppose que pour une réservation, le produit a un statut spécifique "reservationEnAttente"
    List<Produit> produitsEnAttente = produitRepository.findByStatut("accepted");
    produitsEnAttente.forEach(prod -> {
        DemandeCompletDTO dto = new DemandeCompletDTO();
        dto.setType("reservation");
        dto.setCodeProduit(prod.getCodeProduit());
        dto.setNomProduit(prod.getNom());
        dto.setPrixProduit(prod.getPrix());
        dto.setQuantiteProduit(prod.getQuantite());
        dto.setTemperatureStockage(prod.getTemperatureStockage());
        dto.setStatutProduit(prod.getStatut());
        dto.setDateDebutStockage(prod.getDateDebutStockage());
        dto.setDureeStockage(prod.getDureeStockage());
        dto.setDateFinStockage(prod.getDateFinStockage());

        // Chambre
        if(prod.getChambre() != null) {
            dto.setNomChambre(prod.getChambre().getNomChambre());
            dto.setCapaciteDisponible(prod.getChambre().getCapaciteDisponible());


        }

        // Document
        if(prod.getDocument() != null) {
            dto.setIdDocument(prod.getDocument().getIdDocument());
            dto.setFacture(baseUrl+prod.getDocument().getFacture());
            dto.setOnssa(baseUrl+prod.getDocument().getOnssa());
            dto.setRc(baseUrl+prod.getDocument().getRc());
        }

        // Client
        Client client = prod.getClient();
        dto.setCinClient(client.getCin());
        dto.setNomClient(client.getNom());
        dto.setEmailClient(client.getEmail());
        dto.setTelephoneClient(client.getTelephone());

        dto.setDateDemande(prod.getDateDemande());

        demandes.add(dto);
    });

    // Trier par date de demande décroissante
    demandes.sort(Comparator.comparing(DemandeCompletDTO::getDateDemande));


    return demandes;
}
    //===================pour les demande complet en atente
    @GetMapping("/demandes-en-attente")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public List<DemandeCompletDTO> getDemandesEnAttente() {

        List<DemandeCompletDTO> demandes = new ArrayList<>();
        String baseUrl = "http://localhost:8080/uploads/";

        // Prolongements en attente
        prolongementRepository.findByStatut("enAtente").forEach(p -> {
            DemandeCompletDTO dto = new DemandeCompletDTO();
            dto.setType("prolongation");

            Produit prod = p.getProduit();
            dto.setIdProlongement(p.getIdProlongement());
            dto.setNomProduit(prod.getNom());
            dto.setPrixProduit(prod.getPrix());
            dto.setQuantiteProduit(prod.getQuantite());
            dto.setTemperatureStockage(prod.getTemperatureStockage());
            dto.setStatutProduit(p.getStatut());
            dto.setDateDebutStockage(p.getAncienneDateFin());
            dto.setDateFinStockage(p.getNouvelleDateFinDemandee());
            dto.setDureeStockage(p.getNbJoursAjoutes());

            // Chambre
            if(prod.getChambre() != null) {
                dto.setNomChambre(prod.getChambre().getNomChambre());
                dto.setCapaciteDisponible(prod.getChambre().getCapaciteDisponible());

            }

            // Document
            if(prod.getDocument() != null) {
                dto.setIdDocument(prod.getDocument().getIdDocument());
                dto.setFacture(baseUrl+prod.getDocument().getFacture());
                dto.setOnssa(baseUrl+prod.getDocument().getOnssa());
                dto.setRc(baseUrl+prod.getDocument().getRc());
            }

            // Client
            Client client = prod.getClient();
            dto.setCinClient(client.getCin());
            dto.setNomClient(client.getNom());
            dto.setEmailClient(client.getEmail());
            dto.setTelephoneClient(client.getTelephone());

            dto.setDateDemande(p.getDateDemande());

            demandes.add(dto);
        });

        // Produits qui sont des réservations en attente
        // On suppose que pour une réservation, le produit a un statut spécifique "reservationEnAttente"
        List<Produit> produitsEnAttente = produitRepository.findByStatut("enAtente");
        produitsEnAttente.forEach(prod -> {
            DemandeCompletDTO dto = new DemandeCompletDTO();
            dto.setType("reservation");
            dto.setCodeProduit(prod.getCodeProduit());
            dto.setNomProduit(prod.getNom());
            dto.setPrixProduit(prod.getPrix());
            dto.setQuantiteProduit(prod.getQuantite());
            dto.setTemperatureStockage(prod.getTemperatureStockage());
            dto.setStatutProduit(prod.getStatut());
            dto.setDateDebutStockage(prod.getDateDebutStockage());
            dto.setDureeStockage(prod.getDureeStockage());
            dto.setDateFinStockage(prod.getDateFinStockage());

            // Chambre
            if(prod.getChambre() != null) {
                dto.setNomChambre(prod.getChambre().getNomChambre());
                dto.setCapaciteDisponible(prod.getChambre().getCapaciteDisponible());


            }

            // Document
            if(prod.getDocument() != null) {
                dto.setIdDocument(prod.getDocument().getIdDocument());
                dto.setFacture(baseUrl+prod.getDocument().getFacture());
                dto.setOnssa(baseUrl+prod.getDocument().getOnssa());
                dto.setRc(baseUrl+prod.getDocument().getRc());
            }

            // Client
            Client client = prod.getClient();
            dto.setCinClient(client.getCin());
            dto.setNomClient(client.getNom());
            dto.setEmailClient(client.getEmail());
            dto.setTelephoneClient(client.getTelephone());

            dto.setDateDemande(prod.getDateDemande());

            demandes.add(dto);
        });

        // Trier par date de demande décroissante
        demandes.sort(Comparator.comparing(DemandeCompletDTO::getDateDemande));


        return demandes;
    }
}