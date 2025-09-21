package lk.slpa.mpma.backend.service.impl;

import java.util.List;
import java.util.stream.Collectors;
import lk.slpa.mpma.backend.dto.LectureDTO;
import lk.slpa.mpma.backend.exception.ResourceNotFoundException;
import lk.slpa.mpma.backend.exception.UnauthorizedException;
import lk.slpa.mpma.backend.model.Course;
import lk.slpa.mpma.backend.model.Lecture;
import lk.slpa.mpma.backend.model.Lecturer;
import lk.slpa.mpma.backend.repository.CourseRepository;
import lk.slpa.mpma.backend.repository.LectureRepository;
import lk.slpa.mpma.backend.repository.LecturerRepository;
import lk.slpa.mpma.backend.service.LectureService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LectureServiceImpl implements LectureService {

  private final LectureRepository lectureRepository;
  private final CourseRepository courseRepository;
  private final LecturerRepository lecturerRepository;

  @Override
  @Transactional(readOnly = true)
  public List<LectureDTO> getLecturesByCourseId(Long courseId) {
    if (!courseRepository.existsById(courseId)) {
      throw new ResourceNotFoundException("Course not found with id: " + courseId);
    }
    List<Lecture> lectures = lectureRepository.findByCourse_CourseId(courseId);
    return lectures.stream().map(this::convertToDTO).collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public LectureDTO getLectureById(Long id) {
    Lecture lecture =
        lectureRepository
            .findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Lecture not found with id: " + id));
    return convertToDTO(lecture);
  }

  @Override
  @Transactional
  public LectureDTO createLecture(LectureDTO lectureDTO, Long courseId, String lecturerUsername) {
    Course course =
        courseRepository
            .findById(courseId)
            .orElseThrow(
                () -> new ResourceNotFoundException("Course not found with id: " + courseId));

    Lecturer lecturer =
        lecturerRepository
            .findByUsername(lecturerUsername)
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        "Lecturer not found with username: " + lecturerUsername));

    // Optional: Check if the lecturer is assigned to this course
    boolean isAssigned =
        course.getLecturers().stream().anyMatch(l -> l.getUsername().equals(lecturerUsername));
    if (!isAssigned) {
      throw new UnauthorizedException(
          "Lecturer " + lecturerUsername + " is not assigned to course " + courseId);
    }

    Lecture lecture = convertToEntity(lectureDTO);
    lecture.setCourse(course);
    lecture.setLecturer(lecturer); // Set the lecturer who created it

    Lecture savedLecture = lectureRepository.save(lecture);
    return convertToDTO(savedLecture);
  }

  @Override
  @Transactional
  public LectureDTO updateLecture(Long id, LectureDTO lectureDTO, String lecturerUsername) {
    Lecture existingLecture =
        lectureRepository
            .findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Lecture not found with id: " + id));

    // Verify the lecturer updating is the one who created it or is assigned to the course
    if (!existingLecture.getLecturer().getUsername().equals(lecturerUsername)) {
      throw new UnauthorizedException(
          "Lecturer " + lecturerUsername + " is not authorized to update this lecture.");
    }

    // Update fields
    existingLecture.setTitle(lectureDTO.getTitle());
    existingLecture.setDescription(lectureDTO.getDescription());
    existingLecture.setStartDate(lectureDTO.getStartDate());
    // Update duration field name
    existingLecture.setDurationMinutes(lectureDTO.getDurationMinutes());
    existingLecture.setLocation(lectureDTO.getLocation());
    // Course and Lecturer shouldn't typically change on update, but handle if needed

    Lecture updatedLecture = lectureRepository.save(existingLecture);
    return convertToDTO(updatedLecture);
  }

  @Override
  @Transactional
  public void deleteLecture(Long id, String lecturerUsername) {
    Lecture lecture =
        lectureRepository
            .findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Lecture not found with id: " + id));

    // Verify the lecturer deleting is the one who created it or is assigned to the course
    if (!lecture.getLecturer().getUsername().equals(lecturerUsername)) {
      throw new UnauthorizedException(
          "Lecturer " + lecturerUsername + " is not authorized to delete this lecture.");
    }

    lectureRepository.delete(lecture);
  }

  // --- Helper Methods ---
  private LectureDTO convertToDTO(Lecture lecture) {
    return new LectureDTO(
        lecture.getLectureId(),
        lecture.getCourse().getCourseId(),
        lecture.getLecturer().getPersonId(),
        lecture.getLecturer().getName(), // Include lecturer name
        lecture.getTitle(),
        lecture.getStartDate(),
        // Update duration field name
        lecture.getDurationMinutes(),
        lecture.getLocation(),
        lecture.getDescription());
  }

  private Lecture convertToEntity(LectureDTO lectureDTO) {
    Lecture lecture = new Lecture();
    // We don't set ID for creation
    lecture.setTitle(lectureDTO.getTitle());
    lecture.setDescription(lectureDTO.getDescription());
    lecture.setStartDate(lectureDTO.getStartDate());
    // Update duration field name
    lecture.setDurationMinutes(lectureDTO.getDurationMinutes());
    lecture.setLocation(lectureDTO.getLocation());
    // Course and Lecturer are set in the service method
    return lecture;
  }
}
