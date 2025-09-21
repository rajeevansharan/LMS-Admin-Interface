package lk.slpa.mpma.backend.dto;

import java.util.Date;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO {
  private Long courseId;
  private String name;
  private Date startDate;
  private Date endDate;
  private Set<LecturerSimpleDTO> lecturers;
  private Set<MaterialSimpleDTO> materials;
  private Set<LectureSimpleDTO> lectures;
}
