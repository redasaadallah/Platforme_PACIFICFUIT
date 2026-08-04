
package com.example.demo.config;


import com.example.demo.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


import java.util.List;



@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {


    // ===============================
    // NEW:
    // Inject JWT Filter
    // This filter checks the JWT token
    // before accessing controllers
    // ===============================

    private final JwtAuthenticationFilter jwtAuthenticationFilter;



    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter
    ){

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;

    }





    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {


        http


                // ===============================
                // Existing:
                // Enable CORS
                // ===============================

                .cors(cors -> cors.configurationSource(corsConfigurationSource()))



                // ===============================
                // Existing:
                // Disable CSRF
                // Needed because we use JWT
                // ===============================

                .csrf(csrf -> csrf.disable())



                // ===============================
                // NEW:
                // JWT does not use sessions
                // Every request must contain token
                // ===============================

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )



                .authorizeHttpRequests(auth -> auth
//                        +++++++++++++++++++++++++++++++++++

//                        +++++++++++++++++++++++++++++++++++


                        // ===============================
                        // NEW:
                        // Login remains public
                        // No token needed
                        // ===============================

                        .requestMatchers(
                                "/api/admin/login",
                                "/api/admin/forgot-password",
                                "/api/client/login",
                                "/api/client/forgot-password",
                                "/api/client/sendCode",
                                "/api/client/verify",
                                "/api/messages/**",
                                "/api/auth/**"
                        )
                        .permitAll()


                        // ===============================
                        // Existing:
                        // Messages can stay public
                        // ===============================

//                        .requestMatchers(
//                                "/api/messages/**"
//                        )
//                        .permitAll()



                        // ===============================
                        // Existing:
                        // Received products public
                        // ===============================

                        .requestMatchers(
                                "/api/produits/recus/**"
                        )
                        .permitAll()



                        // ===============================
                        // NEW:
                        // Admin APIs require ADMIN token
                        //
                        // JWT must contain:
                        // type = ADMIN
                        // ===============================

                        .requestMatchers(
                                "/api/admin/**"
                        )
                        .hasAuthority("ADMIN")



                        // ===============================
                        // NEW:
                        // Client APIs require CLIENT token
                        //
                        // JWT must contain:
                        // type = CLIENT
                        // ===============================

                        .requestMatchers(
                                "/api/client/**"
                        )
                        .hasAuthority("CLIENT")



                        // ===============================
                        // CHANGED:
                        // Before:
                        // .anyRequest().permitAll()
                        //
                        // Problem:
                        // Everybody can access APIs
                        //
                        // Now:
                        // Every other API needs JWT
                        // ===============================
//
//                        .anyRequest()
//                        .authenticated()
                    .anyRequest().permitAll()

                )



                // ===============================
                // Existing:
                // Disable default login page
                // ===============================

                .formLogin(form ->
                        form.disable()
                )



                // ===============================
                // Existing:
                // Disable Basic Auth
                // ===============================

                .httpBasic(basic ->
                        basic.disable()
                )



                // ===============================
                // NEW:
                // Add JWT Filter before Spring default filter
                //
                // Flow:
                //
                // Request
                //    |
                // JWT Filter
                //    |
                // Security
                //    |
                // Controller
                //
                // ===============================

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );



        return http.build();

    }






    @Bean
    public CorsConfigurationSource corsConfigurationSource() {


        CorsConfiguration configuration =
                new CorsConfiguration();



        // ===============================
        // Existing:
        // Allowed Frontend URLs
        // ===============================

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:3000",
                        "http://localhost:3001",
                        "http://82.29.172.203:3001",
                        "http://192.168.31.133:3001"
                )
        );



        // ===============================
        // Existing:
        // HTTP methods allowed
        // ===============================

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );



        // ===============================
        // Existing:
        // Allow all headers
        // Important for:
        //
        // Authorization: Bearer JWT
        //
        // ===============================

        configuration.setAllowedHeaders(
                List.of("*")
        );



        configuration.setAllowCredentials(true);



        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();



        source.registerCorsConfiguration(
                "/**",
                configuration
        );



        return source;

    }

}