package lk.slpa.mpma.backend.security;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Filter to intercept all requests and check for JWT authentication. Validates JWT tokens and sets
 * up Spring Security context if valid.
 */
// ! SECURITY CRITICAL CLASS
// ! Intercepts all HTTP requests to validate JWT tokens
@Component
public class JwtRequestFilter extends OncePerRequestFilter {

  private static final Logger logger = LoggerFactory.getLogger(JwtRequestFilter.class);

  private final UserDetailsServiceImpl userDetailsService;
  private final JwtTokenUtil jwtTokenUtil;

  @Autowired
  public JwtRequestFilter(UserDetailsServiceImpl userDetailsService, JwtTokenUtil jwtTokenUtil) {
    this.userDetailsService = userDetailsService;
    this.jwtTokenUtil = jwtTokenUtil;
  }

  /**
   * Core filter method that processes each incoming HTTP request. Extracts JWT token, validates it,
   * and sets up authentication context.
   */
  // ! Main security filter - executed on every protected request
  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {

    final String requestTokenHeader = request.getHeader("Authorization");

    String username = null;
    String jwtToken = null;

    // * JWT Token is in the form "Bearer token". Remove Bearer word and get only the Token
    if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
      jwtToken = requestTokenHeader.substring(7);
      try {
        username = jwtTokenUtil.extractUsername(jwtToken);
      } catch (IllegalArgumentException e) {
        logger.warn("Unable to get JWT Token");
      } catch (ExpiredJwtException e) {
        // ! Security alert - expired token attempting to access system
        logger.warn("JWT Token has expired");
      }
    } else {
      logger.debug("JWT Token does not begin with Bearer String");
    }

    // * Once we get the token, validate it
    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
      UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

      // ? Validate token against stored user details
      if (jwtTokenUtil.validateToken(jwtToken, userDetails)) {
        // * Create authorities with ROLE_ prefix that Spring Security expects
        Collection<GrantedAuthority> authorities = createAuthorities(jwtToken);

        // * Build authentication object with user details and authorities
        UsernamePasswordAuthenticationToken authentication =
            new UsernamePasswordAuthenticationToken(userDetails, null, authorities);

        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        // ! Set authentication in context - this grants access to protected resources
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // * Log the authentication for debugging
        logger.debug("User authenticated with authorities: {}", authorities);
      }
    }
    chain.doFilter(request, response);
  }

  /**
   * Creates Spring Security authorities from JWT token claims. Extracts role information and
   * converts it to GrantedAuthority objects.
   *
   * @param token The JWT token containing role claims
   * @return Collection of authorities derived from the token
   */
  // * Converts JWT role claims to Spring Security authorities
  private Collection<GrantedAuthority> createAuthorities(String token) {
    List<GrantedAuthority> authorities = new ArrayList<>();

    try {
      // ? Extract the role claim from the JWT token
      String role = jwtTokenUtil.extractClaim(token, claims -> claims.get("role", String.class));

      if (role != null) {
        // * Add both formats of the role for maximum compatibility
        authorities.add(new SimpleGrantedAuthority("ROLE_" + role));
        authorities.add(new SimpleGrantedAuthority(role));

        logger.debug("Added authority: ROLE_{}", role);
      }
    } catch (Exception e) {
      // ! Security issue - unable to extract authorities
      logger.error("Error extracting authorities from JWT", e);
    }

    return authorities;
  }

  // TODO: Consider adding token blacklist check for revoked tokens
  // TODO: Implement rate limiting to prevent brute force attacks
}
