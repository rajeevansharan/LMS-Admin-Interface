package lk.slpa.mpma.backend.model;

import jakarta.persistence.*;
import java.util.Date;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Entity class representing an assessable activity in the MPMA system.
 *
 * <p>This class extends the Material base class and serves as a parent class for different types of
 * assessable activities (quizzes, assignments, etc.). It adds assessment-specific attributes like
 * deadlines, marks, and grading weights.
 */
@Entity
@Table(name = "activity")
@Data
@EqualsAndHashCode(callSuper = true)
public class Activity extends Material {

  /** The deadline for completing the activity. Optional field - if null, there is no deadline. */
  @Column private Date endDate;

  /** The maximum marks that can be awarded for this activity. */
  @Column(nullable = false)
  private Integer maxMarks;

  /** The minimum marks required to pass this activity. */
  @Column(nullable = false)
  private Integer passMark;

  /**
   * The weight of this activity in relation to the overall course assessment. Expressed as a
   * decimal value (e.g., 0.2 for 20% of the final grade).
   */
  @Column(nullable = false)
  private Double weight;

  /**
   * The type of activity, represented by the ActivityType enum. Used for polymorphic queries and UI
   * differentiation.
   */
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private ActivityType activityType;

  /**
   * Enum defining the possible types of assessable activities. Each type corresponds to a specific
   * subclass of Activity.
   */
  public enum ActivityType {
    /** Assignments that require file submissions or text responses */
    ASSIGNMENT,

    /** Quizzes with various question types */
    QUIZ,
  }
}
