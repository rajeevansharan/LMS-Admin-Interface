// _FILEPATH: src/main/java/lk/slpa/mpma/backend/service/NotificationService.java
package lk.slpa.mpma.backend.service;

import lk.slpa.mpma.backend.dto.NotificationDTO;
import lk.slpa.mpma.backend.model.Course;

import java.util.List;

public interface NotificationService {

    void createNotificationForCourse(Course course, String message, String link);

    List<NotificationDTO> getNotificationsForUser(String username);

    long getUnreadNotificationCount(String username);

    void markAsRead(String username, Long notificationId);

    void markAllAsRead(String username);
}