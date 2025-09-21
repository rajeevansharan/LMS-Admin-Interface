package lk.slpa.mpma.backend.dto;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for Assignment materials. Used to serialize Assignment data when returning
 * from API endpoints.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentDTO {
  private Long materialId;
  private String title;
  private String description;
  private Date uploadDate;
  private Boolean visible;
  private Date endDate;
  private Integer maxMarks;
  private Integer passMark;
  private Double weight;
  private String instruction;
  private String allowedFileTypes;
  private Integer maxFileSize;
  private Integer maxFileCount;
  private String creatorName;
}
