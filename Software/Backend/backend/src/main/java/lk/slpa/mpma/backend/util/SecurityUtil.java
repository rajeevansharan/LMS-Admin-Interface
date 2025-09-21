package lk.slpa.mpma.backend.util;

import java.util.Optional; // <-- Add this import
import lk.slpa.mpma.backend.model.Person.UserRole;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

/** Utility class for Security operations. */
@Component
public class SecurityUtil {

  // --- START: NEW METHOD TO FIX THE ERROR ---
  /**
   * Gets the username of the currently authenticated user. This is typically the 'subject' claim in
   * a JWT.
   *
   * @return An Optional containing the username if a user is authenticated, or an empty Optional if
   *     no user is authenticated.
   */
  public static Optional<String> getCurrentUsername() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
      return Optional.empty();
    }

    // Standard way to get the username from Spring Security's Authentication object
    return Optional.ofNullable(authentication.getName());
  }

  // --- END: NEW METHOD TO FIX THE ERROR ---

  /**
   * Get the current authenticated user's ID
   *
   * @return Long representing the user ID
   */
  public Long getCurrentUserId() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
      System.err.println("Authentication is null or not authenticated");
      return null;
    }

    Object principal = authentication.getPrincipal();
    System.err.println(
        "Principal class: " + (principal != null ? principal.getClass().getName() : "null"));

    // Try to extract ID from JWT authentication token
    if (authentication instanceof JwtAuthenticationToken) {
      JwtAuthenticationToken jwtAuth = (JwtAuthenticationToken) authentication;
      try {
        // Print JWT token details for debugging
        System.err.println("JWT Token details: " + jwtAuth.getToken());
        System.err.println("JWT Claims: " + jwtAuth.getToken().getClaims());

        Object idClaim = jwtAuth.getToken().getClaim("id");
        if (idClaim != null) {
          System.err.println(
              "Found ID claim: " + idClaim + " of type " + idClaim.getClass().getName());
          if (idClaim instanceof Number) {
            return ((Number) idClaim).longValue();
          } else if (idClaim instanceof String) {
            return Long.valueOf((String) idClaim);
          }
        } else {
          System.err.println("ID claim is null in JWT token");
        }
      } catch (Exception e) {
        System.err.println("Error extracting ID from JWT: " + e.getMessage());
        e.printStackTrace();
      }
    }

    // If JWT extraction fails, try UserDetails
    if (principal instanceof UserDetails) {
      UserDetails userDetails = (UserDetails) principal;
      System.err.println("UserDetails username: " + userDetails.getUsername());

      // In some Spring Security implementations, the ID might be stored in authorities
      System.err.println("UserDetails authorities: " + userDetails.getAuthorities());

      try {
        // Try to parse the username as an ID
        return Long.valueOf(userDetails.getUsername());
      } catch (NumberFormatException e) {
        System.err.println("Username cannot be converted to user ID: " + e.getMessage());
      }
    }

    // Print all authentication details for debugging
    System.err.println("Authentication details:");
    System.err.println("  Name: " + authentication.getName());
    System.err.println(
        "  Credentials: " + (authentication.getCredentials() != null ? "present" : "null"));
    System.err.println("  Authorities: " + authentication.getAuthorities());
    System.err.println("  Details: " + authentication.getDetails());

    // No fallback anymore - this will force us to fix the actual issue
    return null;
  }

  /**
   * Get the current authenticated user's role
   *
   * @return UserRole of the current user
   */
  public UserRole getCurrentUserRole() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
      return null;
    }

    // Try to get role from JWT claims first
    if (authentication instanceof JwtAuthenticationToken) {
      JwtAuthenticationToken jwtAuth = (JwtAuthenticationToken) authentication;
      try {
        Object roleClaim = jwtAuth.getToken().getClaim("role");
        if (roleClaim != null && roleClaim instanceof String) {
          String roleString = (String) roleClaim;
          return UserRole.valueOf(roleString);
        }
      } catch (Exception e) {
        System.err.println("Error extracting role from JWT: " + e.getMessage());
      }
    }

    // If JWT extraction fails, get role from authorities
    if (!authentication.getAuthorities().isEmpty()) {
      String role = authentication.getAuthorities().iterator().next().getAuthority();

      // Remove ROLE_ prefix if present (added by Spring Security)
      if (role.startsWith("ROLE_")) {
        role = role.substring(5); // "ROLE_".length() == 5
      }

      return UserRole.valueOf(role);
    }

    return null;
  }

  /**
   * Check if the current user is the same as the provided user ID
   *
   * @param userId ID of the user to check against
   * @return boolean true if current user is the provided user ID
   */
  public boolean isCurrentUser(Long userId) {
    Long currentUserId = getCurrentUserId();
    return currentUserId != null && currentUserId.equals(userId);
  }

  /**
   * Check if the current user has the specified role
   *
   * @param role Role to check against
   * @return boolean true if current user has the specified role
   */
  public boolean hasRole(UserRole role) {
    return role != null && role.equals(getCurrentUserRole());
  }
}
