package com.LmsProject.AdminInterface.Service;

import com.LmsProject.AdminInterface.DTO.*;
import com.LmsProject.AdminInterface.Model.Course;
import com.LmsProject.AdminInterface.Model.Person;

import java.util.List;



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

  void deleteCourseMaterial(Long materialId) throws java.io.IOException;


  List<ActivityDTO> getActivitiesByCourseId(Long courseId);


  public CourseStatusCountDTO getCourseStatusCounts();

  public List<CourseViewDTO> getAllCoursesForAdminView();
}