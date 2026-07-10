package com.example.demo.repository;

import com.example.demo.entity.Prolongement;
import com.example.demo.entity.Produit;
import com.example.demo.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ProlongementRepository extends JpaRepository<Prolongement, Long> {

    // Récupérer toutes les prolongations en attente
    List<Prolongement> findByStatut(String statut);

    // Récupérer toutes les prolongations acceptées pour un produit
    @Query("SELECT pr FROM Prolongement pr WHERE pr.produit = :produit AND pr.statut = 'accepted' ORDER BY pr.nouvelleDateFinDemandee DESC")
    List<Prolongement> findAcceptedByProduitOrderByDateDesc(@Param("produit") Produit produit);

    // Récupérer toutes les prolongations acceptées d’un client
    @Query("SELECT pr FROM Prolongement pr JOIN pr.produit p WHERE p.client = :client AND pr.statut = 'accepted'")
    List<Prolongement> findAcceptedByClient(@Param("client") Client client);
    // Récupère le premier prolongement pour un produit avec un statut donné
    Optional<Prolongement> findFirstByProduitAndStatut(Produit produit, String statut);
    List<Prolongement> findByProduit(Produit produit);
    List<Prolongement> findByProduitOrderByDateDemandeAsc(Produit produit);
    List<Prolongement> findByAncienneDateFinBetween(LocalDate start, LocalDate end);
    boolean existsByProduitAndStatut(Produit produit, String statut);
    @Query("""
        SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END
        FROM Prolongement p
        WHERE p.produit.codeProduit = :reservationId
        AND p.statut = 'accepted'
        AND p.ancienneDateFin >= :dateFin
    """)
    boolean existsNextAccepted(@Param("reservationId") String reservationId,
                               @Param("dateFin") LocalDate dateFin);


}