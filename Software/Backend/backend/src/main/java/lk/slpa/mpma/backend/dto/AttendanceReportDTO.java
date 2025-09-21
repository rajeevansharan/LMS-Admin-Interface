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
public class AttendanceReportDTO {
  private Long studentId;
  private String studentName;
  private Long courseId;
  private String courseName;
  private String semesterId;
  private String semesterName;
  private LocalDate date;

  // For course-wide reports
  private Long totalStudents;
  private Long presentCount;
  private Long absentCount;

  // For individual student reports
  private Boolean present;

  // Static factory method for individual student attendance
  public static AttendanceReportDTO forStudent(Long studentId, String studentName,
                                               Long courseId, String courseName, String semesterId,
                                               String semesterName, LocalDate date, Boolean present) {
    return AttendanceReportDTO.builder()
            .studentId(studentId)
            .studentName(studentName)
            .courseId(courseId)
            .courseName(courseName)
            .semesterId(semesterId)
            .semesterName(semesterName)
            .date(date)
            .present(present)
            .build();
  }

  // Static factory method for course-wide attendance
  public static AttendanceReportDTO forCourse(Long courseId, String courseName,
                                              String semesterId, String semesterName, LocalDate date,
                                              Long totalStudents, Long presentCount) {
    return AttendanceReportDTO.builder()
            .courseId(courseId)
            .courseName(courseName)
            .semesterId(semesterId)
            .semesterName(semesterName)
            .date(date)
            .totalStudents(totalStudents)
            .presentCount(presentCount)
            .absentCount(totalStudents - presentCount)
            .build();
  }
}