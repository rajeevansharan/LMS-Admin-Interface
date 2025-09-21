package lk.slpa.mpma.backend.controller;

import java.util.Date;
import java.util.List;
import lk.slpa.mpma.backend.model.LoginAttempt;
import lk.slpa.mpma.backend.model.LoginAttempt.LoginStatus;
import lk.slpa.mpma.backend.service.LoginAttemptService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Admin controller for login attempt auditing and monitoring. Provides endpoints to view login
 * attempt data for security monitoring.
 */
@RestController
@RequestMapping("/api/admin/security")
@PreAuthorize("hasRole('ADMINISTRATOR')")
@RequiredArgsConstructor
public class AdminLoginAuditController {

  private final LoginAttemptService loginAttemptService;

  /**
   * Get all login attempts for a specific username.
   *
   * @param username The username to search for
   * @return List of login attempts
   */
  @GetMapping("/login-attempts/by-username")
  public ResponseEntity<List<LoginAttempt>> getLoginAttemptsByUsername(
      @RequestParam String username) {
    List<LoginAttempt> attempts = loginAttemptService.getLoginAttemptsByUsername(username);
    return ResponseEntity.ok(attempts);
  }

  /**
   * Get all login attempts from a specific IP address.
   *
   * @param ipAddress The IP address to search for
   * @return List of login attempts
   */
  @GetMapping("/login-attempts/by-ip")
  public ResponseEntity<List<LoginAttempt>> getLoginAttemptsByIpAddress(
      @RequestParam String ipAddress) {
    List<LoginAttempt> attempts = loginAttemptService.getLoginAttemptsByIpAddress(ipAddress);
    return ResponseEntity.ok(attempts);
  }

  /**
   * Get login attempts within a specific time range.
   *
   * @param startDate The start date of the range (yyyy-MM-dd format)
   * @param endDate The end date of the range (yyyy-MM-dd format)
   * @return List of login attempts within the range
   */
  @GetMapping("/login-attempts/by-date-range")
  public ResponseEntity<List<LoginAttempt>> getLoginAttemptsByDateRange(
      @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
      @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {

    // Set endDate to end of day
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);

    List<LoginAttempt> attempts =
        loginAttemptService.getLoginAttemptsInTimeRange(startDate, endDate);
    return ResponseEntity.ok(attempts);
  }

  /**
   * Get the most recent login attempts, limited to a specified count.
   *
   * @param count The maximum number of entries to return (default 100)
   * @return List of the most recent login attempts
   */
  @GetMapping("/login-attempts/recent")
  public ResponseEntity<List<LoginAttempt>> getRecentLoginAttempts(
      @RequestParam(defaultValue = "100") int count) {
    List<LoginAttempt> attempts = loginAttemptService.getRecentLoginAttempts(count);
    return ResponseEntity.ok(attempts);
  }

  /**
   * Get all failed login attempts.
   *
   * @return List of failed login attempts
   */
  @GetMapping("/login-attempts/failed")
  public ResponseEntity<List<LoginAttempt>> getFailedLoginAttempts() {
    List<LoginAttempt> attempts = loginAttemptService.getLoginAttemptsByStatus(LoginStatus.FAILED);
    return ResponseEntity.ok(attempts);
  }

  /**
   * Get login statistics including counts for different statuses.
   *
   * @return Login statistics
   */
  @GetMapping("/login-attempts/stats")
  public ResponseEntity<?> getLoginStatistics() {
    return ResponseEntity.ok(loginAttemptService.getLoginStatistics());
  }
}
