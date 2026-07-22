package com.example.demo.controller;

import com.example.demo.dto.ProduitDTO;
import com.example.demo.dto.ProlongementDTO;
import com.example.demo.entity.*;
import com.example.demo.repository.ClientRepository;
import com.example.demo.repository.ProduitRepository;
import com.example.demo.repository.ProlongementRepository;
import com.example.demo.repository.VerificationCodeRepository;
import com.example.demo.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/client")
public class ClientController {

    private final ClientRepository clientRepository;
    private final ProduitRepository produitRepository;
    @Autowired
    private  ProlongementRepository prolongementRepository;

    @Autowired
    private VerificationCodeRepository verificationRepository;


    @Autowired
    private CodeGeneratorService codeGeneratorService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private TwilioService twilioService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private RefreshTokenService refreshTokenService;

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

//    // Login avec CIN et mot de passe ===================

@PostMapping("/login")
public ResponseEntity<?> login(
        @RequestBody Map<String, String> request
) {


    String cin = request.get("cin");

    String motDePasse = request.get("motDePasse");
    Map<String,Object> response =
            new HashMap<>();


    Optional<Client> clientOptional = clientRepository.findById(cin);

    if (clientOptional.isEmpty()) {
        response.put(
                "success",
                false
        );
        response.put(
                "message",
                "CIN ou mot de passe incorrect."
        );
        return ResponseEntity.ok(
                response
        );
    }

    Client client = clientOptional.get();



    // Check password

    if (!passwordEncoder.matches(
            motDePasse,
            client.getMotDePasse()
    )) {
        response.put(
                "success",
                false
        );
        response.put(
                "message",
                "CIN ou mot de passe incorrect."
        );

        return ResponseEntity
                .ok(response);
    }



    // Create JWT Access Token

    String accessToken =
            jwtService.generateToken(
                    client.getCin(),
                    "CLIENT"
            );


    refreshTokenService.deleteOldToken(
            client.getCin(),
            "CLIENT"
    );
    // Create Refresh Token

    RefreshToken refreshToken =
            refreshTokenService.createRefreshToken(
                    client.getCin(),
                    "CLIENT"
            );






    response.put(
            "success",
            true
    );


    response.put(
            "accessToken",
            accessToken
    );


    response.put(
            "refreshToken",
            refreshToken.getToken()
    );


    response.put(
            "type",
            "CLIENT"
    );


    response.put(
            "client",
            client
    );



    return ResponseEntity.ok(response);

}
//===========================recuperer les produit apres login==========================
@GetMapping("/after-login")
public List<ProduitDTO> getProduitsParClient() {
//    ********************************************
    Authentication authentication =
            SecurityContextHolder
                    .getContext()
                    .getAuthentication();


    String cin =
            authentication.getName();
//    *************************************************
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
//=============envoyer le code de verification lors de demandedune reservation =============
@PostMapping("/sendCode")
public ResponseEntity<?> send(
        @RequestBody Map<String,String> data
){


    String email=data.get("email");

    String telephone=data.get("telephone");



    String emailCode =
            String.valueOf(
                    new Random().nextInt(900000)+100000
            );


    String whatsappCode =
            String.valueOf(
                    new Random().nextInt(900000)+100000
            );



    VerificationCode v=new VerificationCode();


    v.setEmail(email);

    v.setTelephone(telephone);

    v.setEmailCode(emailCode);

    v.setWhatsappCode(whatsappCode);


    v.setExpiration(
            LocalDateTime.now().plusMinutes(5)
    );



    verificationRepository.save(v);



    emailService.envoyerCode(
            email,
            emailCode
    );



    twilioService.envoyerOTP(
            telephone,
            whatsappCode
    );



    return ResponseEntity.ok(
            Map.of(
                    "success",true
            )
    );


}
//+++++++++++++++++++++++++pour recevoir le code de verification lors du demande
@PostMapping("/verify")
public ResponseEntity<?> verify(
        @RequestBody Map<String,String> data
){


    VerificationCode v =
            verificationRepository
                    .findTopByTelephoneOrderByIdDesc(
                            data.get("telephone")
                    );



    if(v==null){

        return ResponseEntity.badRequest()
                .body(
                        Map.of(
                                "success",false,
                                "message",
                                "Code introuvable"
                        )
                );

    }




    if(
            !v.getEmailCode()
                    .equals(data.get("emailCode"))

                    ||

                    !v.getWhatsappCode()
                            .equals(data.get("whatsappCode"))

    ){

        return ResponseEntity.badRequest()
                .body(
                        Map.of(
                                "success",false,
                                "message",
                                "L'un des deux codes ou les deux codes sont incorrects."
                        )
                );

    }



    v.setVerified(true);


    verificationRepository.save(v);



    return ResponseEntity.ok(
            Map.of(
                    "success",true
            )
    );


}
}