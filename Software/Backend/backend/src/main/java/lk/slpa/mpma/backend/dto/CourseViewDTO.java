package lk.slpa.mpma.backend.dto;

import java.util.Date;
import java.util.List;
import lk.slpa.mpma.backend.model.Enrollment;
import lk.slpa.mpma.backend.model.Semester;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CourseViewDTO {
  private Long courseId;
  private String courseName;
  private List<String> lecture;
  private String courseImage;
  private Enrollment.EnrollmentStatus status;
  private Date startDate;
  private String semesterId;
  private String semesterName;
  private String academicYear;}
