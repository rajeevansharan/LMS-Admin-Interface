package lk.slpa.mpma.backend.repository;

import java.util.List;
import lk.slpa.mpma.backend.model.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for Lecture entities. Provides database operations for lectures using Spring
 * Data JPA. Extends JpaRepository to inherit standard CRUD operations.
 */
@Repository
public interface LectureRepository extends JpaRepository<Lecture, Long> {

  /**
   * Finds all lectures associated with a specific course.
   *
   * @param courseId The ID of the course to find lectures for
   * @return List of lectures belonging to the specified course
   */
  List<Lecture> findByCourse_CourseId(Long courseId);

  /**
   * Finds all lectures given by a specific lecturer.
   *
   * @param lecturerId The ID of the lecturer to find lectures for
   * @return List of lectures given by the specified lecturer
   */
  List<Lecture> findByLecturer_PersonId(Long lecturerId);
}
