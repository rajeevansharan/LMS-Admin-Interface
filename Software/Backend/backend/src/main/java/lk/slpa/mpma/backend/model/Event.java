// Event.java (Abstract base class)
package lk.slpa.mpma.backend.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Inheritance(strategy = InheritanceType.JOINED)
@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class Event {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Column(nullable = false)
  private String title;

  @Column(nullable = false)
  private LocalDate date;

  @Column(nullable = false)
  private String description;

  @Column(nullable = false)
  private String createdBy;
}
