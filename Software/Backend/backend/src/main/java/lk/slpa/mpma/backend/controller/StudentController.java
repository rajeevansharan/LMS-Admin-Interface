package lk.slpa.mpma.backend.controller;

import java.util.List;
import lk.slpa.mpma.backend.model.Student;
import lk.slpa.mpma.backend.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for handling student-related HTTP requests. Provides endpoints for retrieving
 * student data, particularly in the context of course enrollment.
 *
 * <p>Access control is implemented using Spring Security annotations to restrict operations based
 * on user roles.
 */
@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

  private final StudentService studentService;

  /**
   * Retrieves all students in the system. Only accessible to administrators.
   *
   * @return ResponseEntity containing a list of all students
   */
  @GetMapping
  @PreAuthorize("hasRole('ADMINISTRATOR')")
  public ResponseEntity<List<Student>> getAllStudents() {
    return ResponseEntity.ok(studentService.getAllStudents());
  }

  /**
   * Retrieves a specific student by their ID.
   *
   * @param id The unique identifier of the student
   * @return ResponseEntity containing the requested student
   */
  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'LECTURER', 'STUDENT')")
  public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
    return ResponseEntity.ok(studentService.getStudentById(id));
  }
}
