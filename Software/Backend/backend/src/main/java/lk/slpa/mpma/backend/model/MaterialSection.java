package lk.slpa.mpma.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "material_section")
@Data
@EqualsAndHashCode(callSuper = true)
public class MaterialSection extends Material {
  @Column(nullable = false)
  private Integer sectionNumber;
}
