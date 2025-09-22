package com.LmsProject.AdminInterface.DTO;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for Student entities.
 *
 * <p>This DTO is used to transfer student data between the backend and frontend, without exposing
 * sensitive information like passwords.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentDTO {
  private Long id;
  private String name;
  private String username;
  private String email;
  private String phoneNumber;
  private Date dateOfBirth;
  private String address;
  private String role;
}
