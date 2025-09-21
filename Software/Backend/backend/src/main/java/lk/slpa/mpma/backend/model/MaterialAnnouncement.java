package lk.slpa.mpma.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "material_announcement")
@Data
@EqualsAndHashCode(callSuper = true)
public class MaterialAnnouncement extends Material {
  // No additional fields needed - using title and description from parent Material class
}
