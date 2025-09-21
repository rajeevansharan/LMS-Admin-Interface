package lk.slpa.mpma.backend.service;

import lk.slpa.mpma.backend.dto.StudentGradebookDTO;
import java.util.List;

public interface GradebookService {
  /**
   * Generates a gradebook for a specific course.
   * The gradebook contains a list of all students in the course and their marks
   * for every assessable activity within that course.
   *
   * @param courseId The ID of the course.
   * @return A list of StudentGradebookDTOs, representing the full gradebook.
   */
  List<StudentGradebookDTO> getCourseGradebook(Long courseId);
}