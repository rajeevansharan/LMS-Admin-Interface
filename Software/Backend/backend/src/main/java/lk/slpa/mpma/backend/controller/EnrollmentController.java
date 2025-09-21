package lk.slpa.mpma.backend.controller;

import java.util.List;

import lk.slpa.mpma.backend.dto.AdminCourseViewDTO;
import lk.slpa.mpma.backend.dto.CreateEnrollmentDTO;
import lk.slpa.mpma.backend.dto.EnrollmentDTO;
import lk.slpa.mpma.backend.dto.SimpleCourseViewDTO;
import lk.slpa.mpma.backend.exception.NoEnrollmentsFoundException;
import lk.slpa.mpma.backend.exception.SemesterNotFoundException;
import lk.slpa.mpma.backend.exception.StudentNotFoundException;
import lk.slpa.mpma.backend.model.Enrollment;
import lk.slpa.mpma.backend.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class EnrollmentController {
    private final EnrollmentService enrollmentService;

    @GetMapping("/student/{username}")
    public ResponseEntity<List<EnrollmentDTO>> getStudentEnrollments(@PathVariable String username) {
        try {
            List<EnrollmentDTO> enrollments = enrollmentService.getEnrollmentsByStudent(username);
            return ResponseEntity.ok(enrollments);
        } catch (NoEnrollmentsFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }


    /**
     * Retrieves a list of enrolled course details for administrative viewing.
     * Quick view of courses enrolled by a student
     *
     * @param semesterId the ID of the semester to filter courses
     * @param batch      student batch
     * @return list of AdminCourseViewDTO containing enrolled course details for administration
     */
    @GetMapping("/courses/semester/{semesterId}/batch/{batch}")
    public List<SimpleCourseViewDTO> getCourseView(
            @PathVariable String semesterId,
            @PathVariable String batch) {
        return enrollmentService.getCourseView(semesterId, batch);
    }

    //admin detailed course view
    @GetMapping("/admin/course/{courseId}/semester/{semesterId}/batch/{batch}")
    public AdminCourseViewDTO getAdminCourseView(
            @PathVariable Long courseId,
            @PathVariable String semesterId,
            @PathVariable String batch) {
        return enrollmentService.getAdminCourseView(courseId, semesterId, batch);
    }

    @PostMapping
    @ExceptionHandler
    public ResponseEntity<?> createEnrollment(@RequestBody CreateEnrollmentDTO dto) {
        try {
            Enrollment enrollment = enrollmentService.createEnrollment(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(enrollment);
        } catch (StudentNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Student not found: " + ex.getMessage());
        } catch (SemesterNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Semester not found: " + ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("An error occurred: " + ex.getMessage());
        }
    }



}
