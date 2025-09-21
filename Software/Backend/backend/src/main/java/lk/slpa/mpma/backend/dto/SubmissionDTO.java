package lk.slpa.mpma.backend.dto;

import java.util.Date;
import lk.slpa.mpma.backend.model.Submission;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionDTO {

  private Long submissionId;
  private String studentId;
  private String studentName; // Add this to show the student's name in the UI
  private Date submissionDate;
  private String filePath;
  private Submission.SubmissionStatus status;
  private Double marksObtained;
  private String feedback;
}
