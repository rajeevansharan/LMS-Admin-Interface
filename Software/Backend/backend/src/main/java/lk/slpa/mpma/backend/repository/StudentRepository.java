package lk.slpa.mpma.backend.repository;

import java.util.List;
import java.util.Optional;
import lk.slpa.mpma.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for Student entities. Provides database operations for students using Spring
 * Data JPA. Extends JpaRepository to inherit standard CRUD operations.
 */
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

  /**
   * Finds a student by their username.
   *
   * @param username The username to search for
   * @return Optional containing the student if found, empty otherwise
   */
  Optional<Student> findByUsername(String username);

  /**
   * Finds a student by their email address.
   *
   * @param email The email address to search for
   * @return Optional containing the student if found, empty otherwise
   */
  Optional<Student> findByEmail(String email);

  /**
   * Finds all students enrolled in a specific course. This query uses a join with the
   * course_student table to find all students in a course.
   *
   * @param courseId The ID of the course
   * @return List of students enrolled in the specified course
   */
  @Query(
      value =
          "SELECT s.*, p.* FROM student s "
              + "JOIN person p ON s.person_id = p.person_id "
              + "JOIN course_student cs ON s.person_id = cs.student_id "
              + "WHERE cs.course_id = :courseId",
      nativeQuery = true)
  List<Student> findStudentsByCourseId(@Param("courseId") Long courseId);
}
