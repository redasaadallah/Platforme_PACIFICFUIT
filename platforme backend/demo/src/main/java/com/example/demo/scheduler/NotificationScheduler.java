package com.example.demo.scheduler;

import com.example.demo.service.NotificationService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class NotificationScheduler {

    private final NotificationService notificationService;

    public NotificationScheduler(NotificationService notificationService) {
        this.notificationService = notificationService;
    }


//@Scheduled(fixedRate = 60000) // 60 seconds = 1 minute
@Scheduled(cron = "0 0 8 * * *")
public void runDailyJob() {
        notificationService.checkStorageDates();
    }
}