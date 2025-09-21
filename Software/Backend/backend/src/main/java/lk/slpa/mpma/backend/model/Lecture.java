package lk.slpa.mpma.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.util.Date;
import lombok.Data;

@Entity
@Table(name = "lecture")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
public class Lecture {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "lecture_id", nullable = false)
  private Long lectureId;

  // Replace courseId with proper relationship
  @JsonBackReference
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "course_id", nullable = false)
  private Course course;

  // Replace personId with proper relationship
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "lecturer_id", nullable = false)
  private Lecturer lecturer;

  @Column(nullable = false)
  private String title;

  @Column(nullable = false)
  private Date startDate;

  @Column(nullable = false)
  private String location;

  // Change duration from Date to Integer (representing minutes)
  @Column() private Integer durationMinutes;

  @Column(nullable = false)
  private String description;
}
