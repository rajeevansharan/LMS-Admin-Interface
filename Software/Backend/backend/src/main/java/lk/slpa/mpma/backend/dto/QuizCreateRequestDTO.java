package lk.slpa.mpma.backend.dto;

import java.sql.Time;
import java.util.List;
import lombok.Data;

@Data
public class QuizCreateRequestDTO {

  private String title;
  private String description;
  private Boolean visible;

  // These fields are from the Activity parent class and are required.
  private Integer maxMarks;
  private Integer passMark;
  private Double weight;

  // These fields are specific to the Quiz and can have defaults.
  private Time timeLimit; // Optional, can be null
  private Integer maxAttempts = 1;
  private Boolean shuffleQuestions = false;

  // The ID of the course this quiz belongs to.
  private Long courseId;

  // The list of question IDs to include in the quiz.
  private List<Long> questionIds;
}
