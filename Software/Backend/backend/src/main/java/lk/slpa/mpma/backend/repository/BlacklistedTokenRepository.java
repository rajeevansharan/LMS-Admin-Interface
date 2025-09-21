package lk.slpa.mpma.backend.repository;

import java.util.Date;
import lk.slpa.mpma.backend.model.BlacklistedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/** Repository for managing blacklisted tokens in the database. */
@Repository
public interface BlacklistedTokenRepository extends JpaRepository<BlacklistedToken, Long> {

  /**
   * Checks if a token exists in the blacklist.
   *
   * @param token The token to check
   * @return true if the token is blacklisted, false otherwise
   */
  boolean existsByToken(String token);

  /**
   * Clean up tokens that have already expired to prevent database bloat.
   *
   * @param now The current date/time
   * @return The number of records deleted
   */
  @Modifying
  @Transactional
  @Query("DELETE FROM BlacklistedToken b WHERE b.expiresAt < ?1")
  int deleteExpiredTokens(Date now);
}
