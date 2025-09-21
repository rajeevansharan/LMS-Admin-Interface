package lk.slpa.mpma.backend.service;

import java.util.List;
import java.util.Optional;

import lk.slpa.mpma.backend.dto.QuizAttemptDetailDTO;
import lk.slpa.mpma.backend.dto.StudentCountDTO;
import lk.slpa.mpma.backend.dto.StudentDTO;
import lk.slpa.mpma.backend.model.Student;

/**
 * Service interface for managing Student entities.
 *
 * <p>This service provides operations for retrieving students, particularly in the context of
 * course enrollment. It serves as an abstraction layer between controllers and the data access
 * layer.
 */
public interface StudentService {

  /**
   * Retrieves all students in the system.
   *
   * @return List of all students
   */
  List<Student> getAllStudents();

  /**
   * Retrieves a specific student by their ID.
   *
   * @param id The unique identifier of the student
   * @return The student with the specified ID
   */
  Student getStudentById(Long id);

  /**
   * Retrieves all students enrolled in a specific course.
   *
   * @param courseId The ID of the course
   * @return List of StudentDTO objects representing students enrolled in the course
   */
  List<StudentDTO> getStudentsByCourseId(Long courseId);

  QuizAttemptDetailDTO getQuizAttemptDetails(Long submissionId);

  Optional<Student> getStudentByUsername(String username);

  public StudentCountDTO getTotalStudentCount();

  Student updateStudent(StudentDTO studentDTO);
}
