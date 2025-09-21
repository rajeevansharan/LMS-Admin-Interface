package lk.slpa.mpma.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminViewLectureDTO {
    private Long lecturerId;
    private String name;
    private String email;
}