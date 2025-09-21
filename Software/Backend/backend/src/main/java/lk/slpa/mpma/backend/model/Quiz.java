package lk.slpa.mpma.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.sql.Time;
import java.util.HashSet;
import java.util.Set;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

/**
 * Entity class representing a quiz activity in the MPMA system.
 *
 * <p>This class extends the Activity base class and adds quiz-specific attributes such as time
 * limits, attempt restrictions, and question settings. Quizzes are used for assessments and
 * knowledge checks within courses.
 */
@Entity
@Table(name = "quiz")
@Data
@EqualsAndHashCode(
    callSuper = true,
    exclude = {"questions"}) // Exclude collections from equals/hashCode
@ToString(
    callSuper = true,
    exclude = {"questions"}) // Exclude collections from toString
public class Quiz extends Activity {

  /**
   * Maximum time allowed for completing the quiz. Optional field - if null, there is no time limit.
   */
  @Column private Time timeLimit;

  /** Maximum number of attempts allowed for this quiz. Defaults to 1 if not specified. */
  @Column(nullable = false, columnDefinition = "INTEGER DEFAULT 1")
  private Integer maxAttempts;

  /**
   * Flag indicating whether questions should be presented in random order. Useful for reducing
   * cheating by ensuring students get questions in different sequences. Defaults to false if not
   * specified.
   */
  @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT false")
  private Boolean shuffleQuestions;

  @JsonIgnore // IMPORTANT: Prevents infinite loop during JSON serialization
  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(
      name = "quiz_questions",
      joinColumns = @JoinColumn(name = "quiz_id"),
      inverseJoinColumns = @JoinColumn(name = "question_id"))
  private Set<Question> questions = new HashSet<>();
}
