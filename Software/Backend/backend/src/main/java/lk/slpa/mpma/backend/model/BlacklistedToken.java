package lk.slpa.mpma.backend.model;

import jakarta.persistence.*;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity to store tokens that have been invalidated due to user logout or other security events.
 * These tokens will be rejected even if not yet expired.
 */
@Entity
@Table(name = "blacklisted_tokens")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlacklistedToken {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  /**
   * The token string that has been invalidated. Using a hash or signature might be more storage
   * efficient for production.
   */
  @Column(nullable = false, unique = true, length = 512)
  private String token;

  /** When this token was blacklisted (usually when user logged out). */
  @Column(nullable = false)
  private Date blacklistedAt;

  /** When this token will expire. Used for cleanup of expired entries. */
  @Column(nullable = false)
  private Date expiresAt;

  /** Username associated with this token for auditing purposes. */
  @Column(length = 50)
  private String username;

  /**
   * Creates a new blacklisted token entry.
   *
   * @param token The token string to blacklist
   * @param expiresAt When the token would normally expire
   * @param username The username associated with this token
   */
  public BlacklistedToken(String token, Date expiresAt, String username) {
    this.token = token;
    this.blacklistedAt = new Date();
    this.expiresAt = expiresAt;
    this.username = username;
  }
}
