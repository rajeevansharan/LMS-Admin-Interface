package com.LmsProject.AdminInterface.Service.impl;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import com.LmsProject.AdminInterface.DTO.CourseCreateDTO;
import com.LmsProject.AdminInterface.DTO.CourseDTO;
import com.LmsProject.AdminInterface.DTO.LecturerSimpleDTO;
import com.LmsProject.AdminInterface.Model.Course;
import com.LmsProject.AdminInterface.Repository.CourseRepository;
import com.LmsProject.AdminInterface.Repository.PersonRepository;
import com.LmsProject.AdminInterface.Service.CourseService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public abstract class CourseServiceImpl implements CourseService {

  private final CourseRepository courseRepository;
  private final PersonRepository personRepository;


  @Override
  public List<Course> getAllCourses() {
    return courseRepository.findAll();
  }

    /**
     * {@inheritDoc}
     *
     * <p>Uses a read-only transaction to improve performance for this retrieval operation. Throws a
     * RuntimeException if the course with the given ID doesn't exist.
     */
    @Override
    @Transactional(readOnly = true)
    public Course getCourseById(Long id) {
        Course course =
                courseRepository
                        .findById(id)
                        .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        return course;
    }

    /**
     * {@inheritDoc}
     *
     * <p>Persists a new course entity or updates an existing one in the database.
     */
    @Override
    public Course saveCreatedCourse(CourseCreateDTO courseDTO) {
        Course course = new Course();

        // Set ID only if provided (e.g., for manual override or migration use cases)
        if (courseDTO.getCourseId() != null) {
            course.setCourseId(courseDTO.getCourseId());
        }

        course.setName(courseDTO.getName());
        course.setStartDate(courseDTO.getStartDate());
        course.setEndDate(courseDTO.getStartDate());

        return saveCourse(course);
    }


    /**
     * {@inheritDoc}
     *
     * <p>Persists a new course entity or updates an existing one in the database.
     */
    @Override
    public Course saveCourse(Course course) {
        return courseRepository.save(course);
    }


    /**
     * {@inheritDoc}
     *
     * <p>Deletes a course by its ID. If the course doesn't exist, the operation is silently ignored.
     */
    @Override
    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    /**
     * {@inheritDoc}
     *
     * <p>Uses a read-only transaction and stream operations to efficiently transform course entities
     * to DTOs with simplified related entity information.
     */
    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getCoursesByLecturerId(Long lecturerId) {
        List<Course> courses = courseRepository.findByLecturers_PersonId(lecturerId);
        // Collections should be eagerly loaded now
        return courses.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    /**
     * {@inheritDoc}
     *
     * <p>Provides an efficient existence check without loading the full entity.
     */
    @Override
    public boolean existsById(Long id) {
        return courseRepository.existsById(id);
    }




    @Override
    @Transactional(readOnly = true)
    public List<UnassignedCourseSimpleDTO> getUnassignedCoursesSimple() {
        List<Course> courses = courseRepository.findCoursesNotAssignedToSemester();
        return courses.stream()
                .map(course -> new UnassignedCourseSimpleDTO(
                        course.getCourseId(),
                        course.getName(),
                        course.getCourseImage(),
                        course.getStartDate()))
                .collect(Collectors.toList());
    }

  @Override
  public CourseStatusCountDTO getCourseStatusCounts() {
    long activeCount = courseRepository.countByStatus(Course.CourseStatus.ACTIVE);
    long completedCount = courseRepository.countByStatus(Course.CourseStatus.COMPLETED);
    return new CourseStatusCountDTO(activeCount, completedCount);
  }

    @Override
    @Transactional(readOnly = true)
    public List<CourseViewDTO> getAllCoursesForAdminView() {
        List<Course> courses = courseRepository.findAll();
        return courses.stream()
                .map(
                        course -> {
                            CourseViewDTO dto = new CourseViewDTO();
                            dto.setCourseId(course.getCourseId());
                            dto.setCourseName(course.getName());
                            dto.setCourseImage(course.getCourseImage());
                            // Since this is an admin view, we might not need enrollment status
                            dto.setStatus(null); // or set a default status if needed
                            dto.setStartDate(course.getStartDate());
                            // Get lecturer names
                            List<String> lecturerNames =
                                    course.getLecturers().stream()
                                            .map(Lecturer::getName)
                                            .collect(Collectors.toList());
                            dto.setLecture(lecturerNames);

                            return dto;
                        })
                .collect(Collectors.toList());
    }



    /**
     * Helper method to convert a Course entity to a CourseDTO.
     *
     * <p>This method handles the transformation of a complex entity with multiple relationships into
     * a data transfer object suitable for client communication. It creates simplified representations
     * of related entities.
     *
     * @param course The course entity to convert
     * @return A CourseDTO representing the course with simplified related entities
     */
    private CourseDTO convertToDTO(Course course) {

        CourseDTO dto = new CourseDTO();
        dto.setCourseId(course.getCourseId());
        dto.setName(course.getName());
        dto.setStartDate(course.getStartDate());
        dto.setEndDate(course.getEndDate());

        // Convert lecturers (still collecting to Set for DTO)
        dto.setLecturers(
                course.getLecturers().stream()
                        .map(
                                lecturer ->
                                        new LecturerSimpleDTO(
                                                lecturer.getPersonId(), lecturer.getName(), lecturer.getDepartment()))
                        .collect(Collectors.toSet())); // DTO uses Set

        // Convert materials (still collecting to Set for DTO)
        dto.setMaterials(
                course.getMaterials().stream()
                        .map(
                                material ->
                                        new MaterialSimpleDTO(
                                                material.getMaterialId(),
                                                material.getTitle(),
                                                material.getType(),
                                                material.getUploadDate(),
                                                material.getVisible()))
                        .collect(Collectors.toSet())); // DTO uses Set

        // Convert lectures (still collecting to Set for DTO)
        dto.setLectures(
                course.getLectures().stream()
                        .map(
                                lecture ->
                                        new LectureSimpleDTO(
                                                lecture.getLectureId(),
                                                lecture.getTitle(),
                                                lecture.getStartDate(),
                                                lecture.getLocation(),
                                                lecture.getDescription()))
                        .collect(Collectors.toSet())); // DTO uses Set

        return dto;
    }

    @Override
    public List<CourseDTO> getCoursesByStudentId(Long studentId)
    {
        List<Course> courses = courseRepository.findCoursesByStudentId(studentId);
        return courses.stream().map(this::convertToDTO).collect(Collectors.toList());
    };

}