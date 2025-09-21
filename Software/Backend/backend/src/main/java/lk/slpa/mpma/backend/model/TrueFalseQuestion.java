package lk.slpa.mpma.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Entity class representing a true/false question in the MPMA quiz system.
 *
 * <p>This specialized question type extends the base Question class and adds support for questions
 * that can only be answered as true or false. It stores the correct answer as a Boolean value.
 */
@Entity
@Table(name = "true_false_question")
@Data
@EqualsAndHashCode(callSuper = true)
@DiscriminatorValue("TRUE_FALSE")
public class TrueFalseQuestion extends Question {

  /** The correct answer for this true/false question. */
  @Column(name = "correct_answer", nullable = false)
  private Boolean correctAnswer;

  /**
   * Default constructor that initializes the question type to TRUE_FALSE. This ensures consistent
   * question type for all instances of this class.
   */
  public TrueFalseQuestion() {
    super();
    this.setQuestionType(QuestionType.TRUE_FALSE);
  }
}
