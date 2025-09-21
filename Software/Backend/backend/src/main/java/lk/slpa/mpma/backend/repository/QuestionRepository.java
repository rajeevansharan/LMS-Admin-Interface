package lk.slpa.mpma.backend.repository;

import java.util.List;
import lk.slpa.mpma.backend.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for {@link Question} entities.
 *
 * <p>This repository provides methods for querying and manipulating question data in the database.
 * It extends JpaRepository to inherit common CRUD operations and adds custom query methods specific
 * to question management.
 */
@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

  /**
   * Retrieves all questions associated with a specific course.
   *
   * @param courseId The unique identifier of the course
   * @return A list of questions belonging to the specified course
   */
  List<Question> findByCourse_CourseId(Long courseId);

  /**
   * Retrieves all questions associated with courses taught by a specific lecturer. This includes
   * questions directly linked to courses the lecturer teaches.
   *
   * @param lecturerId The unique identifier of the lecturer
   * @return A list of questions from courses taught by the specified lecturer
   */
  @Query(
      "SELECT DISTINCT q FROM Question q JOIN q.course c JOIN c.lecturers l WHERE l.personId ="
          + " :lecturerId AND q.course IS NOT NULL")
  List<Question> findByLecturerCourses(@Param("lecturerId") Long lecturerId);

  /**
   * Retrieves all questions not associated with any course (global question bank).
   *
   * @return A list of questions not tied to any specific course
   */
  List<Question> findByCourseIsNull();

  /**
   * Retrieves all questions for a lecturer, including both course-specific questions from their
   * courses and questions from the global question bank.
   *
   * @param lecturerId The unique identifier of the lecturer
   * @return A list of all questions available to the lecturer
   */
  @Query(
      "SELECT DISTINCT q, "
          + "CASE WHEN q.course IS NULL THEN 1 ELSE 0 END as courseNullOrder, "
          + "CASE WHEN l.personId = :lecturerId THEN 0 ELSE 1 END as lecturerOrder "
          + "FROM Question q LEFT JOIN q.course c LEFT JOIN c.lecturers l "
          + "WHERE (l.personId = :lecturerId) OR q.course IS NULL "
          + "ORDER BY courseNullOrder, lecturerOrder")
  List<Object[]> findAllQuestionsForLecturer(@Param("lecturerId") Long lecturerId);
}
