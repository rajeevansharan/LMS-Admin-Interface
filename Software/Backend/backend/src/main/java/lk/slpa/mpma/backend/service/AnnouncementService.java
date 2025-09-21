package lk.slpa.mpma.backend.service;

import java.util.List;
import lk.slpa.mpma.backend.dto.AnnouncementDTO;

public interface AnnouncementService {

  /**
   * Get all announcements
   *
   * @return List of all announcements
   */
  List<AnnouncementDTO> getAllAnnouncements();

  /**
   * Get announcement by ID
   *
   * @param id Announcement ID
   * @return AnnouncementDTO if found
   */
  AnnouncementDTO getAnnouncementById(Long id);

  /**
   * Get announcements by course ID
   *
   * @param courseId Course ID
   * @param viewAsStudent If true, only returns visible announcements (for students)
   * @return List of announcements for the specified course
   */
  List<AnnouncementDTO> getAnnouncementsByCourseId(Long courseId, boolean viewAsStudent);

  /**
   * Create a new announcement
   *
   * @param announcementDTO The announcement data
   * @param lecturerId The ID of the lecturer creating the announcement
   * @return Created AnnouncementDTO
   */
  AnnouncementDTO createAnnouncement(AnnouncementDTO announcementDTO, Long lecturerId);

  /**
   * Create a new announcement by username
   *
   * @param announcementDTO The announcement data
   * @param username The username of the lecturer creating the announcement
   * @return Created AnnouncementDTO
   */
  AnnouncementDTO createAnnouncementByUsername(AnnouncementDTO announcementDTO, String username);

  /**
   * Update an existing announcement
   *
   * @param id Announcement ID
   * @param announcementDTO The updated announcement data
   * @param lecturerId The ID of the lecturer updating the announcement
   * @return Updated AnnouncementDTO
   */
  AnnouncementDTO updateAnnouncement(Long id, AnnouncementDTO announcementDTO, Long lecturerId);

  /**
   * Update an existing announcement by username
   *
   * @param id Announcement ID
   * @param announcementDTO The updated announcement data
   * @param username The username of the lecturer updating the announcement
   * @return Updated AnnouncementDTO
   */
  AnnouncementDTO updateAnnouncementByUsername(
      Long id, AnnouncementDTO announcementDTO, String username);

  /**
   * Delete an announcement
   *
   * @param id Announcement ID
   * @param lecturerId The ID of the lecturer deleting the announcement
   * @return true if deleted successfully
   */
  boolean deleteAnnouncement(Long id, Long lecturerId);

  /**
   * Delete an announcement by username
   *
   * @param id Announcement ID
   * @param username The username of the lecturer deleting the announcement
   * @return true if deleted successfully
   */
  boolean deleteAnnouncementByUsername(Long id, String username);

  /**
   * Toggle the visibility of an announcement
   *
   * @param id Announcement ID
   * @param lecturerId The ID of the lecturer toggling visibility
   * @return Updated AnnouncementDTO
   */
  AnnouncementDTO toggleAnnouncementVisibility(Long id, Long lecturerId);

  /**
   * Toggle the visibility of an announcement by username
   *
   * @param id Announcement ID
   * @param username The username of the lecturer toggling visibility
   * @return Updated AnnouncementDTO
   */
  AnnouncementDTO toggleAnnouncementVisibilityByUsername(Long id, String username);
}
