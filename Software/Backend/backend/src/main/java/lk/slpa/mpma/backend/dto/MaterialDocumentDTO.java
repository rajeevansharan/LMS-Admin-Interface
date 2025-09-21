package lk.slpa.mpma.backend.dto;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MaterialDocumentDTO {

  private Long materialId;
  private String title;
  private String description;
  private String fileUrl; // We'll return the full URL/ID
  private Date uploadDate;
  private Boolean visible;
  private String creatorName;
}
