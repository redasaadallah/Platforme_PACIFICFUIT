package com.example.demo.service;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.StringArrayPropertyEditor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class PdfService {

    @Autowired
    private SpringTemplateEngine templateEngine;
    private String imageToBase64(String path)
            throws Exception {

        ClassPathResource resource =
                new ClassPathResource(path);

        InputStream inputStream =
                resource.getInputStream();

        byte[] imageBytes =
                inputStream.readAllBytes();

        return Base64.getEncoder()
                .encodeToString(imageBytes);
    }
    public byte[] generatePdf(String type,
                              String nom,
                              String email,
                              String cin,
                              String phone,
                              String code,
                              String debut,
                              String duree,
                              String fin,
                              String fait,
                              String prix,
                              String nomProduit,
                              String quantite,
                              String chambre,
                              String temperature) throws Exception {

        // 1️⃣ Context Thymeleaf (données du reçu)
        Context context = new Context();
        context.setVariable("type", type);
        context.setVariable("nom", nom);
        context.setVariable("email", email);
        context.setVariable("cin", cin);
        context.setVariable("phone", phone);
        context.setVariable("code", code);
        context.setVariable("debut", debut);
        context.setVariable("duree", duree);
        context.setVariable("fin", fin);
        context.setVariable("fait", fait);
        context.setVariable("prix", prix);
        context.setVariable("nomProduit", nomProduit);
        context.setVariable("quantite", quantite);
        context.setVariable("chambre", chambre);
        context.setVariable("temperature", temperature);
         //=========================================
        context.setVariable(
                "logo",
                imageToBase64("static/images/logo.png")
        );

        context.setVariable(
                "map",
                imageToBase64("static/images/map.png")
        );

        context.setVariable(
                "support",
                imageToBase64("static/images/support.png")
        );

        context.setVariable(
                "whatsapp",
                imageToBase64("static/images/whatsapp.png")
        );
        context.setVariable(
                "at",
                imageToBase64("static/images/at.png")
        );
        //==========================================
        // 4️⃣ Générer HTML avec Thymeleaf
        String html =
                templateEngine.process("recu", context);

        // 5️⃣ Convertir HTML → PDF
        ByteArrayOutputStream outputStream =
                new ByteArrayOutputStream();

        PdfRendererBuilder builder =
                new PdfRendererBuilder();

        builder.withHtmlContent(html, null);
        builder.toStream(outputStream);
        builder.run();

        // 6️⃣ Retour PDF en bytes
        return outputStream.toByteArray();
    }
    public String savePdf(byte[] pdfBytes, String codeProduit) throws Exception {

        String dossier = "uploads/recus/";

        File folder = new File(dossier);

        if (!folder.exists()) {
            folder.mkdirs();
        }

        String fileName = "recu_" + codeProduit + ".pdf";

        Path path = Paths.get(dossier + fileName);

        Files.write(path, pdfBytes);

        return fileName;
    }
}