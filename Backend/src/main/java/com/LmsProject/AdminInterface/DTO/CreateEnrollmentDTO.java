package com.LmsProject.AdminInterface.DTO;

import com.LmsProject.AdminInterface.Model.Enrollment;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateEnrollmentDTO {
  private Long studentId;
  private String semesterId;
  private Long courseId;
  private String batch;
  private Enrollment.EnrollmentStatus status;
}
