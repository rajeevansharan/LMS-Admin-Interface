package lk.slpa.mpma.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "material_document")
@Data
@EqualsAndHashCode(callSuper = true)
public class MaterialDocument extends MaterialSection {

  @Column(nullable = false)
  private String fileID; // Store the ID of the document

  @Column private String thumbnail;
}
