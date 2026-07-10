package com.example.demo.controller;

import com.example.demo.entity.Message;
import com.example.demo.repository.MessageRepository;
import com.example.demo.service.EmailService;
import com.example.demo.service.TwilioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
//@CrossOrigin(origins = "http://localhost:3000")
public class MessageController {
    private final EmailService emailService;
    @Autowired
    private TwilioService twilioService;

    public MessageController(EmailService emailService) {
        this.emailService = emailService;
    }

    @Autowired
    private MessageRepository messageRepository;

    @PostMapping
    public Message ajouterMessage(@RequestBody Message message) {
        return messageRepository.save(message);
    }

    @GetMapping
    public List<Message> getMessages() {
        return messageRepository.findAll();
    }
    @PostMapping("/send")
    public String envoyerContact(@RequestBody Map<String, String> data) throws Exception {

        String email = data.get("email");
        String reponce = data.get("reponce");
        String nom = data.get("nom");
        String prenom = data.get("prenom");
        String messageClient = data.get("message");
        String telephone = data.get("telephone");

        emailService.sendMessageEmail(email, reponce, nom, prenom, messageClient);
        twilioService.sendMessagePhone(telephone, reponce, nom, prenom, messageClient);
        return "Message envoyé avec succès.";
    }
    @DeleteMapping("/{id}")
    public String deleteMessage(@PathVariable Long id) {
        messageRepository.deleteById(id);
        return "Message supprimé avec succès";
    }
}