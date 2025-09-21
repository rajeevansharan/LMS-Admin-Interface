package lk.slpa.mpma.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "material_linked")
@Data
@EqualsAndHashCode(callSuper = true)
public class MaterialLinked extends MaterialSection {

  @Column(nullable = false)
  private String title;

  @Column private String description;

  @Column(nullable = false)
  private String link; // Assuming want to store the URL or URI to the linked material

  @Column private String thumbnail;
}
