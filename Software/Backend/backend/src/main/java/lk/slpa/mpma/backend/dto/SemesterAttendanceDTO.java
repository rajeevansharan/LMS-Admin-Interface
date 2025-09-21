package lk.slpa.mpma.backend.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class SemesterAttendanceDTO {
    private String studentId;
    private String studentName;
    private String indexNo;
    private String semesterId;
    private String semesterName;  // Added
    private Long courseId;
    private String courseName;
    private LocalDate date;
    private Boolean present;
    private Integer totalEnrolled;  // Added
    private Integer presentCount;  // Added
    private Integer absentCount;  // Added
    private Double attendancePercentage;  // Added
}