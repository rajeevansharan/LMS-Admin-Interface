package lk.slpa.mpma.backend.service;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lk.slpa.mpma.backend.model.LoginAttempt;
import lk.slpa.mpma.backend.model.LoginAttempt.LoginStatus;
import lk.slpa.mpma.backend.repository.LoginAttemptRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class for handling login attempt logging and queries. Records login attempts and provides
 * methods to query the data. Contains all business logic related to login attempts following clean
 * architecture.
 */
@Service
@RequiredArgsConstructor
public class LoginAttemptService {

  private static final Logger logger = LoggerFactory.getLogger(LoginAttemptService.class);

  // Maximum allowed failed login attempts within the time window
  private static final int MAX_FAILED_ATTEMPTS = 5;
  // Time window for rate limiting in minutes
  private static final int RATE_LIMIT_WINDOW_MINUTES = 15;

  private final LoginAttemptRepository loginAttemptRepository;

  /**
   * Record a successful login attempt.
   *
   * @param username The username that successfully logged in
   * @param ipAddress The IP address of the client
   * @param userAgent The user agent string from the client
   * @return The created login attempt record
   */
  @Transactional
  public LoginAttempt recordSuccessfulLogin(String username, String ipAddress, String userAgent) {
    // Business logic for creating a login attempt moved from entity to service
    LoginAttempt attempt =
        LoginAttempt.builder()
            .username(username)
            .ipAddress(ipAddress)
            .status(LoginStatus.SUCCESS)
            .attemptTime(new Date())
            .userAgent(userAgent)
            .details("Login successful")
            .build();

    logger.info("Successful login: user={}, ip={}", username, ipAddress);
    return loginAttemptRepository.save(attempt);
  }

  /**
   * Record a failed login attempt.
   *
   * @param username The username that failed to log in
   * @param ipAddress The IP address of the client
   * @param userAgent The user agent string from the client
   * @param reason The reason for the failure
   * @return The created login attempt record
   */
  @Transactional
  public LoginAttempt recordFailedLogin(
      String username, String ipAddress, String userAgent, String reason) {
    // Business logic for creating a login attempt moved from entity to service
    LoginAttempt attempt =
        LoginAttempt.builder()
            .username(username)
            .ipAddress(ipAddress)
            .status(LoginStatus.FAILED)
            .attemptTime(new Date())
            .userAgent(userAgent)
            .details(reason)
            .build();

    logger.warn("Failed login: user={}, ip={}, reason={}", username, ipAddress, reason);
    return loginAttemptRepository.save(attempt);
  }

  /**
   * Record a logout event.
   *
   * @param username The username that logged out
   * @param ipAddress The IP address of the client
   * @param userAgent The user agent string from the client
   * @return The created login attempt record
   */
  @Transactional
  public LoginAttempt recordLogout(String username, String ipAddress, String userAgent) {
    // Business logic for creating a login attempt moved from entity to service
    LoginAttempt attempt =
        LoginAttempt.builder()
            .username(username)
            .ipAddress(ipAddress)
            .status(LoginStatus.LOGOUT)
            .attemptTime(new Date())
            .userAgent(userAgent)
            .details("User logged out")
            .build();

    logger.info("User logout: user={}, ip={}", username, ipAddress);
    return loginAttemptRepository.save(attempt);
  }

  /**
   * Check if a username is currently rate limited due to too many failed attempts.
   *
   * @param username The username to check
   * @return True if the user should be rate limited, false otherwise
   */
  @Transactional(readOnly = true)
  public boolean isUserRateLimited(String username) {
    Date windowStart = getTimeWindowStart();
    long failedAttempts = loginAttemptRepository.countRecentFailedAttempts(username, windowStart);
    boolean isLimited = failedAttempts >= MAX_FAILED_ATTEMPTS;

    if (isLimited) {
      logger.warn("User {} rate limited after {} failed attempts", username, failedAttempts);
    }

    return isLimited;
  }

  /**
   * Check if an IP address is currently making too many requests.
   *
   * @param ipAddress The IP address to check
   * @param maxAttempts Maximum allowed attempts in the time window
   * @return True if the IP should be rate limited, false otherwise
   */
  @Transactional(readOnly = true)
  public boolean isIpRateLimited(String ipAddress, int maxAttempts) {
    Date windowStart = getTimeWindowStart();
    long attempts = loginAttemptRepository.countRecentAttemptsByIpAddress(ipAddress, windowStart);
    boolean isLimited = attempts >= maxAttempts;

    if (isLimited) {
      logger.warn("IP {} rate limited after {} attempts", ipAddress, attempts);
    }

    return isLimited;
  }

  /**
   * Get all login attempts for a specific username.
   *
   * @param username The username to search for
   * @return List of login attempts
   */
  @Transactional(readOnly = true)
  public List<LoginAttempt> getLoginAttemptsByUsername(String username) {
    return loginAttemptRepository.findByUsername(username);
  }

  /**
   * Get all login attempts from a specific IP address.
   *
   * @param ipAddress The IP address to search for
   * @return List of login attempts
   */
  @Transactional(readOnly = true)
  public List<LoginAttempt> getLoginAttemptsByIpAddress(String ipAddress) {
    return loginAttemptRepository.findByIpAddress(ipAddress);
  }

  /**
   * Get login attempts within a specific time range.
   *
   * @param startDate The start of the time range
   * @param endDate The end of the time range
   * @return List of login attempts
   */
  @Transactional(readOnly = true)
  public List<LoginAttempt> getLoginAttemptsInTimeRange(Date startDate, Date endDate) {
    return loginAttemptRepository.findByAttemptTimeBetween(startDate, endDate);
  }

  /**
   * Get the most recent login attempts, ordered by timestamp.
   *
   * @param count The maximum number of records to return
   * @return List of recent login attempts
   */
  @Transactional(readOnly = true)
  public List<LoginAttempt> getRecentLoginAttempts(int count) {
    Pageable pageable = PageRequest.of(0, count, Sort.by("attemptTime").descending());
    return loginAttemptRepository.findAll(pageable).getContent();
  }

  /**
   * Get all login attempts with a specific status.
   *
   * @param status The login status to search for
   * @return List of login attempts with the specified status
   */
  @Transactional(readOnly = true)
  public List<LoginAttempt> getLoginAttemptsByStatus(LoginStatus status) {
    return loginAttemptRepository.findByStatus(status);
  }

  /**
   * Get login statistics including counts by status and recent activity.
   *
   * @return Map containing login statistics
   */
  @Transactional(readOnly = true)
  public Map<String, Object> getLoginStatistics() {
    Map<String, Object> stats = new HashMap<>();

    // Count by status
    long successCount = loginAttemptRepository.findByStatus(LoginStatus.SUCCESS).size();
    long failedCount = loginAttemptRepository.findByStatus(LoginStatus.FAILED).size();
    long logoutCount = loginAttemptRepository.findByStatus(LoginStatus.LOGOUT).size();

    stats.put("successfulLogins", successCount);
    stats.put("failedLogins", failedCount);
    stats.put("logouts", logoutCount);
    stats.put("totalAttempts", successCount + failedCount + logoutCount);

    // Today's statistics
    Calendar cal = Calendar.getInstance();
    cal.set(Calendar.HOUR_OF_DAY, 0);
    cal.set(Calendar.MINUTE, 0);
    cal.set(Calendar.SECOND, 0);
    cal.set(Calendar.MILLISECOND, 0);
    Date startOfToday = cal.getTime();

    cal.add(Calendar.DAY_OF_MONTH, 1);
    Date startOfTomorrow = cal.getTime();

    List<LoginAttempt> todaysAttempts =
        loginAttemptRepository.findByAttemptTimeBetween(startOfToday, startOfTomorrow);

    long todaySuccess =
        todaysAttempts.stream().filter(a -> a.getStatus() == LoginStatus.SUCCESS).count();
    long todayFailed =
        todaysAttempts.stream().filter(a -> a.getStatus() == LoginStatus.FAILED).count();

    Map<String, Object> today = new HashMap<>();
    today.put("successful", todaySuccess);
    today.put("failed", todayFailed);
    today.put("total", todaysAttempts.size());

    stats.put("today", today);

    return stats;
  }

  // Helper method to calculate the start of the time window for rate limiting
  private Date getTimeWindowStart() {
    Calendar cal = Calendar.getInstance();
    cal.add(Calendar.MINUTE, -RATE_LIMIT_WINDOW_MINUTES);
    return cal.getTime();
  }
}
