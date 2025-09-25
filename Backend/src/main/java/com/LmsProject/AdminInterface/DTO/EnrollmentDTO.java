package com.LmsProject.AdminInterface.DTO;

import com.LmsProject.AdminInterface.Model.Enrollment;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EnrollmentDTO {

  private String semester;
  private Long courseId;
  private String courseName;
  private Enrollment.EnrollmentStatus status;
  private String studentName;
  private String batch;
  private String username;
  private Long studentId;
  private String semesterId;
  private String academicYear;
}
