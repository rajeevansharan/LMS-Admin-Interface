package lk.slpa.mpma.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuestionReviewDTO {
  private Long questionId;
  private String questionText;
  private String studentAnswer;
  private String correctAnswer; // Can be a string representation of the correct answer
  private boolean isCorrect;
  private double marksObtained;
}
