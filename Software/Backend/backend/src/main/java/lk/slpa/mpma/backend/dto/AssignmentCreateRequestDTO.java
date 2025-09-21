package lk.slpa.mpma.backend.dto;

import java.util.Date;
import lombok.Data;

@Data
public class AssignmentCreateRequestDTO {
  // Material fields
  private String title;
  private String description;
  private Boolean visible;

  // Activity fields
  private Date endDate; // The due date
  private Integer maxMarks;
  private Integer passMark;
  private Double weight;

  // Assignment-specific fields
  private String instruction;
  private String allowedFileTypes; // e.g., ".pdf,.docx"
  private Integer maxFileSize; // in MB
  private Integer maxFileCount;
}
