package lk.slpa.mpma.backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.Builder.Default; // <-- Add this import

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "semesters")
@Data
// @Setter is not needed here because @Data already includes it.
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Semester {
  @Id
  @Column(name = "semester_id", nullable = false, unique = true)
  private String semesterId;

  @Column(nullable = false)
  private String semesterName;

  @Column(nullable = false)
  private String academicYear;

  @JsonManagedReference
  @OneToMany(mappedBy = "semester", cascade = CascadeType.ALL, orphanRemoval = true)
  @Default // <--- THE FIX IS HERE
  private List<Course> courses = new ArrayList<>();

  public void addCourse(Course course) {
    courses.add(course);
    course.setSemester(this);
  }

  public void removeCourse(Course course) {
    courses.remove(course);
    course.setSemester(null);
  }
}