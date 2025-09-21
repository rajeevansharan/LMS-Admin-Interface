package lk.slpa.mpma.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Entity class representing an essay question in the MPMA quiz system.
 *
 * <p>This specialized question type extends the base Question class and adds support for questions
 * that require an extended written response. Essay questions typically need manual grading by
 * faculty members and can have guidelines and word limits to help structure student responses.
 */
@Entity
@Table(name = "essay_question")
@Data
@EqualsAndHashCode(callSuper = true)
@DiscriminatorValue("ESSAY")
public class EssayQuestion extends Question {

  /** Guidelines provided to students about how to structure their essay response. */
  @Column(name = "answer_guidelines", columnDefinition = "TEXT")
  private String answerGuidelines;

  /** Optional maximum word count for the essay response. */
  @Column(name = "word_limit")
  private Integer wordLimit;

  /**
   * Default constructor that initializes the question type to ESSAY. This ensures consistent
   * question type for all instances of this class.
   */
  public EssayQuestion() {
    super();
    this.setQuestionType(QuestionType.ESSAY);
  }
}
