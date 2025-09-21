package lk.slpa.mpma.backend.model;

import jakarta.persistence.*;
import java.util.Date;
import lombok.Data;

@Entity
@Table(name = "submission")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
public class Submission {

  @Id
  @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
  @Column(name = "submission_id", nullable = false)
  private Long submissionId;

  @Column private String activityId;

  @Column private String studentId;

  @Column private Date submissionDate;

  @Column private String filePath;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private SubmissionStatus status;

  @Column private Double marksObtained;

  @Column private String feedback;

  @Column private Long gradedBy;

  @Column private Date gradingDate;

  public enum SubmissionStatus {
    SUBMITTED,
    GRADED,
    LATE,
    REJECTED
  }
}
