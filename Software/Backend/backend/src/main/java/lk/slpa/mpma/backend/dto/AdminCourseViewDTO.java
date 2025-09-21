package lk.slpa.mpma.backend.dto;

import lk.slpa.mpma.backend.model.Enrollment.EnrollmentStatus;
import lombok.Data;

import java.util.List;

@Data
public class AdminCourseViewDTO {
    private Long courseId;
    private String courseName;
    private String courseImage;
    private String semesterId;
    private String semesterName;
    private String academicYear;
    private EnrollmentStatus enrollmentStatus;
    private int enrolledStudentCount;
    private List<LecturerDTO> lecturers;
    private List<StudentDTO> students;

    @Data
    public static class LecturerDTO {
        private Long lecturerId;
        private String name;
        private String email;
    }

    @Data
    public static class StudentDTO {
        private Long studentId;
        private String name;
        private String indexNo;
        private String username;
    }
}