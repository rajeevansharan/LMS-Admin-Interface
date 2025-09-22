package com.LmsProject.AdminInterface.DTO;

import java.util.Date;
import lombok.Data;

@Data
public class AdminDTO {
  private Long personId;
  private String name;
  private String username;
  private String address;
  private Date dateOfBirth;
  private String phoneNumber;
  private String email;
  private String profilePicture;

  // No password or sensitive fields included
}
