// _FILEPATH: src/main/java/lk/slpa/mpma/backend/service/impl/NotificationServiceImpl.java
package lk.slpa.mpma.backend.service.impl;

import lk.slpa.mpma.backend.dto.NotificationDTO;
import lk.slpa.mpma.backend.exception.ResourceNotFoundException;
import lk.slpa.mpma.backend.exception.UnauthorizedAccessException;
import lk.slpa.mpma.backend.model.*;
import lk.slpa.mpma.backend.repository.NotificationRepository;
import lk.slpa.mpma.backend.repository.PersonRepository;
import lk.slpa.mpma.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private PersonRepository personRepository;

    @Override
    @Transactional
    public void createNotificationForCourse(Course course, String message, String link) {
        // This assumes your Course entity has a collection of enrolled students.
        // If not, you'll need to query for students enrolled in the course.
        List<Notification> notifications = course.getStudents().stream()
                .map(student -> new Notification(student, message, link))
                .collect(Collectors.toList());

        notificationRepository.saveAll(notifications);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationDTO> getNotificationsForUser(String username) {
        Person user = findUserByUsername(username);
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadNotificationCount(String username) {
        Person user = findUserByUsername(username);
        return notificationRepository.countByRecipientAndIsReadFalse(user);
    }

    @Override
    @Transactional
    public void markAsRead(String username, Long notificationId) {
        Person user = findUserByUsername(username);
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getRecipient().equals(user)) {
            throw new UnauthorizedAccessException("You can only mark your own notifications as read.");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead(String username) {
        Person user = findUserByUsername(username);
        notificationRepository.markAllAsReadForRecipient(user);
    }

    private Person findUserByUsername(String username) {
        return personRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }

    private NotificationDTO mapToDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setMessage(notification.getMessage());
        dto.setLink(notification.getLink());
        dto.setRead(notification.isRead());
        dto.setCreatedAt(notification.getCreatedAt());
        return dto;
    }
}