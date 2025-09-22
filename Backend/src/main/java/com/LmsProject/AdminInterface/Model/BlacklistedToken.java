package com.LmsProject.AdminInterface.Model;

import jakarta.persistence.*;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "blacklisted_tokens")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlacklistedToken {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true, length = 512)
  private String token;


  @Column(nullable = false)
  private Date blacklistedAt;

  @Column(nullable = false)
  private Date expiresAt;

  @Column(length = 50)
  private String username;

  public BlacklistedToken(String token, Date expiresAt, String username) {
    this.token = token;
    this.blacklistedAt = new Date();
    this.expiresAt = expiresAt;
    this.username = username;
  }
}
