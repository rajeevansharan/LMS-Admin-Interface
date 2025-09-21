package lk.slpa.mpma.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import lk.slpa.mpma.backend.dto.JwtResponseDTO;
import lk.slpa.mpma.backend.dto.LoginRequestDTO;
import lk.slpa.mpma.backend.dto.LogoutRequestDTO;
import lk.slpa.mpma.backend.security.JwtTokenUtil;
import lk.slpa.mpma.backend.security.UserDetailsImpl;
import lk.slpa.mpma.backend.service.LoginAttemptService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller responsible for authentication-related endpoints. Handles user login and manages JWT
 * token generation.
 */
// ! Main authentication controller
// ! Provides critical security endpoints for the entire application
@RestController
@RequestMapping("/api/auth")
public class AuthController {

  // * Core Spring Security components for authentication
  private final AuthenticationManager authenticationManager;
  private final JwtTokenUtil jwtTokenUtil;
  private final LoginAttemptService loginAttemptService;

  // * Logger for security audit trail and debugging
  private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

  /**
   * Constructs an AuthController with the required dependencies.
   *
   * @param authenticationManager Spring Security's authentication manager
   * @param jwtTokenUtil Utility for JWT token operations
   * @param loginAttemptService Service for logging login attempts
   */
  @Autowired
  public AuthController(
      AuthenticationManager authenticationManager,
      JwtTokenUtil jwtTokenUtil,
      LoginAttemptService loginAttemptService) {
    this.authenticationManager = authenticationManager;
    this.jwtTokenUtil = jwtTokenUtil;
    this.loginAttemptService = loginAttemptService;
  }

  /**
   * Authenticates a user and generates a JWT token upon successful authentication. This endpoint
   * handles user login by validating credentials and creating a session.
   *
   * @param loginRequest DTO containing the username and password
   * @param request The HTTP request containing client information
   * @return ResponseEntity with JWT token and user details if successful, error response otherwise
   */
  // ! Main authentication endpoint
  // ! Used by frontend login forms and API clients
  @PostMapping("/login")
  public ResponseEntity<?> authenticateUser(
      @RequestBody LoginRequestDTO loginRequest, HttpServletRequest request) {

    String ipAddress = getClientIpAddress(request);
    String userAgent = request.getHeader("User-Agent");
    logger.info(
        "Login attempt for username: {} from IP: {}", loginRequest.getUsername(), ipAddress);

    try {
      // ? Input validation - ensure username and password are provided
      if (loginRequest.getUsername() == null
          || loginRequest.getUsername().isEmpty()
          || loginRequest.getPassword() == null
          || loginRequest.getPassword().isEmpty()) {
        logger.warn("Login attempt with empty username or password from IP: {}", ipAddress);
        loginAttemptService.recordFailedLogin(
            loginRequest.getUsername(), ipAddress, userAgent, "Empty username or password");
        return ResponseEntity.badRequest()
            .body(Map.of("error", "Username and password must not be empty"));
      }

      // Check if user or IP is rate limited due to excessive failed attempts
      if (loginAttemptService.isUserRateLimited(loginRequest.getUsername())) {
        loginAttemptService.recordFailedLogin(
            loginRequest.getUsername(), ipAddress, userAgent, "User rate limited");

        // Use HashMap instead of Map.of() to avoid the limitation on number of entries
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", "Account temporarily locked");
        errorResponse.put(
            "message",
            "For your security, this account has been temporarily locked due to multiple failed"
                + " login attempts.");
        errorResponse.put(
            "details",
            "Please wait 15 minutes before trying again or contact the system administrator for"
                + " assistance.");
        errorResponse.put("code", "RATE_LIMITED");
        errorResponse.put("retryAfterMinutes", 15);

        return ResponseEntity.status(429).body(errorResponse);
      }

      // * Perform actual authentication through Spring Security
      Authentication authentication =
          authenticationManager.authenticate(
              new UsernamePasswordAuthenticationToken(
                  loginRequest.getUsername(), loginRequest.getPassword()));

      // * Store authentication in security context
      SecurityContextHolder.getContext().setAuthentication(authentication);

      // * Extract user details and generate JWT token
      UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
      String jwt = jwtTokenUtil.generateToken(userDetails);

      // * Log successful login and token details
      logger.info("Login successful for user: {}", userDetails.getUsername());
      logger.debug("Generated token: {}", jwt);

      // Record successful login attempt
      loginAttemptService.recordSuccessfulLogin(userDetails.getUsername(), ipAddress, userAgent);

      // * Create response with all necessary user information
      JwtResponseDTO response =
          new JwtResponseDTO(
              jwt,
              userDetails.getPerson().getPersonId(),
              userDetails.getUsername(),
              userDetails.getPerson().getName(),
              userDetails.getPerson().getUserRole());

      logger.debug("Response payload: {}", response);
      return ResponseEntity.ok(response);

    } catch (BadCredentialsException e) {
      // ! Security alert - invalid credentials
      logger.warn(
          "Invalid credentials for username: {} from IP: {}",
          loginRequest.getUsername(),
          ipAddress);

      // Record failed login attempt
      loginAttemptService.recordFailedLogin(
          loginRequest.getUsername(), ipAddress, userAgent, "Invalid credentials");

      return ResponseEntity.status(401).body(Map.of("error", "Invalid username or password"));
    } catch (Exception e) {
      // ! Critical error - unexpected authentication failure
      logger.error(
          "Unexpected error during login attempt for {} from IP: {}",
          loginRequest.getUsername(),
          ipAddress,
          e);

      // Record failed login attempt with error details
      loginAttemptService.recordFailedLogin(
          loginRequest.getUsername(), ipAddress, userAgent, "System error: " + e.getMessage());

      return ResponseEntity.status(500)
          .body(Map.of("error", "An unexpected error occurred. Please try again later."));
    }
  }

  /**
   * Invalidates a JWT token by adding it to the blacklist. This endpoint implements server-side
   * logout functionality to ensure that tokens can't be reused after logout.
   *
   * @param logoutRequest The logout request containing the token to invalidate
   * @param request The HTTP request containing client information
   * @return ResponseEntity with success/failure message
   */
  @PostMapping("/logout")
  public ResponseEntity<?> logoutUser(
      @RequestBody LogoutRequestDTO logoutRequest, HttpServletRequest request) {

    String ipAddress = getClientIpAddress(request);
    String userAgent = request.getHeader("User-Agent");

    try {
      // Extract username and token from the request
      String token = logoutRequest.getToken();

      if (token != null && !token.isEmpty()) {
        // Extract username from token for logging
        String username = jwtTokenUtil.extractUsername(token);

        // Add token to blacklist
        boolean blacklisted = jwtTokenUtil.blacklistToken(token, username);

        if (blacklisted) {
          logger.info("User {} successfully logged out from IP: {}", username, ipAddress);

          // Record logout attempt
          loginAttemptService.recordLogout(username, ipAddress, userAgent);

          // Clear the security context
          SecurityContextHolder.clearContext();
          return ResponseEntity.ok(Map.of("message", "Logout successful"));
        } else {
          logger.warn(
              "Failed to blacklist token during logout for user {} from IP: {}",
              username,
              ipAddress);
        }
      } else {
        logger.warn("Logout attempt with empty token from IP: {}", ipAddress);
        return ResponseEntity.badRequest().body(Map.of("error", "Token must not be empty"));
      }

      // Clear security context even if token blacklisting failed
      SecurityContextHolder.clearContext();
      return ResponseEntity.ok(Map.of("message", "Logout processed"));

    } catch (Exception e) {
      logger.error("Error during logout from IP: {}", ipAddress, e);
      return ResponseEntity.status(500).body(Map.of("error", "An error occurred during logout"));
    }
  }

  /**
   * Extract client IP address from request, handling proxy forwarding. Converts IPv6 localhost
   * address to a more readable format.
   *
   * @param request The HTTP request
   * @return The client's IP address
   */
  private String getClientIpAddress(HttpServletRequest request) {
    String xForwardedForHeader = request.getHeader("X-Forwarded-For");
    if (xForwardedForHeader != null && !xForwardedForHeader.isEmpty()) {
      // X-Forwarded-For can contain multiple IPs for proxies - get the first one
      return xForwardedForHeader.split(",")[0].trim();
    }

    String ipAddress = request.getRemoteAddr();

    // Make localhost addresses more readable in logs
    if (ipAddress.equals("0:0:0:0:0:0:0:1") || ipAddress.equals("::1")) {
      return "localhost (IPv6)";
    } else if (ipAddress.equals("127.0.0.1")) {
      return "localhost (IPv4)";
    }

    return ipAddress;
  }

  // TODO: Add endpoint for token refresh
  // TODO: Add password reset capability
}
