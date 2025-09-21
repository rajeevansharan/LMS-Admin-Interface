package lk.slpa.mpma.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventResponseDTO {
  private Long id;
  private String title;
  private LocalDate date;
  private String description;
  private String createdBy;
  private String eventType; // "COURSE_EVENT" or "BATCH_EVENT"

  // CourseEvent specific fields
  private Long courseId;
  private String semesterId;
  private String courseName;
  private String semesterName;
  private String academicYear;
  private String batch;



}