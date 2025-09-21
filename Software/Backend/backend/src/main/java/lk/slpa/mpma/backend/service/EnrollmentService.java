package lk.slpa.mpma.backend.service;

import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import lk.slpa.mpma.backend.dto.AdminCourseViewDTO;
import lk.slpa.mpma.backend.dto.CreateEnrollmentDTO;
import lk.slpa.mpma.backend.dto.EnrollmentDTO;
import lk.slpa.mpma.backend.dto.SimpleCourseViewDTO;
import lk.slpa.mpma.backend.exception.*;
import lk.slpa.mpma.backend.model.Course;
import lk.slpa.mpma.backend.model.Enrollment;
import lk.slpa.mpma.backend.model.Semester;
import lk.slpa.mpma.backend.model.Student;
import lk.slpa.mpma.backend.repository.CourseRepository;
import lk.slpa.mpma.backend.repository.EnrollmentRepository;
import lk.slpa.mpma.backend.repository.SemesterRepository;
import lk.slpa.mpma.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class EnrollmentService {
    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final SemesterRepository semesterRepository;
    private final CourseRepository courseRepository;

    public List<EnrollmentDTO> getEnrollmentsByStudent(String username) {
        List<Enrollment> enrollments = enrollmentRepository.findByStudent_Username(username);
        if (enrollments.isEmpty() ) {
            throw new NoEnrollmentsFoundException("No enrollments found for student with username: " + username);
        }

        return enrollments.stream()
                .map(enrollment -> {
                    EnrollmentDTO dto = new EnrollmentDTO();
                    dto.setSemesterId(enrollment.getSemester().getSemesterId());
                    dto.setSemester(enrollment.getSemester().getSemesterName());
                    // Courses now come from semester
                    if (!enrollment.getSemester().getCourses().isEmpty()) {
                        Course course = enrollment.getSemester().getCourses().get(0);
                        dto.setCourseId(course.getCourseId());
                        dto.setCourseName(course.getName());
                    }
                    dto.setStatus(enrollment.getStatus());
                    dto.setStudentName(enrollment.getStudent().getName());
                    dto.setBatch(enrollment.getStudent().getBatch());
                    dto.setUsername(enrollment.getStudent().getUsername());
                    dto.setAcademicYear(enrollment.getSemester().getAcademicYear());
                    dto.setStudentId(enrollment.getStudent().getPersonId());
                    return dto;
                })
                .collect(Collectors.toList());
    }
    public List<SimpleCourseViewDTO> getCourseView(String semesterId, String batch) {
        List<Enrollment> enrollments = enrollmentRepository.findBySemester_SemesterIdAndStudent_Batch(semesterId, batch);

        return enrollments.stream()
                .map(Enrollment::getSemester)
                .flatMap(semester -> semester.getCourses().stream())
                .distinct()
                .map(course -> {
                    SimpleCourseViewDTO dto = new SimpleCourseViewDTO();
                    dto.setCourseId(course.getCourseId());
                    dto.setCourseName(course.getName());
                    dto.setCourseImage(course.getCourseImage());
                    dto.setSemesterId(semesterId);
                    dto.setSemesterName(course.getSemester().getSemesterName());
                    dto.setAcademicYear(course.getSemester().getAcademicYear());
                    return dto;
                })
                .collect(Collectors.toList());


    }


    public AdminCourseViewDTO getAdminCourseView(Long courseId, String semesterId, String batch) {
        Semester semester = semesterRepository.findById(semesterId)
                .orElseThrow(() -> new SemesterNotFoundException("Semester with ID " + semesterId + " not found"));

        // Get course from semester's courses
        Course course = semester.getCourses().stream()
                .filter(c -> c.getCourseId().equals(courseId))
                .findFirst()
                .orElseThrow(() -> new CourseNotFoundException("Course with ID " + courseId + " not found in semester"));

        // Get enrollments for this semester and batch
        List<Enrollment> enrollments = enrollmentRepository.findBySemester_SemesterIdAndSemester_Courses_CourseIdAndStudent_Batch(
                semesterId, courseId, batch);

        AdminCourseViewDTO dto = new AdminCourseViewDTO();
        dto.setCourseId(course.getCourseId());
        dto.setCourseName(course.getName());
        dto.setCourseImage(course.getCourseImage());
        dto.setSemesterId(semester.getSemesterId());
        dto.setSemesterName(semester.getSemesterName());
        dto.setAcademicYear(semester.getAcademicYear());
        dto.setEnrolledStudentCount(enrollments.size());

        if (!enrollments.isEmpty()) {
            dto.setEnrollmentStatus(enrollments.get(0).getStatus());
        }

        dto.setLecturers(course.getLecturers().stream()
                .map(lecturer -> {
                    AdminCourseViewDTO.LecturerDTO lecturerDTO = new AdminCourseViewDTO.LecturerDTO();
                    lecturerDTO.setLecturerId(lecturer.getPersonId());
                    lecturerDTO.setName(lecturer.getName());
                    lecturerDTO.setEmail(lecturer.getEmail());
                    return lecturerDTO;
                })
                .collect(Collectors.toList()));

        dto.setStudents(enrollments.stream()
                .map(enrollment -> {
                    AdminCourseViewDTO.StudentDTO studentDTO = new AdminCourseViewDTO.StudentDTO();
                    Student student = enrollment.getStudent();
                    studentDTO.setStudentId(student.getPersonId());
                    studentDTO.setName(student.getName());
                    studentDTO.setUsername(student.getUsername());
                    return studentDTO;
                })
                .collect(Collectors.toList()));

        return dto;
    }

    // In EnrollmentService.java
    public List<SimpleCourseViewDTO> getEnrolledCoursesByUsername(String username) {
        List<Enrollment> enrollments = enrollmentRepository.findByStudent_UsernameAndCourseIsNotNull(username);

        return enrollments.stream()
                .map(enrollment -> {
                    SimpleCourseViewDTO dto = new SimpleCourseViewDTO();
                    Course course = enrollment.getCourse();
                    Semester semester = enrollment.getSemester();

                    dto.setCourseId(course.getCourseId());
                    dto.setCourseName(course.getName());
                    dto.setCourseImage(course.getCourseImage());
                    dto.setSemesterId(semester.getSemesterId());
                    dto.setSemesterName(semester.getSemesterName());
                    dto.setAcademicYear(semester.getAcademicYear());

                    return dto;
                })
                .collect(Collectors.toList());
    }


    @Transactional
    public Enrollment createEnrollment(CreateEnrollmentDTO dto) {
        // Validate and fetch entities
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new StudentNotFoundException("Student not found with id: " + dto.getStudentId()));

        Semester semester = semesterRepository.findById(dto.getSemesterId())
                .orElseThrow(() -> new SemesterNotFoundException("Semester not found with id: " + dto.getSemesterId()));

        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new CourseNotFoundException("Course not found with id: " + dto.getCourseId()));

        // Check for existing enrollment
        if (enrollmentRepository.existsByStudentAndSemesterAndCourse(student, semester, course)) {
            throw new IllegalStateException("Student is already enrolled in this course for the given semester");
        }

        // Create new enrollment
        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .semester(semester)
                .course(course)
                .enrollmentDate(LocalDate.now())
                .status(dto.getStatus())
                .build();

        return enrollmentRepository.save(enrollment);
    }

}
