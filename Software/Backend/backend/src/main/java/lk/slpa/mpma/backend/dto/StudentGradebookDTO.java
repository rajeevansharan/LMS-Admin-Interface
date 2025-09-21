package lk.slpa.mpma.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentGradebookDTO {
  private Long personId; // Using the primary key from Person
  private String studentName;
  private String studentEmail;
  private List<ActivityGradeDTO> grades;
}