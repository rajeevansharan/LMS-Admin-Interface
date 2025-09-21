package lk.slpa.mpma.backend.model;

import jakarta.persistence.*;
import java.util.List;
import java.util.Set;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

/**
 * Entity class representing a multiple-choice question in the MPMA quiz system.
 *
 * <p>This specialized question type extends the base Question class and adds support for multiple
 * answer options, where more than one option can be correct. Multiple-choice questions require
 * students to select all correct options to receive full marks.
 */
@Entity
@Table(name = "multiple_choice_question")
@Data
@EqualsAndHashCode(callSuper = true)
@DiscriminatorValue("MULTIPLE_CHOICE") // Added DiscriminatorValue
public class MultipleChoiceQuestion extends Question {

  /**
   * The list of all available options for this multiple-choice question. Uses a one-to-many
   * relationship with cascading operations to ensure options are created, updated, and deleted
   * along with the question.
   */
  @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
  @EqualsAndHashCode.Exclude // Prevent recursion
  @ToString.Exclude // Prevent recursion
  private List<QuestionOption> options;

  /**
   * The subset of options that are marked as correct answers. Uses a many-to-many relationship with
   * a join table to track correct options. A student must select all of these options (and no
   * incorrect options) to get full marks.
   */
  @ManyToMany
  @JoinTable(
      name = "multiple_choice_correct_options",
      joinColumns = @JoinColumn(name = "question_id"),
      inverseJoinColumns = @JoinColumn(name = "option_id"))
  @EqualsAndHashCode.Exclude // Prevent recursion
  @ToString.Exclude // Prevent recursion
  private Set<QuestionOption> correctOptions;

  /**
   * Default constructor that initializes the question type to MULTIPLE_CHOICE. This ensures
   * consistent question type for all instances of this class.
   */
  public MultipleChoiceQuestion() {
    super(); // Call super constructor
    this.setQuestionType(QuestionType.MULTIPLE_CHOICE);
  }
}
