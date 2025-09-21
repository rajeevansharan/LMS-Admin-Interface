package lk.slpa.mpma.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for handling logout requests. Contains the JWT token that needs to be
 * invalidated.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LogoutRequestDTO {
  private String token;
}
