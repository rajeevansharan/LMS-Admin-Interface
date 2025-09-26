package com.LmsProject.AdminInterface.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.Date;
import lombok.Data;

@Entity
@Table(name = "student_response")
@Data
public class StudentResponse {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long responseId;

  @Column(nullable = false)
  private Long questionId;

  @Column(nullable = false)
  private Long studentId;

  @Column(columnDefinition = "TEXT")
  private String responseContent;

  private Boolean autoGraded;

  private Integer marksObtained;

  @Column(nullable = false)
  private Date submittedAt;
}
