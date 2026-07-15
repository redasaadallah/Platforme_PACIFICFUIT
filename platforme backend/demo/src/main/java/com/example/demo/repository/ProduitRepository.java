package com.example.demo.repository;

import com.example.demo.entity.Chambre;
import com.example.demo.entity.Produit;
import com.example.demo.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ProduitRepository extends JpaRepository<Produit, String> {

    // Récupérer tous les produits d'un client en incluant le document
    @Query("""
        SELECT p FROM Produit p
        JOIN FETCH p.document d
        WHERE p.client.cin = :cin
    
    """)
    List<Produit> findByClientCin(@Param("cin") String cin);

    // Méthode optionnelle si tu veux passer directement l'entité Client


    // Méthode pour récupérer toutes les réservations acceptées d'un client
    List<Produit> findByClientAndStatutIn(Client client, List<String> statuts);    // Méthode pour récupérer uniquement les produits ayant le statut "reservationEnAttente"


    List<Produit> findByStatut(String statut);
    List<Produit> findByStatutIn(List<String> statuts);

    List<Produit> findByDateDebutStockageBetween(LocalDate start, LocalDate end);


    List<Produit> findByDateDemandeBetween(
            LocalDateTime start,
            LocalDateTime end
    );



    @Query("""
    SELECT p.nom, SUM(p.quantite)
    FROM Produit p
    LEFT JOIN Prolongement pr
        ON pr.produit = p
    WHERE p.statut = 'accepted'
    AND p.dateDebutStockage <= CURRENT_TIMESTAMP
    AND (
        pr IS NULL
        OR (
            pr.statut = 'accepted'
            AND pr.ancienneDateFin <= CURRENT_TIMESTAMP
        )
    )
    GROUP BY p.nom
    ORDER BY SUM(p.quantite) DESC
""")
    List<Object[]> getGroupedQuantitiesStat();


    @Query("""
        SELECT COALESCE(SUM(p.quantite),0)
        FROM Produit p
        WHERE p.chambre = :chambre
        AND p.statut = 'accepted'
        
        AND p.dateDebutStockage <= :dateFin
        
        AND COALESCE(
            (
                SELECT MAX(pr.nouvelleDateFinDemandee)
                FROM Prolongement pr
                WHERE pr.produit = p
                AND pr.statut = 'accepted'
            ),
            p.dateFinStockage
        ) >= :dateDebut
        
        """)
            Double getQuantiteOccupeePourPeriode(
                    @Param("chambre") Chambre chambre,
                    @Param("dateDebut") LocalDate dateDebut,
                    @Param("dateFin") LocalDate dateFin
            );
}
