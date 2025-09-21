package lk.slpa.mpma.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Entity class representing a short answer question in the MPMA quiz system.
 *
 * <p>This specialized question type extends the base Question class and adds support for questions
 * that require a brief text response. Short answer questions expect concise answers that can be
 * automatically evaluated by comparing against the stored correct answer.
 */
@Entity
@Table(name = "short_answer_question")
@Data
@EqualsAndHashCode(callSuper = true)
@DiscriminatorValue("SHORT_ANSWER")
public class ShortAnswerQuestion extends Question {

  /** The correct answer text that will be used to evaluate student responses. */
  @Column(name = "correct_answer", nullable = false)
  private String correctAnswer;

  /**
   * Flag indicating whether the answer comparison should be case-sensitive. When false, "Answer"
   * and "answer" are considered equivalent.
   */
  @Column(name = "case_sensitive", nullable = false, columnDefinition = "BOOLEAN DEFAULT false")
  private Boolean caseSensitive;

  /**
   * Default constructor that initializes the question type to SHORT_ANSWER. This ensures consistent
   * question type for all instances of this class.
   */
  public ShortAnswerQuestion() {
    super();
    this.setQuestionType(QuestionType.SHORT_ANSWER);
  }
}
