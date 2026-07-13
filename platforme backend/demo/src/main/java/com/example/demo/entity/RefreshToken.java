package com.example.demo.entity;


import jakarta.persistence.*;
import java.util.Date;


@Entity
@Table(name = "refresh_token")
public class RefreshToken {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false, unique = true)
    private String token;


    @Column(nullable = false)
    private Date expiryDate;


    // CLIENT ou ADMIN
    @Column(nullable = false)
    private String userType;


    // cin du client ou id de l'admin
    @Column(nullable = false)
    private String userId;



    public RefreshToken() {
    }



    public RefreshToken(
            String token,
            Date expiryDate,
            String userType,
            String userId
    ) {

        this.token = token;
        this.expiryDate = expiryDate;
        this.userType = userType;
        this.userId = userId;

    }



    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }



    public String getToken() {
        return token;
    }


    public void setToken(String token) {
        this.token = token;
    }



    public Date getExpiryDate() {
        return expiryDate;
    }


    public void setExpiryDate(Date expiryDate) {
        this.expiryDate = expiryDate;
    }



    public String getUserType() {
        return userType;
    }


    public void setUserType(String userType) {
        this.userType = userType;
    }



    public String getUserId() {
        return userId;
    }


    public void setUserId(String userId) {
        this.userId = userId;
    }

}