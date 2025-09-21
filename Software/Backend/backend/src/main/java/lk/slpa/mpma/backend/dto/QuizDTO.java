package lk.slpa.mpma.backend.dto;

import java.sql.Time;
import java.util.List;
import lombok.Data;

@Data
public class QuizDTO {
  private Long id;
  private String title;
  private String description;
  private Time timeLimit;
  private Integer maxAttempts;
  private Boolean shuffleQuestions;

  // We will send back a list of question details, not just IDs
  private List<QuestionInfoDTO> questions;
}
