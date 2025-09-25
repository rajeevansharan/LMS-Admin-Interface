package com.LmsProject.AdminInterface.Service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Date;
import com.LmsProject.AdminInterface.DTO.CourseDTO;
import com.LmsProject.AdminInterface.DTO.LectureSimpleDTO;
import com.LmsProject.AdminInterface.DTO.LecturerSimpleDTO;
import com.LmsProject.AdminInterface.Model.Course;
import com.LmsProject.AdminInterface.Repository.CourseRepository;
import com.LmsProject.AdminInterface.Service.CourseService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;

    @Override
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
    }

    @Override
    public Course saveCourse(Course course) {
        return courseRepository.save(course);
    }

    @Override
    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new RuntimeException("Course not found with id: " + id);
        }
        courseRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getCoursesByLecturerId(Long lecturerId) {
        List<Course> courses = courseRepository.findByLecturers_PersonId(lecturerId);
        return courses.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public boolean existsById(Long id) {
        return courseRepository.existsById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getCoursesByStudentId(Long studentId) {
        List<Course> courses = courseRepository.findCoursesByStudentId(studentId);
        return courses.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getCourseStatusCounts() {
        LocalDate today = LocalDate.now();

        return courseRepository.findAll().stream().collect(Collectors.groupingBy(course -> {
            if (course.getEndDate().isBefore(today)) {
                return "COMPLETED";
            } else {
                return "ACTIVE";
            }
            }, Collectors.counting()));
    }

    private CourseDTO convertToDTO(Course course) {
        CourseDTO dto = new CourseDTO();
        dto.setCourseId(course.getCourseId());
        dto.setName(course.getName());
        dto.setStartDate(course.getStartDate());
        dto.setEndDate(course.getEndDate());

        dto.setLecturers(
                course.getLecturers().stream()
                        .map(lecturer -> new LecturerSimpleDTO(
                                lecturer.getPersonId(),
                                lecturer.getName(),
                                lecturer.getDepartment()))
                        .collect(Collectors.toSet())
        );

        dto.setLectures(
                course.getLectures().stream()
                        .map(lecture -> new LectureSimpleDTO(
                                lecture.getLectureId(),
                                lecture.getTitle(),
                                lecture.getStartDate(),
                                lecture.getLocation(),
                                lecture.getDescription()))
                        .collect(Collectors.toSet())
        );

        return dto;
    }
}
