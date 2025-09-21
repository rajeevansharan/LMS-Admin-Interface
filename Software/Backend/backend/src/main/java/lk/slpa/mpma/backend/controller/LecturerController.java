package lk.slpa.mpma.backend.controller;

import java.util.List;
import lk.slpa.mpma.backend.model.Lecturer;
import lk.slpa.mpma.backend.service.LecturerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for managing lecturer-related operations. Provides endpoints for CRUD operations
 * on lecturer resources. This controller is responsible for handling HTTP requests related to
 * lecturers.
 */
@RestController
@RequestMapping("/api/lecturers")
@RequiredArgsConstructor
public class LecturerController {

  private final LecturerService lecturerService;

  /**
   * Retrieves all lecturers from the system.
   *
   * @return ResponseEntity containing a list of all lecturer entities
   */
  @GetMapping
  public ResponseEntity<List<Lecturer>> getAllLecturers() {
    return ResponseEntity.ok(lecturerService.getAllLecturers());
  }

  /**
   * Retrieves a specific lecturer by their ID.
   *
   * @param id The unique identifier of the lecturer
   * @return ResponseEntity containing the requested lecturer entity
   */
  @GetMapping("/{id}")
  public ResponseEntity<Lecturer> getLecturerById(@PathVariable Long id) {
    return ResponseEntity.ok(lecturerService.getLecturerById(id));
  }

  /**
   * Creates a new lecturer in the system.
   *
   * @param lecturer The lecturer entity to be created
   * @return ResponseEntity containing the newly created lecturer entity
   */
  @PostMapping
  public ResponseEntity<Lecturer> createLecturer(@RequestBody Lecturer lecturer) {
    return ResponseEntity.status(HttpStatus.CREATED).body(lecturerService.saveLecturer(lecturer));
  }

  /**
   * Updates an existing lecturer's information. First checks if the lecturer exists, then updates
   * their information.
   *
   * @param id The unique identifier of the lecturer to update
   * @param lecturer The updated lecturer entity
   * @return ResponseEntity containing the updated lecturer entity
   */
  @PutMapping("/{id}")
  public ResponseEntity<Lecturer> updateLecturer(
      @PathVariable Long id, @RequestBody Lecturer lecturer) {
    // First check if the lecturer exists
    lecturerService.getLecturerById(id);

    // Set the ID to ensure we're updating the correct entity
    lecturer.setPersonId(id);

    return ResponseEntity.ok(lecturerService.saveLecturer(lecturer));
  }

  /**
   * Deletes a lecturer from the system.
   *
   * @param id The unique identifier of the lecturer to delete
   * @return ResponseEntity with no content on successful deletion
   */
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteLecturer(@PathVariable Long id) {
    lecturerService.deleteLecturer(id);
    return ResponseEntity.noContent().build();
  }

  /**
   * Retrieves all lecturers belonging to a specific department.
   *
   * @param department The name of the department
   * @return ResponseEntity containing a list of lecturers in the specified department
   */
  @GetMapping("/department/{department}")
  public ResponseEntity<List<Lecturer>> getLecturersByDepartment(@PathVariable String department) {
    return ResponseEntity.ok(lecturerService.getLecturersByDepartment(department));
  }
}
