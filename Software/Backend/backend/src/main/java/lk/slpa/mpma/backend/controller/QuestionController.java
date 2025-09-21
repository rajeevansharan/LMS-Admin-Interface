package lk.slpa.mpma.backend.controller;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import lk.slpa.mpma.backend.dto.QuestionDTO;
import lk.slpa.mpma.backend.model.QuestionType;
import lk.slpa.mpma.backend.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing question resources.
 *
 * <p>This controller provides endpoints for creating, retrieving, and filtering questions. It
 * enforces role-based access control to ensure appropriate authorization for different operations.
 */
@RestController
@RequestMapping("/api/questions")
public class QuestionController {



  @Autowired private QuestionService questionService;

  /**
   * Creates a new question.
   *
   * <p>This endpoint requires LECTURER or ADMINISTRATOR role.
   *
   * @param questionDTO The question data to create
   * @return The created question with HTTP 201 CREATED status
   */
  @PostMapping
  @PreAuthorize("hasRole('LECTURER') or hasRole('ADMINISTRATOR')")
  public ResponseEntity<QuestionDTO> createQuestion(@RequestBody QuestionDTO questionDTO) {
    QuestionDTO createdQuestion = questionService.createQuestion(questionDTO);
    return new ResponseEntity<>(createdQuestion, HttpStatus.CREATED);
  }

  /**
   * Retrieves a question by its ID.
   *
   * <p>This endpoint is accessible to LECTURER, STUDENT, and ADMINISTRATOR roles.
   *
   * @param id The question ID
   * @return The question with HTTP 200 OK status
   */
  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('LECTURER', 'STUDENT', 'ADMINISTRATOR')")
  public ResponseEntity<QuestionDTO> getQuestionById(@PathVariable Long id) {
    QuestionDTO questionDTO = questionService.getQuestionById(id);
    return ResponseEntity.ok(questionDTO);
  }

  /**
   * Retrieves all questions in the system.
   *
   * <p>This endpoint requires LECTURER or ADMINISTRATOR role.
   *
   * @return A list of all questions with HTTP 200 OK status
   */
  @GetMapping
  @PreAuthorize("hasAnyRole('LECTURER', 'ADMINISTRATOR')")
  public ResponseEntity<List<QuestionDTO>> getAllQuestions() {
    List<QuestionDTO> questions = questionService.getAllQuestions();
    return ResponseEntity.ok(questions);
  }

  /**
   * Retrieves all questions for a specific course.
   *
   * <p>This endpoint is accessible to LECTURER, STUDENT, and ADMINISTRATOR roles.
   *
   * @param courseId The course ID
   * @return A list of questions for the course with HTTP 200 OK status
   */
  @GetMapping("/course/{courseId}")
  @PreAuthorize("hasAnyRole('LECTURER', 'STUDENT', 'ADMINISTRATOR')")
  public ResponseEntity<List<QuestionDTO>> getQuestionsByCourseId(@PathVariable Long courseId) {
    List<QuestionDTO> questions = questionService.getQuestionsByCourseId(courseId);
    return ResponseEntity.ok(questions);
  }

  /**
   * Retrieves all questions available to a specific lecturer. This includes questions from courses
   * they teach and from the global question bank.
   *
   * @param lecturerId The lecturer ID
   * @return A list of questions available to the lecturer with HTTP 200 OK status
   */
  @GetMapping("/lecturer/{lecturerId}")
  @PreAuthorize("hasAnyRole('LECTURER', 'ADMINISTRATOR')")
  public ResponseEntity<List<QuestionDTO>> getQuestionsByLecturerId(@PathVariable Long lecturerId) {
    List<QuestionDTO> questions = questionService.getQuestionsByLecturerId(lecturerId);
    return ResponseEntity.ok(questions);
  }

  /**
   * Retrieves all questions from the global question bank (not tied to any course).
   *
   * @return A list of questions from the global bank with HTTP 200 OK status
   */
  @GetMapping("/global")
  @PreAuthorize("hasAnyRole('LECTURER', 'ADMINISTRATOR')")
  public ResponseEntity<List<QuestionDTO>> getGlobalQuestions() {
    List<QuestionDTO> questions = questionService.getGlobalQuestions();
    return ResponseEntity.ok(questions);
  }

  /**
   * Deletes a question by its ID.
   *
   * <p>This endpoint requires LECTURER or ADMINISTRATOR role.
   *
   * @param id The question ID to delete
   * @return HTTP 204 NO_CONTENT if successful, or HTTP 404 NOT_FOUND if the question doesn't exist
   */
  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('LECTURER') or hasRole('ADMINISTRATOR')")
  public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
    try {
      boolean deleted = questionService.deleteQuestion(id);
      if (deleted) {
        return ResponseEntity.noContent().build();
      } else {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Failed to delete question");
      }
    } catch (EntityNotFoundException e) {
      return ResponseEntity.notFound().build();
    }
  }

  /**
   * Retrieves all questions of a specific type.
   *
   * <p>This endpoint requires LECTURER or ADMINISTRATOR role.
   *
   * @param questionType The type of questions to retrieve
   * @return A list of questions with HTTP 200 OK status
   */
  @GetMapping("/type/{questionType}")
  @PreAuthorize("hasRole('LECTURER') or hasRole('ADMINISTRATOR')")
  public ResponseEntity<List<QuestionDTO>> getQuestionsByType(
      @PathVariable QuestionType questionType) {
    List<QuestionDTO> questions = questionService.getQuestionsByType(questionType);
    return ResponseEntity.ok(questions);
  }

  /**
   * Retrieves all questions of a specific type available to a lecturer.
   *
   * <p>This endpoint requires LECTURER or ADMINISTRATOR role.
   *
   * @param lecturerId The ID of the lecturer
   * @param questionType The type of questions to retrieve
   * @return A list of questions with HTTP 200 OK status
   */
  @GetMapping("/lecturer/{lecturerId}/type/{questionType}")
  @PreAuthorize("hasRole('LECTURER') or hasRole('ADMINISTRATOR')")
  public ResponseEntity<List<QuestionDTO>> getQuestionsByLecturerIdAndType(
      @PathVariable Long lecturerId, @PathVariable QuestionType questionType) {
    List<QuestionDTO> questions =
        questionService.getQuestionsByLecturerIdAndType(lecturerId, questionType);
    return ResponseEntity.ok(questions);
  }

  /**
   * Updates an existing question by its ID.
   *
   * <p>This endpoint requires LECTURER or ADMINISTRATOR role.
   *
   * @param id The ID of the question to update
   * @param questionDTO The updated question data
   * @return The updated question with HTTP 200 OK status
   */
  @PutMapping("/{id}")
  @PreAuthorize("hasRole('LECTURER') or hasRole('ADMINISTRATOR')")
  public ResponseEntity<?> updateQuestion(
      @PathVariable Long id, @RequestBody QuestionDTO questionDTO) {
    try {
      QuestionDTO updatedQuestion = questionService.updateQuestion(id, questionDTO);
      return ResponseEntity.ok(updatedQuestion);
    } catch (EntityNotFoundException e) {
      return ResponseEntity.notFound().build();
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }
}
