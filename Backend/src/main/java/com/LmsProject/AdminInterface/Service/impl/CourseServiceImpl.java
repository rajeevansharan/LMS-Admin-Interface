package com.LmsProject.AdminInterface.Service.impl;

import java.util.List;
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
     * <p>Provides an efficient existence check without loading the full entity.
     */
    @Override
    public boolean existsById(Long id) {
        return courseRepository.existsById(id);
    }


}