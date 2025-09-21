package lk.slpa.mpma.backend.service;

import java.util.List;


import lk.slpa.mpma.backend.dto.*;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lk.slpa.mpma.backend.dto.ActivityDTO;
import lk.slpa.mpma.backend.dto.AssignmentCreateRequestDTO;
import lk.slpa.mpma.backend.dto.CourseDTO;
import lk.slpa.mpma.backend.dto.MaterialDocumentDTO;

import lk.slpa.mpma.backend.model.Course;
import lk.slpa.mpma.backend.model.Material;
import lk.slpa.mpma.backend.model.Person;
/**
 * Service interface for managing Course entities.
 *
 * <p>This service provides operations for creating, retrieving, updating, and deleting courses, as
 * well as specialized operations like finding courses by lecturer. It serves as an abstraction
 * layer between controllers and the data access layer.
 */
public interface CourseService {

  /**
   * Retrieves a list of courses a specific student is enrolled in.
   *
   * @param studentId The unique identifier of the student.
   * @return A list of CourseDTO objects for the enrolled courses.
   */
  List<CourseDTO> getCoursesByStudentId(Long studentId);

  /**
   * Retrieves all courses in the system.
   *
   * <p>This method fetches all available courses without any filtering. It's typically used for
   * administrative purposes or course catalog displays.
   *
   * @return List of all courses in the system
   */
  List<Course> getAllCourses();

  /**
   * Retrieves a specific course by its unique identifier.
   *
   * <p>This method can throw exceptions if the course with the given ID doesn't exist.
   *
   * @param id The unique identifier of the course to retrieve
   * @return The course with the specified ID
   * @throws lk.slpa.mpma.backend.exception.ResourceNotFoundException if course not found
   */
  Course getCourseById(Long id);

  /**
   * Creates a new course or updates an existing one.
   *
   * <p>If the course has an ID that exists in the database, it will be updated. Otherwise, a new
   * course will be created.
   *
   * @param course The course entity to save or update
   * @return The saved course with generated ID (for new courses)
   */
  public Course saveCourse(Course course);

  Course saveCreatedCourse(CourseCreateDTO courseDto);
  /**
   * Removes a course from the system by its ID.
   *
   * <p>This operation may cascade to related entities based on the entity relationships. Use with
   * caution as it permanently deletes the course and potentially its related entities.
   *
   * @param id The unique identifier of the course to delete
   * @throws lk.slpa.mpma.backend.exception.ResourceNotFoundException if course not found
   */
  void deleteCourse(Long id);

  /**
   * Finds all courses taught by a specific lecturer.
   *
   * <p>Returns data transfer objects rather than entities to provide a tailored view of course
   * information relevant for the context.
   *
   * @param lecturerId The unique identifier of the lecturer
   * @return List of CourseDTO objects representing courses taught by the lecturer
   */
  List<CourseDTO> getCoursesByLecturerId(Long lecturerId);

  /**
   * Checks if a course with the specified ID exists in the system.
   *
   * <p>This is a lightweight operation that doesn't fetch the actual course data, useful for
   * validation checks.
   *
   * @param id The unique identifier of the course to check
   * @return true if the course exists, false otherwise
   */
  boolean existsById(Long id);

  /**
   * Uploads a course material document to a specific course.
   *
   * @param courseId The ID of the course to which the material will be added.
   * @param file The file to be uploaded.
   * @param description An optional description for the file.
   * @return A DTO representing the newly created material document.
   * @throws java.io.IOException if an error occurs during file storage.
   */
  MaterialDocumentDTO addCourseMaterialDocument(
          Long courseId, MultipartFile file, String description) throws java.io.IOException;

  void deleteCourseMaterial(Long materialId) throws java.io.IOException;

  Material toggleMaterialVisibility(Long materialId);

  List<ActivityDTO> getActivitiesByCourseId(Long courseId);

  void createAssignment(Long courseId, AssignmentCreateRequestDTO request, Person creator);

  void updateAssignment(Long assignmentId, AssignmentCreateRequestDTO request);

  UnassignedCourseDetailsDTO getUnassignedCourseDetails(Long courseId);

  List<UnassignedCourseSimpleDTO> getUnassignedCoursesSimple();

  public CourseStatusCountDTO getCourseStatusCounts();

  public List<CourseViewDTO> getAllCoursesForAdminView();
}