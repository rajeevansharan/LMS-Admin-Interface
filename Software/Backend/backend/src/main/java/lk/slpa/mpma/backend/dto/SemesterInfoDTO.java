package lk.slpa.mpma.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SemesterInfoDTO {
    private String semesterId;
    private String semesterName;
    private String academicYear;
}