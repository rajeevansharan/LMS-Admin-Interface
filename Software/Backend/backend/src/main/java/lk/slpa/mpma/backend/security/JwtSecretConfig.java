package lk.slpa.mpma.backend.security;

import java.security.SecureRandom;
import java.util.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.util.StringUtils;

/**
 * Configuration class that manages the JWT secret key. Uses a predefined secret key if provided in
 * application.properties, otherwise generates a secure random one at application startup.
 */
@Configuration
public class JwtSecretConfig {

  private static final Logger logger = LoggerFactory.getLogger(JwtSecretConfig.class);
  private static final int SECRET_KEY_LENGTH = 64; // 512 bits for HS512 algorithm

  @Value("${jwt.secret:}")
  private String configuredSecret;

  private String generatedSecret = null;

  /**
   * Provides a JWT secret key for token signing. Uses the predefined secret from
   * application.properties if available, otherwise generates a secure random secret key.
   *
   * @return A JWT secret key string
   */
  @Bean
  @Primary
  public String jwtSecret() {
    // Use the predefined secret if it's available
    if (StringUtils.hasText(configuredSecret)) {
      logger.info("Using predefined JWT secret from application.properties");
      return configuredSecret;
    }

    // Generate a random secret if no predefined secret is available
    if (generatedSecret == null) {
      byte[] randomBytes = new byte[SECRET_KEY_LENGTH];
      new SecureRandom().nextBytes(randomBytes);
      generatedSecret = Base64.getEncoder().encodeToString(randomBytes);
      logger.info("Generated new random JWT secret key (no predefined secret found)");
    }

    return generatedSecret;
  }
}
