package lk.slpa.mpma.backend.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Scheduled task to clean up expired tokens from the blacklist. This helps prevent database bloat
 * and keeps the token validation efficient.
 */
@Component
public class TokenCleanupTask {

  private static final Logger logger = LoggerFactory.getLogger(TokenCleanupTask.class);

  private final JwtTokenUtil jwtTokenUtil;

  @Autowired
  public TokenCleanupTask(JwtTokenUtil jwtTokenUtil) {
    this.jwtTokenUtil = jwtTokenUtil;
  }

  /**
   * Scheduled task that runs daily to clean up expired blacklisted tokens. Tokens that have passed
   * their expiration date no longer need to be kept in the blacklist since they would be rejected
   * due to expiration anyway.
   */
  @Scheduled(cron = "0 0 0 * * ?") // Run at midnight every day
  public void cleanupExpiredTokens() {
    logger.info("Running scheduled cleanup of expired blacklisted tokens");
    int removedTokens = jwtTokenUtil.cleanupBlacklist();
    logger.info("Removed {} expired tokens from blacklist", removedTokens);
  }
}
