package lk.slpa.mpma.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.Date;
import lombok.Data;

@Entity
@Table(name = "student_response")
@Data
public class StudentResponse {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long responseId;

  @Column(nullable = false)
  private Long questionId;

  @Column(nullable = false)
  private Long studentId;

  @JsonIgnore
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "submission_id", nullable = false)
  private Submission submission;

  @Column(columnDefinition = "TEXT")
  private String responseContent;

  private Boolean autoGraded;

  private Integer marksObtained;

  @Column(nullable = false)
  private Date submittedAt;
}
