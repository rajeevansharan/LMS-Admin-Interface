package lk.slpa.mpma.backend.controller;

import lk.slpa.mpma.backend.dto.AssignmentCreateRequestDTO;
import lk.slpa.mpma.backend.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/** REST Controller for Assignment operations. Handles CRUD operations for assignments. */
@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentController {

  private final CourseService courseService;

  /**
   * Update an existing assignment.
   *
   * @param assignmentId ID of the assignment to update
   * @param request Assignment data to update
   * @return ResponseEntity indicating success or failure
   */
  @PutMapping("/{assignmentId}")
  @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'LECTURER')")
  public ResponseEntity<Void> updateAssignment(
      @PathVariable Long assignmentId, @RequestBody AssignmentCreateRequestDTO request) {

    try {
      courseService.updateAssignment(assignmentId, request);
      return ResponseEntity.ok().build(); // HTTP 200: Success
    } catch (RuntimeException e) {
      System.err.println("Error updating assignment: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // HTTP 404: Not Found
    } catch (Exception e) {
      System.err.println("Error updating assignment: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .build(); // HTTP 500: Server Error
    }
  }
}
