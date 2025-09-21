package lk.slpa.mpma.backend.dto;

import java.util.Date;
import lk.slpa.mpma.backend.model.Material.MaterialType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialSimpleDTO {
  private Long materialId;
  private String title;
  private MaterialType type;
  private Date uploadDate;
  private Boolean visible;
  // Add other simple fields if needed, but avoid complex objects or collections
}
