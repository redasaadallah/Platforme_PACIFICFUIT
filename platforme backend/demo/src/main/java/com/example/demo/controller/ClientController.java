package com.example.demo.controller;

import com.example.demo.dto.ProduitDTO;
import com.example.demo.dto.ProlongementDTO;
import com.example.demo.entity.*;
import com.example.demo.repository.ClientRepository;
import com.example.demo.repository.ProduitRepository;
import com.example.demo.repository.ProlongementRepository;
import com.example.demo.service.CodeGeneratorService;
import com.example.demo.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientRepository clientRepository;
    private final ProduitRepository produitRepository;
    @Autowired
    private  ProlongementRepository prolongementRepository;


    @Autowired
    private CodeGeneratorService codeGeneratorService;

    @Autowired
    private EmailService emailService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    public ClientController(ClientRepository clientRepository, ProduitRepository produitRepository) {
        this.clientRepository = clientRepository;
        this.produitRepository = produitRepository;
    }

    // Ajouter un client
    @PostMapping
    public Client ajouterClient(@RequestBody Client client) {
        return clientRepository.save(client);
    }

    // Récupérer tous les clients
    @GetMapping
    public List<Client> getClients() {
        return clientRepository.findAll();
    }

    // Récupérer un client par CIN
    @GetMapping("/{cin}")
    public Client getClientByCin(@PathVariable String cin) {
        return clientRepository.findById(cin).orElse(null);
    }

    // Supprimer un client par CIN
    @DeleteMapping("/{cin}")
    public String deleteClient(@PathVariable String cin) {
        clientRepository.deleteById(cin);
        return "Client supprimé avec succès";
    }

    // Login avec CIN et mot de passe ===================
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> request) {

        Map<String, Object> response = new HashMap<>();

        String cin = request.get("cin");
        String motDePasse = request.get("motDePasse");
        Optional<Client> optionalClient = clientRepository.findById(cin);

        if (optionalClient.isPresent()) {
            Client client = optionalClient.get();

            // Vérifier le mot de passe
            if (passwordEncoder.matches(motDePasse, client.getMotDePasse())) {

                response.put("success", true);
                response.put("message", "Login réussi");
                response.put("client", client);

            } else {
                response.put("success", false);
                response.put("message", "Le mot de passe est incorrect");
            }

        } else {
            response.put("success", false);
            response.put("message", "Aucun compte n’est associé à ce CIN");
        }

        return response;
    }

//===========================recuperer les produit apres login==========================
@GetMapping("/after-login/{cin}")
public List<ProduitDTO> getProduitsParClient(@PathVariable String cin) {

    List<Produit> produits = produitRepository.findByClientCin(cin);

    String baseUrl = "http://localhost:8080/uploads/";

    return produits.stream().map(p -> {

        Document d = p.getDocument();
        Chambre ch = p.getChambre();
        Client cl = p.getClient();

        // ✔ GET ALL PROLONGEMENTS
        List<Prolongement> prolongements =
                prolongementRepository.findByProduitOrderByDateDemandeAsc(p);

        // ✔ NULL IF EMPTY
        List<ProlongementDTO> prolongementDTOs = new ArrayList<>();

        if (prolongements != null && !prolongements.isEmpty()) {

            prolongementDTOs = new ArrayList<>();

            for (Prolongement pr : prolongements) {

                ProlongementDTO dtoP = new ProlongementDTO();
                dtoP.setId(pr.getIdProlongement());
                dtoP.setDateDemande(pr.getDateDemande());
                dtoP.setAncienneDateFin(pr.getAncienneDateFin());
                dtoP.setNouvelleDateFinDemandee(pr.getNouvelleDateFinDemandee());
                dtoP.setNbJoursAjoutes(pr.getNbJoursAjoutes());
                dtoP.setStatut(pr.getStatut());
                dtoP.setPrix(pr.getPrixProlongement());
                prolongementDTOs.add(dtoP);
            }
        }

        // ✔ PRODUIT DTO
        ProduitDTO dto = new ProduitDTO(
                p.getCodeProduit(),
                p.getNom(),
                p.getQuantite(),
                p.getPrix(),
                p.getTemperatureStockage(),
                p.getDateDebutStockage(),
                p.getDateFinStockage(),
                p.getDureeStockage(),
                p.getDateDemande(),
                p.getStatut(),

                d != null ? baseUrl + d.getFacture() : null,
                d != null ? baseUrl + d.getOnssa() : null,
                d != null ? baseUrl + d.getRc() : null,

                cl != null ? cl.getCin() : null,
                cl != null ? cl.getNom() : null,
                cl != null ? cl.getEmail() : null,
                cl != null ? cl.getTelephone() : null,

                ch != null ? ch.getNomChambre() : null,
                ch != null ? ch.getCapacite() : 0,
                ch != null ? ch.getCapaciteDisponible() : 0,
                ch != null ? ch.getTemperature() : 0,
                ch != null && ch.isVisible()
        );

        // ✔ SET PROLONGEMENTS (NULL IF NONE)
        dto.setProlongements(prolongementDTOs);

        return dto;

    }).toList();
}
    //    =========================================le mot de passe aublie======================
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {

        String email = request.get("email");

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.ok(
                    Map.of(
                            "success", false,
                            "message", "Veuillez saisir votre email."
                    )
            );
        }

        Optional<Client> optionalClient = clientRepository.findByEmail(email.trim());

        if (optionalClient.isEmpty()) {
            return ResponseEntity.ok(
                    Map.of(
                            "success", false,
                            "message", "Aucun client trouvé avec cet email."
                    )
            );
        }

        Client client = optionalClient.get();

        String oldPassword = client.getMotDePasse();

        String newPassword = codeGeneratorService.generateUniqueClientPassword();

        String hashedPassword = passwordEncoder.encode(newPassword);

        client.setMotDePasse(hashedPassword);
        clientRepository.save(client);

        try {
            emailService.sendNewPasswordEmail(client.getEmail(), newPassword);
        } catch (MailException e) {

            // Restaure l'ancien mot de passe
            client.setMotDePasse(oldPassword);
            clientRepository.save(client);

            return ResponseEntity.ok(
                    Map.of(
                            "success", false,
                            "message", "Erreur lors de l'envoi de l'email. Le mot de passe n'a pas été modifié."
                    )
            );
        }

        // Succès
        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message", "Un nouveau mot de passe a été envoyé à votre email."
                )
        );
    }

//============================pour changer le email et le telephone==========================
@PutMapping("/{id}")
public ResponseEntity<?> updateClient(@PathVariable String id, @RequestBody Client updatedClient) {
    Optional<Client> optionalClient = clientRepository.findById(id);
    if (!optionalClient.isPresent()) {
        return ResponseEntity.notFound().build();
    }

    Client client = optionalClient.get();
    // ===========================
    //  Vérifier email unique
    // ===========================
    Optional<Client> emailExists = clientRepository.findByEmail(updatedClient.getEmail());
    if (emailExists.isPresent() && !emailExists.get().getCin().equals(id)) {
        return ResponseEntity
                .ok(Map.of("success", "falseEmail",
                        "message","Cet email est déjà utilisé par un autre client"));
    }//  Vérifier téléphone unique
    // ===========================
    Optional<Client> phoneExists = clientRepository.findByTelephone(updatedClient.getTelephone());
    if (phoneExists.isPresent() && !phoneExists.get().getCin().equals(id)) {
        return ResponseEntity
                .ok(Map.of("success", "falseTelephone",
                        "message","Ce numéro de téléphone est déjà utilisé par un autre client"));
    }
    client.setEmail(updatedClient.getEmail());
    client.setTelephone(updatedClient.getTelephone());


    clientRepository.save(client);
    return ResponseEntity.ok(Map.of(
            "success", "true",
            "client", client
    ));
}

//=======================pour le changement du mot de passe================================
    @PostMapping("/change-password")
    public Map<String, Object> changePassword(@RequestBody Map<String, String> request) {

        Map<String, Object> response = new HashMap<>();

        String cin = request.get("cin");
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");

        Optional<Client> optionalClient = clientRepository.findById(cin);

        if (optionalClient.isPresent()) {
            Client client = optionalClient.get();

            // Vérifier l'ancien mot de passe
            if (!passwordEncoder.matches(oldPassword, client.getMotDePasse())) {
                response.put("status", "error");
                response.put("message", "L'ancien mot de passe n'est pas valide");
                return response;
            }

            // Encoder et sauvegarder le nouveau mot de passe
            client.setMotDePasse(passwordEncoder.encode(newPassword));
            Client updatedClient = clientRepository.save(client);

            response.put("status", "success");
            response.put("message", "Mot de passe mis à jour avec succès !");
            response.put("admin", updatedClient); //Retour de l'admin mis à jour

        } else {
            response.put("status", "error");
            response.put("message", "Admin introuvable !");
        }

        return response;
    }
}