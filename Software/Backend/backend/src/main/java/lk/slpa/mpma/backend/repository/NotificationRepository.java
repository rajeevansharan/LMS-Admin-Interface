// _FILEPATH: src/main/java/lk/slpa/mpma/backend/repository/NotificationRepository.java
package lk.slpa.mpma.backend.repository;

import lk.slpa.mpma.backend.model.Notification;
import lk.slpa.mpma.backend.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Find all notifications for a specific user, ordered by most recent
    List<Notification> findByRecipientOrderByCreatedAtDesc(Person recipient);

    // Count unread notifications for a user (for the badge icon)
    long countByRecipientAndIsReadFalse(Person recipient);

    // A custom query to mark all notifications for a user as read
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.recipient = :recipient AND n.isRead = false")
    void markAllAsReadForRecipient(Person recipient);
}