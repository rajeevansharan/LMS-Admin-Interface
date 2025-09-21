package lk.slpa.mpma.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "lecturer")
@Data
@EqualsAndHashCode(callSuper = true)
public class Lecturer extends Person {

  private String department;

  @Column(name = "areas_of_interest")
  private String areasOfInterest;

  // Add OneToMany relationship for lectures with JSON annotation
  @JsonIgnore // Use JsonIgnore since we already have JsonBackReference on the other side
  @OneToMany(mappedBy = "lecturer")
  private Set<Lecture> lectures = new HashSet<>();
}
