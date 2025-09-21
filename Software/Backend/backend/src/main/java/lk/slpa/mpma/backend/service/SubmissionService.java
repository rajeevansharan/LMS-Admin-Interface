package lk.slpa.mpma.backend.service;

import java.io.IOException; // <-- Added this import
import java.util.List;
import lk.slpa.mpma.backend.dto.GradeSubmissionRequestDTO;
import lk.slpa.mpma.backend.dto.QuizAttemptDetailDTO;
import lk.slpa.mpma.backend.dto.SubmissionDTO;
import lk.slpa.mpma.backend.model.Person;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface SubmissionService {

  /**
   * Creates a new submission for an assignment.
   *
   * @param assignmentId The ID of the assignment.
   * @param file The file being submitted by the student.
   * @return A DTO of the newly created submission.
   * @throws IOException if there is an error storing the file.
   */
  SubmissionDTO createSubmission(Long assignmentId, MultipartFile file) throws IOException;

  /**
   * Retrieves all submissions for a given activity (e.g., a quiz).
   *
   * @param activityId The ID of the activity.
   * @return A list of SubmissionDTOs.
   */
  List<SubmissionDTO> getSubmissionsByActivityId(String activityId);

  /**
   * Updates a submission with a grade and feedback.
   *
   * @param submissionId The ID of the submission to grade.
   * @param gradeRequest The DTO containing marks and feedback.
   * @return The updated SubmissionDTO.
   */
  SubmissionDTO gradeSubmission(
          Long submissionId, GradeSubmissionRequestDTO gradeRequest, Person grader);

  QuizAttemptDetailDTO getQuizAttemptDetails(Long submissionId);

  /**
   * Retrieves the submitted file for a given submission.
   *
   * @param submissionId The ID of the submission.
   * @return The file as a Resource.
   * @throws IOException if an error occurs while reading the file. // <-- Added this comment
   */

  Resource getSubmissionFile(Long submissionId) throws IOException;

}