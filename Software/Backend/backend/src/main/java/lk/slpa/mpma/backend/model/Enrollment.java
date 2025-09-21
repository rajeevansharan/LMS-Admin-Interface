package lk.slpa.mpma.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import lombok.*;

@Entity
@Table(
        name = "enrollments",
        uniqueConstraints =
        @UniqueConstraint(columnNames = {"student_id", "semester_id", "course_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enrollment {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "enrollment_id")
  private Long enrollmentId;

  @ManyToOne
  @JoinColumn(name = "student_id", nullable = false)
  private Student student;

  @ManyToOne
  @JoinColumn(name = "semester_id", nullable = false)
  private Semester semester;

  @ManyToOne
  @JoinColumn(name = "course_id", nullable = false)
  private Course course;

  @Column(name = "enrollment_date")
  private LocalDate enrollmentDate;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private EnrollmentStatus status;

  public enum EnrollmentStatus {
    ACTIVE,
    COMPLETED,
  }
}