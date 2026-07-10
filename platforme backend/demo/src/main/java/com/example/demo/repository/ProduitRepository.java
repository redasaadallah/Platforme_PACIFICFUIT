package com.example.demo.repository;

import com.example.demo.entity.Produit;
import com.example.demo.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
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
    List<Produit> findByClient(Client client);
    @Query("""
        SELECT p
        FROM Produit p
        JOIN FETCH p.client
        JOIN FETCH p.chambre
        WHERE p.statut = 'enAtente'
        ORDER BY p.dateDemande ASC
    """)
    List<Produit> findAllOrdered();
    @Query("""
    SELECT p
    FROM Produit p
    JOIN FETCH p.client
    JOIN FETCH p.chambre
    WHERE p.statut = 'accepted'
    ORDER BY p.dateDemande ASC
""")
    List<Produit> findAllOrderedAccepted();
    long countByClientCin(String cin);
    // Méthode pour récupérer toutes les réservations acceptées d'un client
    List<Produit> findByClientAndStatutIn(Client client, List<String> statuts);    // Méthode pour récupérer uniquement les produits ayant le statut "reservationEnAttente"
    List<Produit> findByStatut(String statut);
    List<Produit> findByDateDebutStockageBetween(LocalDate start, LocalDate end);
    @Query("SELECT p.nom, SUM(p.quantite) " +
            "FROM Produit p " +
            "GROUP BY p.nom")
    List<Object[]> getGroupedQuantities();
    @Query("SELECT COUNT(DISTINCT p.client.id) " +
            "FROM Produit p " +
            "WHERE p.dateDebutStockage BETWEEN :start AND :end")
    long countDistinctClients(@Param("start") LocalDate start,
                              @Param("end") LocalDate end);
    @Query("""
    SELECT p.nom, SUM(p.quantite)
    FROM Produit p
    GROUP BY p.nom
    ORDER BY SUM(p.quantite) DESC
""")
    List<Object[]> getGroupedQuantitiesStat();
}
