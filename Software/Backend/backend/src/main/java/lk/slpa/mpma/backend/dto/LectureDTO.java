package lk.slpa.mpma.backend.dto;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LectureDTO {
  private Long lectureId;
  private Long courseId;
  private Long lecturerId; // ID of the lecturer who created/owns the lecture
  private String lecturerName; // Name of the lecturer
  private String title;
  private Date startDate;
  // Change duration from Date to Integer (representing minutes)
  private Integer durationMinutes;
  private String location;
  private String description;
}
