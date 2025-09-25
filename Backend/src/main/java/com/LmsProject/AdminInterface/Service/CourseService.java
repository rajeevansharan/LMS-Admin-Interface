package com.LmsProject.AdminInterface.Service;

import java.util.List;
import java.util.Map;

import com.LmsProject.AdminInterface.DTO.CourseDTO;
import com.LmsProject.AdminInterface.Model.Course;

public interface CourseService {

    List<CourseDTO> getCoursesByStudentId(Long studentId);

    List<Course> getAllCourses();

    Course getCourseById(Long id);

    Course saveCourse(Course course);

    void deleteCourse(Long id);

    List<CourseDTO> getCoursesByLecturerId(Long lecturerId);

    boolean existsById(Long id);

    Map<String, Long> getCourseStatusCounts();
}
