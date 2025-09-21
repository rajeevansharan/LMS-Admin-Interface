package lk.slpa.mpma.backend.dto;

import lk.slpa.mpma.backend.model.QuestionType;
import lombok.Data;

import java.util.List;

@Data
public class QuestionInfoDTO {
  private Long id;
  private String questionText;
  private QuestionType questionType;
  private Integer marks;

  private List<OptionDTO> options;
}
