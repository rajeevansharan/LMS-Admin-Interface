// _FILEPATH: src/main/java/lk/slpa/mpma/backend/model/Notification.java
package lk.slpa.mpma.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The user who will receive the notification
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "recipient_id", nullable = false)
    private Person recipient;

    @Column(nullable = false, length = 512)
    private String message;

    // A direct link to the content (e.g., /courses/1/quizzes/5)
    @Column
    private String link;

    @Column(nullable = false)
    private boolean isRead = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public Notification(Person recipient, String message, String link) {
        this.recipient = recipient;
        this.message = message;
        this.link = link;
    }
}