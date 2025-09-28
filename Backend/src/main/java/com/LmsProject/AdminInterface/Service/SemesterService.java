package com.LmsProject.AdminInterface.Service;


import com.LmsProject.AdminInterface.DTO.SemesterRequestDTO;
import com.LmsProject.AdminInterface.DTO.SimpleCourseViewDTO;
import com.LmsProject.AdminInterface.Exception.CourseNotFoundException;
import com.LmsProject.AdminInterface.Exception.SemesterNotFoundException;
import com.LmsProject.AdminInterface.Model.Course;
import com.LmsProject.AdminInterface.Model.Semester;
import com.LmsProject.AdminInterface.Repository.CourseRepository;
import com.LmsProject.AdminInterface.Repository.SemesterRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
@Service
public class SemesterService {


    private final SemesterRepository semesterRepository;
    private final CourseRepository courseRepository;

    public SemesterService(SemesterRepository semesterRepository, CourseRepository courseRepository) {
        this.semesterRepository = semesterRepository;
        this.courseRepository = courseRepository;
    }

    //Fetch all semester data
    public List<Semester> getAllSemesters() {
        return semesterRepository.findAll();
    }

    public List<SimpleCourseViewDTO> getCoursesBySemesterAndAcademicYear(String semesterId, String academicYear) {
        Semester semester = semesterRepository.findBySemesterIdAndAcademicYear(semesterId, academicYear)
                .orElseThrow(() -> new SemesterNotFoundException(
                        "Semester not found with ID: " + semesterId + " and academic year: " + academicYear));

        return semester.getCourses().stream()
                .map(this::convertToSimpleCourseViewDTO)
                .collect(Collectors.toList());
    }

    // create a new semester with existing courses
    public Semester createSemesterWithCourses(SemesterRequestDTO semesterRequest) {
        Semester semester = new Semester();
        semester.setSemesterId(semesterRequest.getSemesterId());
        semester.setSemesterName(semesterRequest.getSemesterName());
        semester.setAcademicYear(semesterRequest.getAcademicYear());

        if (semesterRequest.getCourseIds() != null && !semesterRequest.getCourseIds().isEmpty()) {
            for (Long courseId : semesterRequest.getCourseIds()) {
                Course course = courseRepository.findById(courseId)
                        .orElseThrow(() -> new CourseNotFoundException("Course not found with ID: " + courseId));
                semester.addCourse(course);
            }
            semesterRepository.save(semester);
        }

        return semester;
    }

    public Semester updateSemesterWithCourses(String semesterId, SemesterRequestDTO semesterRequest) {
        Semester semester = semesterRepository.findBySemesterId(semesterId)
                .orElseThrow(() -> new SemesterNotFoundException(
                        "Semester not found with ID: " + semesterId));

        semester.setSemesterName(semesterRequest.getSemesterName());
        semester.setAcademicYear(semesterRequest.getAcademicYear());

        if (semesterRequest.getCourseIds() != null) {
            // Clear existing courses
            semester.getCourses().forEach(course -> course.setSemester(null));
            semester.getCourses().clear();

            // Add new courses
            for (Long courseId : semesterRequest.getCourseIds()) {
                Course course = courseRepository.findById(courseId)
                        .orElseThrow(() -> new CourseNotFoundException("Course not found with ID: " + courseId));
                semester.addCourse(course);
            }
        }

        return semesterRepository.save(semester);
    }

    private SimpleCourseViewDTO convertToSimpleCourseViewDTO(Course course) {
        SimpleCourseViewDTO dto = new SimpleCourseViewDTO();
        dto.setCourseId(course.getCourseId());
        dto.setCourseName(course.getName());
        dto.setCourseImage(course.getCourseImage());
        dto.setSemesterId(course.getSemester().getSemesterId());
        dto.setSemesterName(course.getSemester().getSemesterName());
        dto.setAcademicYear(course.getSemester().getAcademicYear());
        return dto;
    }
}