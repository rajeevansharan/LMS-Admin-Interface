package lk.slpa.mpma.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import lk.slpa.mpma.backend.model.Person;
import lk.slpa.mpma.backend.repository.BlacklistedTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

/**
 * Utility class for JWT token operations. This class handles the creation, validation, and parsing
 * of JSON Web Tokens used for authentication and authorization in the application.
 */
// ! SECURITY CRITICAL CLASS
// ! Handles all JWT operations for application authentication
@Component
public class JwtTokenUtil {

  // Dynamically generated secret key from JwtSecretConfig
  private final String secret;

  // ? Token expiration time in seconds
  @Value("${jwt.expiration}")
  private Long expiration;

  private final BlacklistedTokenRepository blacklistedTokenRepository;

  /**
   * Constructor that accepts the dynamically generated JWT secret.
   *
   * @param jwtSecret The secure random JWT secret generated at startup
   * @param blacklistedTokenRepository Repository for checking blacklisted tokens
   */
  @Autowired
  public JwtTokenUtil(String jwtSecret, BlacklistedTokenRepository blacklistedTokenRepository) {
    this.secret = jwtSecret;
    this.blacklistedTokenRepository = blacklistedTokenRepository;
  }

  /**
   * Generates a secure signing key from the configured secret.
   *
   * @return A Key object suitable for HMAC-SHA algorithms
   */
  // ! Security sensitive method for generating the cryptographic key
  private Key getSigningKey() {
    byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
    return Keys.hmacShaKeyFor(keyBytes);
  }

  /**
   * Generates a JWT token for a user. Includes user ID, role, and name in the token claims.
   *
   * @param userDetails The user details from Spring Security
   * @return A signed JWT token string
   */
  // * Main method used by authentication endpoints to generate tokens
  public String generateToken(UserDetails userDetails) {
    Map<String, Object> claims = new HashMap<>();

    // * Store user information in token payload
    if (userDetails instanceof UserDetailsImpl) {
      Person person = ((UserDetailsImpl) userDetails).getPerson();
      claims.put("id", person.getPersonId());
      claims.put("role", person.getUserRole().name());
      claims.put("name", person.getName());
    }

    return createToken(claims, userDetails.getUsername());
  }

  /**
   * Creates a JWT token with specified claims and subject.
   *
   * @param claims Additional claims to include in the token
   * @param subject The subject of the token (typically the username)
   * @return A signed JWT token string
   */
  // * Core token creation logic with claims, subject, and expiration
  private String createToken(Map<String, Object> claims, String subject) {
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + expiration * 1000);

    return Jwts.builder()
        .setClaims(claims)
        .setSubject(subject)
        .setIssuedAt(now)
        .setExpiration(expiryDate)
        .signWith(
            getSigningKey(),
            SignatureAlgorithm.HS512) // ! Uses HS512 algorithm for stronger security
        .compact();
  }

  /**
   * Validates if a token belongs to the given user, is not expired, and not blacklisted.
   *
   * @param token The JWT token to validate
   * @param userDetails The user details to validate against
   * @return True if the token is valid, false otherwise
   */
  // ! Critical security method used in all protected endpoints
  public Boolean validateToken(String token, UserDetails userDetails) {
    final String username = extractUsername(token);
    return (username.equals(userDetails.getUsername())
        && !isTokenExpired(token)
        && !isTokenBlacklisted(token));
  }

  /**
   * Checks if a token has been blacklisted due to logout or security concerns.
   *
   * @param token The JWT token to check
   * @return True if the token is blacklisted, false otherwise
   */
  public boolean isTokenBlacklisted(String token) {
    return blacklistedTokenRepository.existsByToken(token);
  }

  /**
   * Blacklists a token so it can no longer be used, even if not expired. Used primarily during
   * logout to invalidate the user's current token.
   *
   * @param token The JWT token to blacklist
   * @param username The username associated with the token
   * @return true if the token was successfully blacklisted
   */
  public boolean blacklistToken(String token, String username) {
    try {
      Date expiryDate = extractExpiration(token);
      lk.slpa.mpma.backend.model.BlacklistedToken blacklistedToken =
          new lk.slpa.mpma.backend.model.BlacklistedToken(token, expiryDate, username);
      blacklistedTokenRepository.save(blacklistedToken);
      return true;
    } catch (Exception e) {
      return false;
    }
  }

  /**
   * Extracts the username from a JWT token.
   *
   * @param token The JWT token
   * @return The username contained in the token
   */
  // * Core identity extraction method
  public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  /**
   * Extracts a specific claim from a JWT token using a claims resolver function.
   *
   * @param <T> The type of the claim value
   * @param token The JWT token
   * @param claimsResolver Function to extract a specific claim
   * @return The claim value
   */
  // * Generic method to extract any claim from token
  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
  }

  /**
   * Extracts all claims from a JWT token.
   *
   * @param token The JWT token
   * @return All claims contained in the token
   */
  // ! Security sensitive - parses and validates token signature
  private Claims extractAllClaims(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(getSigningKey())
        .build()
        .parseClaimsJws(token)
        .getBody();
  }

  /**
   * Checks if a JWT token is expired.
   *
   * @param token The JWT token
   * @return True if the token is expired, false otherwise
   */
  // * Security feature - prevents use of expired tokens
  private Boolean isTokenExpired(String token) {
    final Date expiration = extractExpiration(token);
    return expiration.before(new Date());
  }

  /**
   * Extracts the expiration date from a JWT token.
   *
   * @param token The JWT token
   * @return The expiration date of the token
   */
  // * Utility method for token expiration checking
  public Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration);
  }

  /**
   * Cleans up expired tokens from the blacklist to prevent database bloat. This method should be
   * called periodically, perhaps via a scheduled task.
   *
   * @return The number of expired tokens removed from the blacklist
   */
  public int cleanupBlacklist() {
    return blacklistedTokenRepository.deleteExpiredTokens(new Date());
  }
}
