package lk.slpa.mpma.backend.controller;

import java.io.IOException;
import java.util.List;
import lk.slpa.mpma.backend.dto.*;
import lk.slpa.mpma.backend.exception.ResourceNotFoundException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lk.slpa.mpma.backend.dto.ActivityDTO;
import lk.slpa.mpma.backend.dto.AssignmentCreateRequestDTO;
import lk.slpa.mpma.backend.dto.CourseCreateDTO;
import lk.slpa.mpma.backend.dto.CourseDTO; // This import is important
import lk.slpa.mpma.backend.dto.MaterialDocumentDTO;
import lk.slpa.mpma.backend.dto.StudentDTO;
import lk.slpa.mpma.backend.dto.StudentGradebookDTO;
import lk.slpa.mpma.backend.model.Course;
import lk.slpa.mpma.backend.model.Person;
import lk.slpa.mpma.backend.security.UserDetailsImpl;
import lk.slpa.mpma.backend.service.CourseService;
import lk.slpa.mpma.backend.service.GradebookService;
import lk.slpa.mpma.backend.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * REST Controller for handling course-related HTTP requests. Provides endpoints for managing course
 * resources including creation, retrieval, update, and deletion operations.
 *
 * <p>Access control is implemented using Spring Security annotations to restrict operations based
 * on user roles.
 */
@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

  private final CourseService courseService;
  private final StudentService studentService;
  private final GradebookService gradebookService;

  /**
   * Retrieves all courses available in the system. Accessible to all authenticated users.
   *
   * @return ResponseEntity containing a list of all courses
   */
  @GetMapping
  public ResponseEntity<List<Course>> getAllCourses() {
    return ResponseEntity.ok(courseService.getAllCourses());
  }

  /**
   * Retrieves a specific course by its ID.
   *
   * @param id The unique identifier of the course
   * @return ResponseEntity containing the requested course
   */
  @GetMapping("/{id}")
  public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
    return ResponseEntity.ok(courseService.getCourseById(id));
  }

  /**
   * Creates a new course in the system. Only users with ADMINISTRATOR role can access this
   * endpoint.
   *
   * @param course The course object to be created
   * @return ResponseEntity containing the newly created course
   */
  @PostMapping
 // @PreAuthorize("hasRole('ADMINISTRATOR')")
  @ExceptionHandler
  public ResponseEntity<?> createCourse(@RequestBody CourseCreateDTO course) {
    try {
      Course savedCourse = courseService.saveCreatedCourse(course);
      return ResponseEntity.status(HttpStatus.CREATED).body(savedCourse);
    } catch (IllegalArgumentException ex) {
      return ResponseEntity.status(HttpStatus.CONFLICT)
              .body("Course already exists: " + ex.getMessage());
    } catch (Exception ex) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
              .body("An error occurred: " + ex.getMessage());
    }
  }

  /**
   * Updates an existing course identified by its ID. Only users with ADMINISTRATOR or LECTURER
   * roles can access this endpoint.
   *
   * @param id The unique identifier of the course to update
   * @param course The updated course object
   * @return ResponseEntity containing the updated course
   */
  @PutMapping("/{id}")
  @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'LECTURER')")
  public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course course) {
    // Check if the course exists
    courseService.getCourseById(id);

    // Set the ID to ensure we're updating the correct entity
    course.setCourseId(id);

    return ResponseEntity.ok(courseService.saveCourse(course));
  }

  /**
   * Deletes a course from the system by its ID. Only users with ADMINISTRATOR role can access this
   * endpoint.
   *
   * @param id The unique identifier of the course to delete
   * @return ResponseEntity with no content on successful deletion
   */
  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMINISTRATOR')")
  public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
    courseService.deleteCourse(id);
    return ResponseEntity.noContent().build();
  }

  /**
   * Enrolls the current student in a specific course. Only users with STUDENT role can access this
   * endpoint.
   *
   * @param id The unique identifier of the course to enroll in
   * @return ResponseEntity containing a confirmation message
   */
  @PostMapping("/{id}/enroll")
  @PreAuthorize("hasRole('STUDENT')")
  public ResponseEntity<String> enrollInCourse(@PathVariable Long id) {
    // Implementation would depend on your enrollment logic
    Course course = courseService.getCourseById(id);
    // Add enrollment logic here
    return ResponseEntity.ok("Enrolled in course: " + course.getName());
  }

  /**
   * Adds teaching materials to a specific course. Only users with LECTURER role can access this
   * endpoint.
   *
   * @param id The unique identifier of the course to add materials to
   * @return ResponseEntity containing a confirmation message
   */
  @PostMapping("/{id}/materials")
  @PreAuthorize("hasRole('LECTURER')")
  public ResponseEntity<String> addCourseMaterial(@PathVariable Long id) {
    // Implementation would depend on your material management logic
    Course course = courseService.getCourseById(id);
    // Add material logic here
    return ResponseEntity.ok("Material added to course: " + course.getName());
  }

  /**
   * Retrieves all courses associated with a specific lecturer.
   *
   * @param lecturerId The unique identifier of the lecturer
   * @return ResponseEntity containing a list of courses taught by the lecturer
   */
  @GetMapping("/lecturer/{lecturerId}")
  public ResponseEntity<List<CourseDTO>> getCoursesByLecturerId(@PathVariable Long lecturerId) {
    return ResponseEntity.ok(courseService.getCoursesByLecturerId(lecturerId));
  }

  /**
   * Retrieves all students enrolled in a specific course. Only lecturers and administrators can
   * access this endpoint.
   *
   * @param id The unique identifier of the course
   * @return ResponseEntity containing a list of students enrolled in the course
   */
  @GetMapping("/{id}/participants")
  @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'LECTURER')")
  public ResponseEntity<List<StudentDTO>> getCourseParticipants(@PathVariable Long id) {
    // Verify that the course exists
    courseService.getCourseById(id);

    List<StudentDTO> students = studentService.getStudentsByCourseId(id);
    return ResponseEntity.ok(students);
  }

  @PostMapping("/{id}/materials/upload")
  @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'LECTURER')")
  public ResponseEntity<MaterialDocumentDTO> uploadCourseMaterial(
      @PathVariable("id") Long courseId,
      @RequestParam("file") MultipartFile file,
      @RequestParam(value = "description", required = false) String description) {
    try {
      MaterialDocumentDTO newMaterial =
          courseService.addCourseMaterialDocument(courseId, file, description);
      return ResponseEntity.status(HttpStatus.CREATED).body(newMaterial);
    } catch (IOException e) {
      // Log the exception
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    } catch (RuntimeException e) {
      // Handles user not found, course not found, etc.
      // Log the exception
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
  }

  @GetMapping("/{courseId}/activities")
  public ResponseEntity<List<ActivityDTO>> getCourseActivities(@PathVariable Long courseId) {
    List<ActivityDTO> activities = courseService.getActivitiesByCourseId(courseId);
    return ResponseEntity.ok(activities);
  }

  @PostMapping("/{courseId}/assignments")
  @PreAuthorize("hasAuthority('LECTURER')")
  public ResponseEntity<Void> createAssignmentInCourse(
      @PathVariable Long courseId,
      @RequestBody AssignmentCreateRequestDTO request,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {

    Person creator = userDetails.getPerson();
    courseService.createAssignment(courseId, request, creator);

    return new ResponseEntity<>(HttpStatus.CREATED);
  }

  /**
   * Retrieves the full gradebook for a course.
   * The gradebook includes all enrolled students and their marks for all activities.
   * Accessible to lecturers and administrators.
   *
   * @param id The ID of the course.
   * @return A ResponseEntity containing the list of student gradebook data.
   */
  @GetMapping("/{id}/gradebook")
  @PreAuthorize(
      "hasAnyRole('ADMINISTRATOR', 'LECTURER')") // <<< Consistent with participants endpoint
  public ResponseEntity<List<StudentGradebookDTO>> getCourseGradebook(@PathVariable Long id) {
    List<StudentGradebookDTO> gradebook = gradebookService.getCourseGradebook(id);
    return ResponseEntity.ok(gradebook);
  }

  /**
   * Creates a new course in the system. Only users with ADMINISTRATOR role can
   * access this
   * endpoint.
   *
   * @param courseCreateDTO The course object to be created. The name and start
   * @return ResponseEntity containing the newly created course
   */
  @PostMapping("/create")
  public ResponseEntity<Course> AdmincreateCourse(@RequestBody CourseCreateDTO courseCreateDTO) {
    Course course = new Course();

    // Set ID only if provided (e.g., for manual override or migration use cases)
    if (courseCreateDTO.getCourseId() != null) {
      course.setCourseId(courseCreateDTO.getCourseId());
    }

    course.setName(courseCreateDTO.getName());
    course.setStartDate(courseCreateDTO.getStartDate());

    return ResponseEntity.status(HttpStatus.CREATED).body(courseService.saveCourse(course));
  }

  /*
   * Retrieves all courses a specific student is enrolled in.
   *
   * @param studentId The unique identifier of the student
   * @return ResponseEntity containing a list of course DTOs the student is enrolled in
   */
  @GetMapping("/student/{studentId}")
  @PreAuthorize("hasAnyRole('STUDENT', 'ADMINISTRATOR')")
  public ResponseEntity<List<CourseDTO>> getCoursesByStudentId(@PathVariable Long studentId) {
    // This now calls the service method that returns a List<CourseDTO>
    return ResponseEntity.ok(courseService.getCoursesByStudentId(studentId));
  }
}
