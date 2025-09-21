package lk.slpa.mpma.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "assignment")
@Data
@EqualsAndHashCode(callSuper = true)
public class Assignment extends Activity {

  @Column private String instruction;

  @Column private String allowedFileTypes;

  @Column(nullable = false)
  private Integer maxFileSize;

  // It's assumed that students are usually instructed to upload .zip files, hence this is set to 1.
  @Column(nullable = false, columnDefinition = "INTEGER DEFAULT 1")
  private Integer maxFileCount;
}
