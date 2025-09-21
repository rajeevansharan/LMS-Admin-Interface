package lk.slpa.mpma.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityGradeDTO {
  private Long activityId;
  private String activityTitle;
  private Double maxMarks;
  private Double marksObtained; // Null if not graded/submitted
}