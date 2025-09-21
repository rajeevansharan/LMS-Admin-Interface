package lk.slpa.mpma.backend.model;

/**
 * Enum representing the various types of questions supported in the MPMA system.
 *
 * <p>This enumeration defines the different question formats that can be created and used in
 * quizzes and assessments. Each type corresponds to a specific question implementation that extends
 * the base Question class.
 */
public enum QuestionType {
  /** Question requiring a true or false response. */
  TRUE_FALSE,

  /** Question with multiple options where exactly one is correct. */
  SINGLE_CHOICE,

  /** Question with multiple options where one or more may be correct. */
  MULTIPLE_CHOICE,

  /** Question requiring a brief text response. */
  SHORT_ANSWER,

  /** Question requiring an extended written response. */
  ESSAY
}
