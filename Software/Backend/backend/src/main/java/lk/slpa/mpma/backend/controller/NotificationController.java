// _FILEPATH: src/main/java/lk/slpa/mpma/backend/controller/NotificationController.java
package lk.slpa.mpma.backend.controller;

import lk.slpa.mpma.backend.dto.NotificationDTO;
import lk.slpa.mpma.backend.service.NotificationService;
import lk.slpa.mpma.backend.util.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/notifications")
@PreAuthorize("isAuthenticated()") // All methods require a logged-in user
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getUserNotifications() {
        String username = SecurityUtil.getCurrentUsername()
                .orElseThrow(() -> new IllegalStateException("User not authenticated"));
        return ResponseEntity.ok(notificationService.getNotificationsForUser(username));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        String username = SecurityUtil.getCurrentUsername()
                .orElseThrow(() -> new IllegalStateException("User not authenticated"));
        long count = notificationService.getUnreadNotificationCount(username);
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable Long id) {
        String username = SecurityUtil.getCurrentUsername()
                .orElseThrow(() -> new IllegalStateException("User not authenticated"));
        notificationService.markAsRead(username, id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/mark-all-read")
    public ResponseEntity<Void> markAllNotificationsAsRead() {
        String username = SecurityUtil.getCurrentUsername()
                .orElseThrow(() -> new IllegalStateException("User not authenticated"));
        notificationService.markAllAsRead(username);
        return ResponseEntity.noContent().build();
    }
}