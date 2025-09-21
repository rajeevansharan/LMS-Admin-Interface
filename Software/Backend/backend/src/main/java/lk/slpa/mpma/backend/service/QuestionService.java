package lk.slpa.mpma.backend.service;

import java.util.List;
import lk.slpa.mpma.backend.dto.QuestionDTO;
import lk.slpa.mpma.backend.model.QuestionType;

/**
 * Service interface for managing question operations in the MPMA system.
 *
 * <p>This interface defines the contract for question management operations, including creation,
 * retrieval, and filtering of questions. It supports all question types through a unified DTO
 * approach.
 */
public interface QuestionService {

  /**
   * Creates a new question based on the provided DTO.
   *
   * @param questionDTO The question data to create
   * @return The created question as a DTO with generated ID
   */
  QuestionDTO createQuestion(QuestionDTO questionDTO);

  /**
   * Retrieves a question by its unique identifier.
   *
   * @param id The question ID
   * @return The question DTO
   */
  QuestionDTO getQuestionById(Long id);

  /**
   * Retrieves all questions in the system.
   *
   * @return A list of all question DTOs
   */
  List<QuestionDTO> getAllQuestions();

  /**
   * Retrieves all questions associated with a specific course.
   *
   * @param courseId The course ID
   * @return A list of question DTOs for the given course
   */
  List<QuestionDTO> getQuestionsByCourseId(Long courseId);

  /**
   * Retrieves all questions available to a specific lecturer. This includes questions from courses
   * they teach and from the global question bank.
   *
   * @param lecturerId The lecturer ID
   * @return A list of question DTOs available to the lecturer
   */
  List<QuestionDTO> getQuestionsByLecturerId(Long lecturerId);

  /**
   * Retrieves all questions from the global question bank (not tied to any course).
   *
   * @return A list of question DTOs from the global bank
   */
  List<QuestionDTO> getGlobalQuestions();

  /**
   * Deletes a question by its unique identifier.
   *
   * @param id The question ID to delete
   * @return true if the question was successfully deleted, false otherwise
   */
  boolean deleteQuestion(Long id);

  /**
   * Retrieves all questions of a specific type.
   *
   * @param questionType The type of questions to retrieve
   * @return A list of question DTOs of the specified type
   */
  List<QuestionDTO> getQuestionsByType(QuestionType questionType);

  /**
   * Retrieves all questions of a specific type available to a lecturer.
   *
   * @param lecturerId The lecturer ID
   * @param questionType The type of questions to retrieve
   * @return A list of question DTOs of the specified type available to the lecturer
   */
  List<QuestionDTO> getQuestionsByLecturerIdAndType(Long lecturerId, QuestionType questionType);

  /**
   * Updates an existing question.
   *
   * @param id The ID of the question to update
   * @param questionDTO The updated question data
   * @return The updated question as a DTO
   */
  QuestionDTO updateQuestion(Long id, QuestionDTO questionDTO);
}
