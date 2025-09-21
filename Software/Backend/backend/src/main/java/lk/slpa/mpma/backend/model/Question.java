package lk.slpa.mpma.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"quizzes"}) // Exclude collection to prevent toString loops
@EqualsAndHashCode(exclude = {"quizzes"}) // Exclude a collection from equals/hashCode
@Table(name = "questions")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "question_type_discriminator")
public abstract class Question {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String questionText;

  @JsonIgnore
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "course_id", nullable = true)
  private Course course;

  @Enumerated(EnumType.STRING)
  @Column(name = "question_type", nullable = false)
  private QuestionType questionType;

  @Column(name = "difficulty_level")
  private String difficultyLevel;

  @Column(name = "marks")
  private Integer marks;

  @Column(name = "correct_option_index", nullable = false)
  private Integer correctOptionIndexSC;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false, nullable = true)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at", nullable = true)
  private LocalDateTime updatedAt;

  @ManyToMany(mappedBy = "questions", fetch = FetchType.LAZY)
  @JsonIgnore // IMPORTANT: Prevents infinite loop during JSON serialization
  private Set<Quiz> quizzes = new HashSet<>();
}
