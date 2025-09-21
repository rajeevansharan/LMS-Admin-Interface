package lk.slpa.mpma.backend.dto;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementDTO {
  private Long materialId;
  private String title;
  private String description;
  private Date uploadDate;
  private boolean visible;
  private Long courseId;
  private String courseName;
  private Long uploaderId;
  private String uploaderName;
}
