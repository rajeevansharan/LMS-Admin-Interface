package lk.slpa.mpma.backend.controller;

import java.util.List;
import lk.slpa.mpma.backend.dto.AnnouncementDTO;
import lk.slpa.mpma.backend.model.Person.UserRole;
import lk.slpa.mpma.backend.service.AnnouncementService;
import lk.slpa.mpma.backend.service.LecturerService;
import lk.slpa.mpma.backend.util.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for handling announcement-related HTTP requests. Provides endpoints for managing
 * announcements across the platform.
 *
 * <p>Announcements are important communications from lecturers to students, and this controller
 * implements role-based access control for different operations.
 */
@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

  @Autowired private AnnouncementService announcementService;
  @Autowired private LecturerService lecturerService;
  @Autowired private SecurityUtil securityUtil;

  /**
   * Retrieves all announcements in the system. This operation is restricted to administrators only.
   *
   * @return ResponseEntity containing a list of all announcement DTOs
   */
  @GetMapping
  @PreAuthorize("hasRole('ADMINISTRATOR')")
  public ResponseEntity<List<AnnouncementDTO>> getAllAnnouncements() {
    List<AnnouncementDTO> announcements = announcementService.getAllAnnouncements();
    return ResponseEntity.ok(announcements);
  }

  /**
   * Retrieves a specific announcement by its ID. Accessible to both lecturers and students.
   *
   * @param id The unique identifier of the announcement
   * @return ResponseEntity containing the requested announcement
   */
  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('LECTURER', 'STUDENT')")
  public ResponseEntity<AnnouncementDTO> getAnnouncementById(@PathVariable Long id) {
    AnnouncementDTO announcement = announcementService.getAnnouncementById(id);
    return ResponseEntity.ok(announcement);
  }

  /**
   * Retrieves all announcements for a specific course. Accessible to both lecturers and students,
   * but students can only see visible announcements.
   *
   * @param courseId The unique identifier of the course
   * @return ResponseEntity containing a list of announcements for the course
   */
  @GetMapping("/course/{courseId}")
  @PreAuthorize("hasAnyRole('LECTURER', 'STUDENT')")
  public ResponseEntity<List<AnnouncementDTO>> getAnnouncementsByCourseId(
      @PathVariable Long courseId) {
    // Determine if the user is a student
    boolean viewAsStudent = securityUtil.getCurrentUserRole() == UserRole.STUDENT;

    List<AnnouncementDTO> announcements =
        announcementService.getAnnouncementsByCourseId(courseId, viewAsStudent);
    return ResponseEntity.ok(announcements);
  }

  /**
   * Creates a new announcement. Only lecturers can create announcements.
   *
   * @param announcementDTO The announcement data to create
   * @return ResponseEntity containing the newly created announcement
   */
  @PostMapping
  @PreAuthorize("hasRole('LECTURER')")
  public ResponseEntity<AnnouncementDTO> createAnnouncement(
      @RequestBody AnnouncementDTO announcementDTO) {
    // Get the authenticated username instead of ID
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String username = authentication.getName();

    // Find the lecturer by username and create announcement
    AnnouncementDTO createdAnnouncement =
        announcementService.createAnnouncementByUsername(announcementDTO, username);
    return new ResponseEntity<>(createdAnnouncement, HttpStatus.CREATED);
  }

  /**
   * Updates an existing announcement. Only lecturers can update announcements, typically the one
   * who created it.
   *
   * @param id The unique identifier of the announcement
   * @param announcementDTO The updated announcement data
   * @return ResponseEntity containing the updated announcement
   */
  @PutMapping("/{id}")
  @PreAuthorize("hasRole('LECTURER')")
  public ResponseEntity<AnnouncementDTO> updateAnnouncement(
      @PathVariable Long id, @RequestBody AnnouncementDTO announcementDTO) {
    // Get the authenticated username instead of ID
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String username = authentication.getName();

    AnnouncementDTO updatedAnnouncement =
        announcementService.updateAnnouncementByUsername(id, announcementDTO, username);
    return ResponseEntity.ok(updatedAnnouncement);
  }

  /**
   * Deletes an existing announcement. Only lecturers can delete announcements, typically the one
   * who created it.
   *
   * @param id The unique identifier of the announcement to delete
   * @return ResponseEntity with no content on successful deletion
   */
  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('LECTURER')")
  public ResponseEntity<Void> deleteAnnouncement(@PathVariable Long id) {
    // Get the authenticated username instead of ID
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String username = authentication.getName();

    announcementService.deleteAnnouncementByUsername(id, username);
    return ResponseEntity.noContent().build();
  }

  /**
   * Toggles the visibility of an announcement. Only lecturers can change visibility, typically the
   * one who created it.
   *
   * @param id The unique identifier of the announcement
   * @return ResponseEntity containing the updated announcement with new visibility
   */
  @PatchMapping("/{id}/toggle-visibility")
  @PreAuthorize("hasRole('LECTURER')")
  public ResponseEntity<AnnouncementDTO> toggleAnnouncementVisibility(@PathVariable Long id) {
    // Get the authenticated username instead of ID
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String username = authentication.getName();

    AnnouncementDTO updatedAnnouncement =
        announcementService.toggleAnnouncementVisibilityByUsername(id, username);
    return ResponseEntity.ok(updatedAnnouncement);
  }
}
