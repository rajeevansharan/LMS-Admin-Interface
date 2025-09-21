package lk.slpa.mpma.backend.model;

import jakarta.persistence.*;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity to store information about user login attempts, both successful and failed. Records IP
 * addresses and other metadata for security auditing purposes. This class is a pure data container
 * following clean architecture principles.
 */
@Entity
@Table(name = "login_attempt")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginAttempt {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "attempt_id")
  private Long id;

  @Column(nullable = false, length = 50)
  private String username;

  @Column(name = "ip_address", nullable = false, length = 45)
  private String ipAddress;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private LoginStatus status;

  @Column(name = "attempt_time", nullable = false)
  @Temporal(TemporalType.TIMESTAMP)
  private Date attemptTime;

  @Column(name = "user_agent", length = 255)
  private String userAgent;

  @Column private String details;

  /**
   * Enum representing possible login attempt outcomes. Enums are acceptable in entity classes as
   * they define types rather than behavior.
   */
  public enum LoginStatus {
    SUCCESS,
    FAILED,
    LOGOUT
  }
}
