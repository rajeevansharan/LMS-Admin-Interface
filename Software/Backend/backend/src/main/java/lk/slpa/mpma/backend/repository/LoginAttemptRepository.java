package lk.slpa.mpma.backend.repository;

import java.util.Date;
import java.util.List;
import lk.slpa.mpma.backend.model.LoginAttempt;
import lk.slpa.mpma.backend.model.LoginAttempt.LoginStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Repository for managing LoginAttempt entities. Provides methods to save and retrieve login
 * attempt records.
 */
@Repository
public interface LoginAttemptRepository extends JpaRepository<LoginAttempt, Long> {

  /**
   * Find all login attempts for a specific username.
   *
   * @param username The username to search for
   * @return List of login attempts for the username
   */
  List<LoginAttempt> findByUsername(String username);

  /**
   * Find all login attempts with a specific status.
   *
   * @param status The login status to search for
   * @return List of login attempts with the specified status
   */
  List<LoginAttempt> findByStatus(LoginStatus status);

  /**
   * Find all login attempts from a specific IP address.
   *
   * @param ipAddress The IP address to search for
   * @return List of login attempts from the specified IP address
   */
  List<LoginAttempt> findByIpAddress(String ipAddress);

  /**
   * Find login attempts within a specific time range.
   *
   * @param startDate The start of the time range
   * @param endDate The end of the time range
   * @return List of login attempts within the specified time range
   */
  List<LoginAttempt> findByAttemptTimeBetween(Date startDate, Date endDate);

  /**
   * Count failed login attempts for a specific username within the last specified minutes. Used for
   * rate limiting and brute force protection.
   *
   * @param username The username to check
   * @param minutesAgo The timestamp for N minutes ago
   * @return The count of failed attempts
   */
  @Query(
      "SELECT COUNT(l) FROM LoginAttempt l WHERE l.username = ?1 AND l.status = 'FAILED' AND"
          + " l.attemptTime > ?2")
  long countRecentFailedAttempts(String username, Date minutesAgo);

  /**
   * Count login attempts from a specific IP address within the last specified minutes. Used for
   * rate limiting and DDoS protection.
   *
   * @param ipAddress The IP address to check
   * @param minutesAgo The timestamp for N minutes ago
   * @return The count of attempts
   */
  @Query("SELECT COUNT(l) FROM LoginAttempt l WHERE l.ipAddress = ?1 AND l.attemptTime > ?2")
  long countRecentAttemptsByIpAddress(String ipAddress, Date minutesAgo);
}
