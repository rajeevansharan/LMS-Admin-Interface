package lk.slpa.mpma.backend.dto;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LectureSimpleDTO {
  private Long lectureId;
  private String title;
  private Date startDate;
  private String location;
  private String description;
  // Add other simple fields if needed
}
