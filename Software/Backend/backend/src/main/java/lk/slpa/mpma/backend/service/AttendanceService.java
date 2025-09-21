package lk.slpa.mpma.backend.service;

import jakarta.transaction.Transactional;
import lk.slpa.mpma.backend.dto.AttendanceReportDTO;
import lk.slpa.mpma.backend.dto.AttendanceUpdateDTO;
import lk.slpa.mpma.backend.dto.SemesterAttendanceDTO;
import lk.slpa.mpma.backend.model.*;
import lk.slpa.mpma.backend.repository.AttendanceRepository;
import lk.slpa.mpma.backend.repository.CourseRepository;
import lk.slpa.mpma.backend.repository.EnrollmentRepository;
import lk.slpa.mpma.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    public List<SemesterAttendanceDTO> getSemesterAttendance(String semesterId, String batch, LocalDate date) {
        List<SemesterAttendanceDTO> result = new ArrayList<>();

        // 1. Get all courses for the semester
        List<Course> courses = courseRepository.findBySemester_SemesterId(semesterId);

        // 2. For each course, get enrolled students filtered by batch
        for (Course course : courses) {
            List<Enrollment> enrollments = enrollmentRepository.findByCourse_CourseIdAndSemester_SemesterId(
                    course.getCourseId(), semesterId);

            // Filter students by batch if provided
            List<Enrollment> filteredEnrollments = enrollments.stream()
                    .filter(enrollment -> batch == null ||
                            enrollment.getStudent().getBatch().equals(batch))
                    .collect(Collectors.toList());

            // Calculate total enrolled students for this course
            int totalEnrolled = filteredEnrollments.size();

            // Get semester name from the first enrollment (all should have same semester)
            String semesterName = filteredEnrollments.isEmpty() ? "" :
                    filteredEnrollments.get(0).getSemester().getSemesterName();

            // Count present and absent students for this course on this date
            int presentCount = 0;
            int absentCount = 0;

            // First pass to count attendance
            for (Enrollment enrollment : filteredEnrollments) {
                Student student = enrollment.getStudent();
                Optional<Attendance> attendance = attendanceRepository.findByCourse_CourseIdAndStudent_PersonIdAndDate(
                        course.getCourseId(), student.getPersonId(), date);

                if (attendance.isPresent()) {
                    if (Boolean.TRUE.equals(attendance.get().getPresent())) {
                        presentCount++;
                    } else {
                        absentCount++;
                    }
                }
            }

            // Calculate attendance percentage
            double attendancePercentage = totalEnrolled > 0 ?
                    (presentCount * 100.0) / totalEnrolled : 0.0;

            // Second pass to create DTOs with all the information
            for (Enrollment enrollment : filteredEnrollments) {
                Student student = enrollment.getStudent();
                SemesterAttendanceDTO dto = new SemesterAttendanceDTO();
                dto.setStudentId(student.getPersonId().toString());
                dto.setStudentName(student.getName());
                dto.setSemesterId(semesterId);
                dto.setSemesterName(semesterName);
                dto.setCourseId(course.getCourseId());
                dto.setCourseName(course.getName());
                dto.setDate(date);
                dto.setTotalEnrolled(totalEnrolled);
                dto.setPresentCount(presentCount);
                dto.setAbsentCount(absentCount);
                dto.setAttendancePercentage(attendancePercentage);

                // Set individual attendance status
                Optional<Attendance> attendance = attendanceRepository.findByCourse_CourseIdAndStudent_PersonIdAndDate(
                        course.getCourseId(), student.getPersonId(), date);
                dto.setPresent(attendance.map(Attendance::getPresent).orElse(null));

                result.add(dto);
            }
        }

        return result;
    }

    public List<AttendanceReportDTO> getStudentAttendanceForSemester(Long studentId, String semesterId, String batch, LocalDate date) {
        List<AttendanceReportDTO> result = new ArrayList<>();

        // 1. Verify the student exists and belongs to the specified batch
        Optional<Student> studentOpt = studentRepository.findById(studentId);
        if (studentOpt.isEmpty() || !studentOpt.get().getBatch().equals(batch)) {
            return result; // or throw an exception
        }
        Student student = studentOpt.get();

        // 2. Get all courses for the semester that the student is enrolled in
        List<Enrollment> enrollments = enrollmentRepository.findByStudent_PersonIdAndSemester_SemesterId(
                studentId, semesterId);

        // 3. For each course, get the attendance record for the specified date
        for (Enrollment enrollment : enrollments) {
            Course course = enrollment.getCourse();
            Semester semester = enrollment.getSemester();

            Optional<Attendance> attendanceOpt = attendanceRepository.findByCourse_CourseIdAndStudent_PersonIdAndDate(
                    course.getCourseId(), studentId, date);

            // Create DTO for each course attendance
            AttendanceReportDTO dto = AttendanceReportDTO.forStudent(
                    studentId,
                    student.getName(),
                    course.getCourseId(),
                    course.getName(),
                    semesterId,
                    semester.getSemesterName(),
                    date,
                    attendanceOpt.map(Attendance::getPresent).orElse(null)
            );

            result.add(dto);
        }

        return result;
    }


    @Transactional
    public AttendanceReportDTO quickUpdateStudentAttendance(AttendanceUpdateDTO dto) {
        // Find or create attendance record
        Attendance attendance = attendanceRepository
                .findByCourse_CourseIdAndStudent_PersonIdAndDate(
                        dto.getCourseId(),
                        dto.getStudentId(),
                        dto.getDate())
                .orElseGet(() -> {
                    Attendance newAttendance = new Attendance();
                    // Set basic relationships - in a production app, you'd want to validate these exist
                    newAttendance.setStudent(studentRepository.getReferenceById(dto.getStudentId()));
                    newAttendance.setCourse(courseRepository.getReferenceById(dto.getCourseId()));
                    newAttendance.setDate(dto.getDate());
                    return newAttendance;
                });

        // Update attendance status
        attendance.setPresent(dto.getPresent());
        Attendance savedAttendance = attendanceRepository.save(attendance);

        // Build response DTO
        return AttendanceReportDTO.builder()
                .studentId(savedAttendance.getStudent().getPersonId())
                .studentName(savedAttendance.getStudent().getName()) // Added student name
                .courseId(savedAttendance.getCourse().getCourseId())
                .courseName(savedAttendance.getCourse().getName()) // Added course name
                .semesterId(dto.getSemesterId()) // Note: This isn't actually stored in Attendance entity
                .date(savedAttendance.getDate())
                .present(savedAttendance.getPresent())
                .build();
    }

    public List<SemesterAttendanceDTO> getStudentSemesterAttendanceByUsername(String username, String semesterId) {
        // First get the student
        Student student = studentRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with username: " + username));

        // Check if student is enrolled in the semester
        List<Enrollment> enrollments = enrollmentRepository.findByStudent_PersonIdAndSemester_SemesterId(
                student.getPersonId(), semesterId);

        if (enrollments.isEmpty()) {
            throw new IllegalArgumentException("Student is not enrolled in the specified semester");
        }

        // Get all attendances for the student in this semester
        List<Attendance> attendances = attendanceRepository.findByStudent_PersonIdAndCourse_Semester_SemesterId(
                student.getPersonId(), semesterId);

        // Group attendances by course and calculate statistics
        Map<Long, List<Attendance>> attendancesByCourse = attendances.stream()
                .collect(Collectors.groupingBy(a -> a.getCourse().getCourseId()));

        List<SemesterAttendanceDTO> result = new ArrayList<>();

        for (Enrollment enrollment : enrollments) {
            Course course = enrollment.getCourse();
            Semester semester = enrollment.getSemester();
            Long courseId = course.getCourseId();

            // Get attendances for this specific course
            List<Attendance> courseAttendances = attendancesByCourse.getOrDefault(courseId, Collections.emptyList());

            // Calculate statistics
            int totalClasses = courseAttendances.size();
            int presentCount = (int) courseAttendances.stream()
                    .filter(a -> Boolean.TRUE.equals(a.getPresent()))
                    .count();
            int absentCount = totalClasses - presentCount;
            double attendancePercentage = totalClasses > 0 ? (presentCount * 100.0) / totalClasses : 0.0;

            // Create DTO for each course
            SemesterAttendanceDTO dto = new SemesterAttendanceDTO();
            dto.setStudentId(student.getPersonId().toString());
            dto.setStudentName(student.getName());
            dto.setSemesterId(semesterId);
            dto.setSemesterName(semester.getSemesterName());
            dto.setCourseId(courseId);
            dto.setCourseName(course.getName());
            dto.setTotalEnrolled(getTotalEnrolledForCourse(courseId, semesterId)); // Helper method needed
            dto.setPresentCount(presentCount);
            dto.setAbsentCount(absentCount);
            dto.setAttendancePercentage(attendancePercentage);

            result.add(dto);
        }

        return result;
    }

    // Helper method to get total enrolled students for a course in a semester
    private Integer getTotalEnrolledForCourse(Long courseId, String semesterId) {
        return enrollmentRepository.countByCourse_CourseIdAndSemester_SemesterId(courseId, semesterId);
    }




}