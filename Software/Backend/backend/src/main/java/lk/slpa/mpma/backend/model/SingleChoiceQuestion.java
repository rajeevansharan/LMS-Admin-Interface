package lk.slpa.mpma.backend.model;

import jakarta.persistence.*;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

/**
 * Entity class representing a single-choice question in the MPMA quiz system.
 *
 * <p>This specialized question type extends the base Question class and adds support for multiple
 * answer options, where exactly one option is correct. Single-choice questions require students to
 * select the one correct answer from the provided options.
 */
@Entity
@Table(name = "single_choice_question")
@Data
@EqualsAndHashCode(callSuper = true)
@DiscriminatorValue("SINGLE_CHOICE")
public class SingleChoiceQuestion extends Question {

  /**
   * The list of all available options for this single-choice question. Uses a one-to-many
   * relationship with cascading operations to ensure options are created, updated, and deleted
   * along with the question.
   */
  @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
  @EqualsAndHashCode.Exclude // Prevent recursion
  @ToString.Exclude // Prevent recursion
  private List<QuestionOption> options;

  /**
   * The specific option that is marked as the correct answer. Only one option can be correct in a
   * single-choice question. This field is nullable to support the creation process where options
   * might be added before selecting the correct one.
   */
  @ManyToOne
  @JoinColumn(name = "correct_option_id", nullable = true)
  @EqualsAndHashCode.Exclude // Prevent recursion
  @ToString.Exclude // Prevent recursion
  private QuestionOption correctOption;

  /**
   * Default constructor that initializes the question type to SINGLE_CHOICE. This ensures
   * consistent question type for all instances of this class.
   */
  public SingleChoiceQuestion() {
    super();
    this.setQuestionType(QuestionType.SINGLE_CHOICE);
  }
}
