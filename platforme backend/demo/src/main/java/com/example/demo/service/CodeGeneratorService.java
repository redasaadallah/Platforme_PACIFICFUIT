package com.example.demo.service;

import com.example.demo.repository.ClientRepository;
import com.example.demo.repository.ProduitRepository;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class CodeGeneratorService {

    private final ClientRepository clientRepository;
    private final ProduitRepository produitRepository;
    private final SecureRandom random = new SecureRandom();

    private static final String LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private static final String DIGITS = "0123456789";
    private static final String SYMBOLS = "!@#$%^&*()-_=+";

    public CodeGeneratorService(ClientRepository clientRepository, ProduitRepository produitRepository) {
        this.clientRepository = clientRepository;
        this.produitRepository = produitRepository;
    }

    /**
     * Générer un mot de passe client aléatoire (8 caractères : lettres + chiffres + symboles)
     *    et unique dans la base Client.
     */
    public String generateUniqueClientPassword() {
        String password;
        do {
            password = generateRandomPassword(8);
        } while (clientRepository.existsByMotDePasse(password));
        return password;
    }

    private String generateRandomPassword(int length) {
        String allChars = LETTERS + DIGITS + SYMBOLS;
        StringBuilder password = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            password.append(allChars.charAt(random.nextInt(allChars.length())));
        }
        return password.toString();
    }

    /**
     * 2️⃣ Générer un code produit aléatoire (4 chiffres) et unique dans la base Produit.
     */
    public String generateUniqueProductCode() {
        String code;
        do {
            code = generate4DigitCode(); // déjà String
        } while (produitRepository.existsById(code)); // vérifie directement comme String
        return code;
    }

    private String generate4DigitCode() {
        StringBuilder code = new StringBuilder(4);
        for (int i = 0; i < 4; i++) {
            code.append(random.nextInt(10)); // chiffre aléatoire 0-9
        }
        return code.toString(); // retourne un String
    }


}