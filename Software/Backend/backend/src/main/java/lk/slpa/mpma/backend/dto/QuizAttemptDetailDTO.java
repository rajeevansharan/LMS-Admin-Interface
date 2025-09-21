package lk.slpa.mpma.backend.dto;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuizAttemptDetailDTO {
  private String studentName;
  private String quizTitle;
  private double totalMarks;
  private List<QuestionReviewDTO> questions;
}
