package lk.slpa.mpma.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lk.slpa.mpma.backend.model.Person.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JwtResponseDTO {
  @JsonProperty("token")
  private String token;

  @JsonProperty("id")
  private Long id;

  @JsonProperty("username")
  private String username;

  @JsonProperty("name")
  private String name;

  @JsonProperty("role")
  private UserRole role;
}
