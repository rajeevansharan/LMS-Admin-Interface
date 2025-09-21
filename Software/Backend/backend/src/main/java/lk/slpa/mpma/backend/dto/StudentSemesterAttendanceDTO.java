package lk.slpa.mpma.backend.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentSemesterAttendanceDTO {
    private String semesterName;
    private Long courseId;
    private String courseName;
    private String academicYear;
    private LocalDate date;
    private Boolean present;
}