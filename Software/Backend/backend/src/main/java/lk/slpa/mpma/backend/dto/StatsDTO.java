package lk.slpa.mpma.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatsDTO {
  private long students;
  private long lecturers;
  private long trainers;
  private long trainees;
}
