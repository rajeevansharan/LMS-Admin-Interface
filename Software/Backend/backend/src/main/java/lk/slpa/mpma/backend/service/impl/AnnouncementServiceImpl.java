package lk.slpa.mpma.backend.service.impl;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import lk.slpa.mpma.backend.dto.AnnouncementDTO;
import lk.slpa.mpma.backend.exception.ResourceNotFoundException;
import lk.slpa.mpma.backend.exception.UnauthorizedAccessException;
import lk.slpa.mpma.backend.model.Course;
import lk.slpa.mpma.backend.model.Lecturer;
import lk.slpa.mpma.backend.model.Material;
import lk.slpa.mpma.backend.model.MaterialAnnouncement;
import lk.slpa.mpma.backend.model.Person;
import lk.slpa.mpma.backend.repository.AnnouncementRepository;
import lk.slpa.mpma.backend.repository.CourseRepository;
import lk.slpa.mpma.backend.repository.LecturerRepository;
import lk.slpa.mpma.backend.repository.PersonRepository;
import lk.slpa.mpma.backend.service.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AnnouncementServiceImpl implements AnnouncementService {

  @Autowired private AnnouncementRepository announcementRepository;
  @Autowired private CourseRepository courseRepository;
  @Autowired private LecturerRepository lecturerRepository;
  @Autowired private PersonRepository personRepository;

  @Override
  public List<AnnouncementDTO> getAllAnnouncements() {
    return announcementRepository.findAll().stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());
  }

  @Override
  public AnnouncementDTO getAnnouncementById(Long id) {
    MaterialAnnouncement announcement =
        announcementRepository
            .findById(id)
            .orElseThrow(
                () -> new ResourceNotFoundException("Announcement not found with id: " + id));
    return convertToDTO(announcement);
  }

  @Override
  public List<AnnouncementDTO> getAnnouncementsByCourseId(Long courseId, boolean viewAsStudent) {
    // Verify course exists
    courseRepository
        .findById(courseId)
        .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

    if (viewAsStudent) {
      // Students can only see visible announcements
      return announcementRepository.findByCourse_CourseIdAndVisible(courseId, true).stream()
          .map(this::convertToDTO)
          .collect(Collectors.toList());
    } else {
      // Lecturers can see all announcements
      return announcementRepository.findByCourse_CourseId(courseId).stream()
          .map(this::convertToDTO)
          .collect(Collectors.toList());
    }
  }

  @Override
  @Transactional
  public AnnouncementDTO createAnnouncement(AnnouncementDTO announcementDTO, Long lecturerId) {
    // Verify lecturer exists
    Lecturer lecturer =
        lecturerRepository
            .findById(lecturerId)
            .orElseThrow(
                () -> new ResourceNotFoundException("Lecturer not found with id: " + lecturerId));

    // Verify course exists
    Course course =
        courseRepository
            .findById(announcementDTO.getCourseId())
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        "Course not found with id: " + announcementDTO.getCourseId()));

    // Verify lecturer teaches this course
    if (!course.getLecturers().contains(lecturer)) {
      throw new UnauthorizedAccessException(
          "Lecturer is not authorized to create announcements for this course");
    }

    MaterialAnnouncement announcement = new MaterialAnnouncement();
    announcement.setTitle(announcementDTO.getTitle());
    announcement.setDescription(announcementDTO.getDescription());
    announcement.setUploadDate(new Date());
    announcement.setVisible(announcementDTO.isVisible());
    announcement.setCourse(course);
    announcement.setCreator(lecturer);
    announcement.setType(Material.MaterialType.ANNOUNCEMENT);

    MaterialAnnouncement savedAnnouncement = announcementRepository.save(announcement);
    return convertToDTO(savedAnnouncement);
  }

  @Override
  @Transactional
  public AnnouncementDTO updateAnnouncement(
      Long id, AnnouncementDTO announcementDTO, Long lecturerId) {
    // Verify announcement exists
    MaterialAnnouncement announcement =
        announcementRepository
            .findById(id)
            .orElseThrow(
                () -> new ResourceNotFoundException("Announcement not found with id: " + id));

    // Verify lecturer exists
    Lecturer lecturer =
        lecturerRepository
            .findById(lecturerId)
            .orElseThrow(
                () -> new ResourceNotFoundException("Lecturer not found with id: " + lecturerId));

    // Check if lecturer is the creator or teaches the course
    if (!announcement.getCreator().getPersonId().equals(lecturerId)
        && !announcement.getCourse().getLecturers().contains(lecturer)) {
      throw new UnauthorizedAccessException(
          "Lecturer is not authorized to update this announcement");
    }

    // Update fields
    announcement.setTitle(announcementDTO.getTitle());
    announcement.setDescription(announcementDTO.getDescription());
    announcement.setVisible(announcementDTO.isVisible());

    MaterialAnnouncement updatedAnnouncement = announcementRepository.save(announcement);
    return convertToDTO(updatedAnnouncement);
  }

  @Override
  @Transactional
  public boolean deleteAnnouncement(Long id, Long lecturerId) {
    // Verify announcement exists
    MaterialAnnouncement announcement =
        announcementRepository
            .findById(id)
            .orElseThrow(
                () -> new ResourceNotFoundException("Announcement not found with id: " + id));

    // Verify lecturer exists
    Lecturer lecturer =
        lecturerRepository
            .findById(lecturerId)
            .orElseThrow(
                () -> new ResourceNotFoundException("Lecturer not found with id: " + lecturerId));

    // Check if lecturer is the creator or teaches the course
    if (!announcement.getCreator().getPersonId().equals(lecturerId)
        && !announcement.getCourse().getLecturers().contains(lecturer)) {
      throw new UnauthorizedAccessException(
          "Lecturer is not authorized to delete this announcement");
    }

    announcementRepository.delete(announcement);
    return true;
  }

  @Override
  @Transactional
  public AnnouncementDTO toggleAnnouncementVisibility(Long id, Long lecturerId) {
    // Verify announcement exists
    MaterialAnnouncement announcement =
        announcementRepository
            .findById(id)
            .orElseThrow(
                () -> new ResourceNotFoundException("Announcement not found with id: " + id));

    // Verify lecturer exists
    Lecturer lecturer =
        lecturerRepository
            .findById(lecturerId)
            .orElseThrow(
                () -> new ResourceNotFoundException("Lecturer not found with id: " + lecturerId));

    // Check if lecturer is the creator or teaches the course
    if (!announcement.getCreator().getPersonId().equals(lecturerId)
        && !announcement.getCourse().getLecturers().contains(lecturer)) {
      throw new UnauthorizedAccessException(
          "Lecturer is not authorized to modify this announcement");
    }

    // Toggle visibility
    announcement.setVisible(!announcement.getVisible());

    MaterialAnnouncement updatedAnnouncement = announcementRepository.save(announcement);
    return convertToDTO(updatedAnnouncement);
  }

  @Override
  @Transactional
  public AnnouncementDTO createAnnouncementByUsername(
      AnnouncementDTO announcementDTO, String username) {
    // Print incoming data for debugging
    System.out.println("Creating announcement with title: " + announcementDTO.getTitle());
    System.out.println(
        "Creating announcement with description: " + announcementDTO.getDescription());

    // Validate title and description - must not be null or empty
    if (announcementDTO.getTitle() == null || announcementDTO.getTitle().trim().isEmpty()) {
      throw new IllegalArgumentException("Announcement title cannot be empty");
    }

    if (announcementDTO.getDescription() == null
        || announcementDTO.getDescription().trim().isEmpty()) {
      throw new IllegalArgumentException("Announcement description cannot be empty");
    }

    // Find the person by username
    Person person =
        personRepository
            .findByUsername(username)
            .orElseThrow(
                () -> new ResourceNotFoundException("User not found with username: " + username));

    // Check if the person is a lecturer
    Lecturer lecturer =
        lecturerRepository
            .findById(person.getPersonId())
            .orElseThrow(
                () ->
                    new ResourceNotFoundException("Lecturer not found with username: " + username));

    // Verify course exists
    Course course =
        courseRepository
            .findById(announcementDTO.getCourseId())
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        "Course not found with id: " + announcementDTO.getCourseId()));

    // Verify lecturer teaches this course
    if (!course.getLecturers().contains(lecturer)) {
      throw new UnauthorizedAccessException(
          "Lecturer is not authorized to create announcements for this course");
    }

    MaterialAnnouncement announcement = new MaterialAnnouncement();
    announcement.setTitle(announcementDTO.getTitle().trim());
    announcement.setDescription(announcementDTO.getDescription().trim());
    announcement.setUploadDate(new Date());
    announcement.setVisible(announcementDTO.isVisible());
    announcement.setCourse(course);
    announcement.setCreator(lecturer);
    announcement.setType(Material.MaterialType.ANNOUNCEMENT);

    // Ensure fields are not null before saving
    System.out.println("About to save announcement with title: " + announcement.getTitle());
    System.out.println(
        "About to save announcement with description: " + announcement.getDescription());

    MaterialAnnouncement savedAnnouncement = announcementRepository.save(announcement);
    return convertToDTO(savedAnnouncement);
  }

  @Override
  @Transactional
  public AnnouncementDTO updateAnnouncementByUsername(
      Long id, AnnouncementDTO announcementDTO, String username) {
    // Find the person by username
    Person person =
        personRepository
            .findByUsername(username)
            .orElseThrow(
                () -> new ResourceNotFoundException("User not found with username: " + username));

    // Check if the person is a lecturer
    Lecturer lecturer =
        lecturerRepository
            .findById(person.getPersonId())
            .orElseThrow(
                () ->
                    new ResourceNotFoundException("Lecturer not found with username: " + username));

    // Verify announcement exists
    MaterialAnnouncement announcement =
        announcementRepository
            .findById(id)
            .orElseThrow(
                () -> new ResourceNotFoundException("Announcement not found with id: " + id));

    // Check if lecturer is the creator or teaches the course
    if (!announcement.getCreator().getPersonId().equals(lecturer.getPersonId())
        && !announcement.getCourse().getLecturers().contains(lecturer)) {
      throw new UnauthorizedAccessException(
          "Lecturer is not authorized to update this announcement");
    }

    // Update fields
    announcement.setTitle(announcementDTO.getTitle());
    announcement.setDescription(announcementDTO.getDescription());
    announcement.setVisible(announcementDTO.isVisible());

    MaterialAnnouncement updatedAnnouncement = announcementRepository.save(announcement);
    return convertToDTO(updatedAnnouncement);
  }

  @Override
  @Transactional
  public boolean deleteAnnouncementByUsername(Long id, String username) {
    // Find the person by username
    Person person =
        personRepository
            .findByUsername(username)
            .orElseThrow(
                () -> new ResourceNotFoundException("User not found with username: " + username));

    // Check if the person is a lecturer
    Lecturer lecturer =
        lecturerRepository
            .findById(person.getPersonId())
            .orElseThrow(
                () ->
                    new ResourceNotFoundException("Lecturer not found with username: " + username));

    // Verify announcement exists
    MaterialAnnouncement announcement =
        announcementRepository
            .findById(id)
            .orElseThrow(
                () -> new ResourceNotFoundException("Announcement not found with id: " + id));

    // Check if lecturer is the creator or teaches the course
    if (!announcement.getCreator().getPersonId().equals(lecturer.getPersonId())
        && !announcement.getCourse().getLecturers().contains(lecturer)) {
      throw new UnauthorizedAccessException(
          "Lecturer is not authorized to delete this announcement");
    }

    announcementRepository.delete(announcement);
    return true;
  }

  @Override
  @Transactional
  public AnnouncementDTO toggleAnnouncementVisibilityByUsername(Long id, String username) {
    // Find the person by username
    Person person =
        personRepository
            .findByUsername(username)
            .orElseThrow(
                () -> new ResourceNotFoundException("User not found with username: " + username));

    // Check if the person is a lecturer
    Lecturer lecturer =
        lecturerRepository
            .findById(person.getPersonId())
            .orElseThrow(
                () ->
                    new ResourceNotFoundException("Lecturer not found with username: " + username));

    // Verify announcement exists
    MaterialAnnouncement announcement =
        announcementRepository
            .findById(id)
            .orElseThrow(
                () -> new ResourceNotFoundException("Announcement not found with id: " + id));

    // Check if lecturer is the creator or teaches the course
    if (!announcement.getCreator().getPersonId().equals(lecturer.getPersonId())
        && !announcement.getCourse().getLecturers().contains(lecturer)) {
      throw new UnauthorizedAccessException(
          "Lecturer is not authorized to modify this announcement");
    }

    // Toggle visibility
    announcement.setVisible(!announcement.getVisible());

    MaterialAnnouncement updatedAnnouncement = announcementRepository.save(announcement);
    return convertToDTO(updatedAnnouncement);
  }

  // Helper method to convert entity to DTO
  private AnnouncementDTO convertToDTO(MaterialAnnouncement announcement) {
    AnnouncementDTO dto = new AnnouncementDTO();
    dto.setMaterialId(announcement.getMaterialId());
    dto.setTitle(announcement.getTitle());
    dto.setDescription(announcement.getDescription());
    dto.setUploadDate(announcement.getUploadDate());
    dto.setVisible(announcement.getVisible());

    if (announcement.getCourse() != null) {
      dto.setCourseId(announcement.getCourse().getCourseId());
      dto.setCourseName(announcement.getCourse().getName());
    }

    if (announcement.getCreator() != null) {
      dto.setUploaderId(announcement.getCreator().getPersonId());
      dto.setUploaderName(announcement.getCreator().getName());
    }

    return dto;
  }
}
