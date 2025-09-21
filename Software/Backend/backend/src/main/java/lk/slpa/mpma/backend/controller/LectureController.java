// filepath: /home/randitha/Desktop/IT/UoM/Level 2 Software
// Project/mpma/Software/Backend/backend/src/main/java/lk/slpa/mpma/backend/controller/LectureController.java
package lk.slpa.mpma.backend.controller;

import java.util.List;
import lk.slpa.mpma.backend.dto.LectureDTO;
import lk.slpa.mpma.backend.service.LectureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for handling lecture-related HTTP requests. Provides endpoints for managing
 * lecture resources within a specific course.
 *
 * <p>Access control is implemented using Spring Security annotations to restrict operations based
 * on user roles (LECTURER, STUDENT).
 */
@RestController
@RequestMapping("/api/courses/{courseId}/lectures") // Nested under courses
@RequiredArgsConstructor
public class LectureController {

  private final LectureService lectureService;

  /**
   * Retrieves all lectures for a specific course. Accessible to both lecturers and students.
   *
   * @param courseId The ID of the course to get lectures for
   * @return ResponseEntity containing a list of lectures for the course
   */
  @GetMapping
  @PreAuthorize("hasAnyRole('LECTURER', 'STUDENT')")
  public ResponseEntity<List<LectureDTO>> getLecturesByCourseId(@PathVariable Long courseId) {
    List<LectureDTO> lectures = lectureService.getLecturesByCourseId(courseId);
    return ResponseEntity.ok(lectures);
  }

  /**
   * Retrieves a specific lecture by its ID within a specific course. Accessible to both lecturers
   * and students.
   *
   * @param courseId The ID of the course that contains the lecture
   * @param lectureId The ID of the lecture to retrieve
   * @return ResponseEntity containing the requested lecture if found and belongs to the course
   */
  @GetMapping("/{lectureId}")
  @PreAuthorize("hasAnyRole('LECTURER', 'STUDENT')")
  public ResponseEntity<LectureDTO> getLectureById(
      @PathVariable Long courseId, @PathVariable Long lectureId) {
    // courseId might be used for validation if needed, e.g., ensure lecture belongs to course
    LectureDTO lecture = lectureService.getLectureById(lectureId);
    if (!lecture.getCourseId().equals(courseId)) {
      // Or throw a specific exception
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    return ResponseEntity.ok(lecture);
  }

  /**
   * Creates a new lecture for a specific course. Only accessible to lecturers.
   *
   * @param courseId The ID of the course to add the lecture to
   * @param lectureDTO The lecture data transfer object containing lecture details
   * @return ResponseEntity containing the newly created lecture
   */
  @PostMapping
  @PreAuthorize("hasRole('LECTURER')")
  public ResponseEntity<LectureDTO> createLecture(
      @PathVariable Long courseId, @RequestBody LectureDTO lectureDTO) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String username = authentication.getName();
    LectureDTO createdLecture = lectureService.createLecture(lectureDTO, courseId, username);
    return new ResponseEntity<>(createdLecture, HttpStatus.CREATED);
  }

  /**
   * Updates an existing lecture within a specific course. Only accessible to lecturers, typically
   * the one who created the lecture.
   *
   * @param courseId The ID of the course that contains the lecture
   * @param lectureId The ID of the lecture to update
   * @param lectureDTO The lecture data transfer object containing updated lecture details
   * @return ResponseEntity containing the updated lecture
   */
  @PutMapping("/{lectureId}")
  @PreAuthorize("hasRole('LECTURER')")
  public ResponseEntity<LectureDTO> updateLecture(
      @PathVariable Long courseId,
      @PathVariable Long lectureId,
      @RequestBody LectureDTO lectureDTO) {
    // courseId might be used for validation
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String username = authentication.getName();
    LectureDTO updatedLecture = lectureService.updateLecture(lectureId, lectureDTO, username);
    if (!updatedLecture.getCourseId().equals(courseId)) {
      // Or throw a specific exception
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // Indicate mismatch
    }
    return ResponseEntity.ok(updatedLecture);
  }

  /**
   * Deletes a lecture from a specific course. Only accessible to lecturers, typically the one who
   * created the lecture.
   *
   * @param courseId The ID of the course that contains the lecture
   * @param lectureId The ID of the lecture to delete
   * @return ResponseEntity with no content on successful deletion
   */
  @DeleteMapping("/{lectureId}")
  @PreAuthorize("hasRole('LECTURER')")
  public ResponseEntity<Void> deleteLecture(
      @PathVariable Long courseId, @PathVariable Long lectureId) {
    // courseId might be used for validation
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String username = authentication.getName();
    lectureService.deleteLecture(lectureId, username);
    return ResponseEntity.noContent().build();
  }
}
