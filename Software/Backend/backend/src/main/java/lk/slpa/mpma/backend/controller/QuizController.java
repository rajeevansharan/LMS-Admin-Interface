// _FILEPATH: src/main/java/lk/slpa/mpma/backend/controller/QuizController.java
package lk.slpa.mpma.backend.controller;

import lk.slpa.mpma.backend.dto.QuizCreateRequestDTO;
import lk.slpa.mpma.backend.dto.QuizDTO;
import lk.slpa.mpma.backend.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class QuizController {

  @Autowired private QuizService quizService;

  @PostMapping("/courses/{courseId}/quizzes")
  @PreAuthorize("hasRole('LECTURER')")
  public ResponseEntity<QuizDTO> createQuiz(
          @PathVariable Long courseId, @RequestBody QuizCreateRequestDTO quizRequest) {
    QuizDTO newQuiz = quizService.createQuiz(courseId, quizRequest);
    return new ResponseEntity<>(newQuiz, HttpStatus.CREATED);
  }

  // This is the single, correct version of the method.
  @GetMapping("/quizzes/{quizId}")
  @PreAuthorize("hasRole('LECTURER') or hasRole('STUDENT')")
  public ResponseEntity<QuizDTO> getQuizById(@PathVariable Long quizId) {
    // The service layer will handle preparing the DTO correctly for the student.
    QuizDTO quiz = quizService.getQuizById(quizId);
    return ResponseEntity.ok(quiz);
  }

  @PutMapping("/quizzes/{quizId}")
  @PreAuthorize("hasRole('LECTURER')")
  public ResponseEntity<QuizDTO> updateQuiz(
          @PathVariable Long quizId, @RequestBody QuizCreateRequestDTO quizRequest) {
    QuizDTO updatedQuiz = quizService.updateQuiz(quizId, quizRequest);
    return ResponseEntity.ok(updatedQuiz);
  }

  @DeleteMapping("/quizzes/{quizId}")
  @PreAuthorize("hasRole('LECTURER')")
  public ResponseEntity<Void> deleteQuiz(@PathVariable Long quizId) {
    quizService.deleteQuiz(quizId);
    return ResponseEntity.noContent().build();
  }

  // THE DUPLICATE METHOD HAS BEEN REMOVED.
}