// _FILEPATH: src/main/java/lk/slpa/mpma/backend/service/QuizService.java
package lk.slpa.mpma.backend.service;

import lk.slpa.mpma.backend.dto.QuizCreateRequestDTO;
import lk.slpa.mpma.backend.dto.QuizDTO;

public interface QuizService {

  // This method is for creating a new quiz.
  QuizDTO createQuiz(Long courseId, QuizCreateRequestDTO quizRequest);

  /**
   * Gets a quiz by its ID.
   * The implementation of this method will be responsible for building a QuizDTO
   * that is safe for students (i.e., it contains questions and options, but no answers).
   * This allows the same endpoint and service method to be used by both Lecturers and Students.
   */
  QuizDTO getQuizById(Long quizId);

  // Updates an existing quiz.
  QuizDTO updateQuiz(Long quizId, QuizCreateRequestDTO quizRequest);

  // Deletes a quiz.
  void deleteQuiz(Long quizId);


}