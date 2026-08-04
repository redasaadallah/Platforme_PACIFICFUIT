package com.example.demo.config;

import com.example.demo.entity.Admin;
import com.example.demo.entity.Chambre;
import com.example.demo.entity.Parametre;
import com.example.demo.repository.AdminRepository;
import com.example.demo.repository.ChambreRepository;
import com.example.demo.repository.ParametreRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class ParametresInitializer {

    @Bean
    CommandLineRunner initParametre(ParametreRepository parametreRepository) {
        return args -> {

            // Vérifier si admin existe déjà
            if (parametreRepository.count() == 0) {


                Parametre parametre = new Parametre();
                parametre.setPrixReservation(200);
                parametre.setPrixPrelangemant(200);
                parametre.setDureeMinReservation(30);
                parametre.setDureeMaxReservation(90);
                parametre.setDureeMinProlongement(30);
                parametre.setDureeMaxProlongement(90);
                parametre.setQuantiteMinProduit(5);
                parametre.setQuantiteMaxProduit(50);
                parametre.setDelaiMaxEntreDemandeEtDebut(5);
                parametre.setDelaiProlongement(3);
                parametreRepository.save(parametre);

            }
        };
    }
//    =========================
@Bean
CommandLineRunner initChambre(ChambreRepository chambreRepository) {
    return args -> {

        // Vérifier si admin existe déjà
        if (chambreRepository.count() == 0) {


            Chambre chambre = new Chambre();
            chambre.setNomChambre("A");
            chambre.setTemperature(0);
            chambre.setCapacite(100);
            chambre.setCapaciteDisponible(100);

            chambreRepository.save(chambre);

        }
    };
}
}




