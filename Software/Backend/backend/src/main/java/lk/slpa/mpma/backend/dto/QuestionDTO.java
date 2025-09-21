package lk.slpa.mpma.backend.dto;

import java.util.List;
import lk.slpa.mpma.backend.model.QuestionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for Question entities in the MPMA system.
 *
 * <p>This DTO combines fields from all question types to support the transfer of question data
 * between the frontend and backend. It includes common fields for all question types and specific
 * fields for each question subtype, allowing a single endpoint to handle creation and retrieval of
 * any question type.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDTO {
  /** Unique identifier for the question. */
  private Long id;

  /** The actual text of the question presented to students. */
  private String questionText;

  /** Reference to the course that contains this question. */
  private Long courseId;

  /** The type of question (TRUE_FALSE, SINGLE_CHOICE, etc.). */
  private QuestionType questionType;

  /** The difficulty level of this question (e.g., "Easy", "Medium", "Hard"). */
  private String difficultyLevel;

  /** The number of marks/points awarded for correctly answering this question. */
  private Integer marks;

  /* === True/False Question Fields === */

  /** The correct answer for a true/false question. */
  private Boolean correctAnswerTF;

  /* === Single/Multiple Choice Question Fields === */

  /** List of option texts for single or multiple choice questions. */
  private List<String> optionsSCMC;

  /** Index of the correct option for single choice questions. */
  private Integer correctOptionIndexSC;

  /** Indices of correct options for multiple choice questions. */
  private List<Integer> correctOptionIndicesMC;

  /* === Short Answer Question Fields === */

  /** The correct answer text for short answer questions. */
  private String correctAnswerSA;

  /** Whether the answer comparison should be case-sensitive for short answer questions. */
  private Boolean caseSensitiveSA;

  /* === Essay Question Fields === */

  /** Guidelines provided to students about how to structure their essay response. */
  private String answerGuidelinesES;

  /** Optional maximum word count for essay responses. */
  private Integer wordLimitES;

  /* === Timestamp Fields === */

  /** Timestamp when the question was created */
  private String createdAt;

  /** Timestamp when the question was last updated */
  private String updatedAt;


}
