package lk.slpa.mpma.backend.dto;

import lk.slpa.mpma.backend.model.Enrollment;
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
