package lk.slpa.mpma.backend.controller;

import java.util.List;
import java.util.Optional;

import lk.slpa.mpma.backend.dto.*;
import lk.slpa.mpma.backend.dto.AdminDashboardStatsDTO;
import lk.slpa.mpma.backend.service.AdminService;
import lk.slpa.mpma.backend.service.CourseService;
import lk.slpa.mpma.backend.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/adminProfile")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private AdminService adminProfileService;


    @Autowired
    private CourseService courseService;

    @Autowired
    private StudentService studentService;

    // Changed the return type from Optional<Administrator> to Optional<AdminDTO>
    @GetMapping("/{adminId}")
    public Optional<AdminDTO> getAdminProfile(@PathVariable Long adminId) {
        return adminProfileService.getAdminProfile(adminId);
    }


    @GetMapping("/admin/{username}")
    public Optional<AdminDTO> getAdminProfileByUsername(@PathVariable String username) {
        return adminProfileService.getAdminProfileByUsername(username);
    }

    //Admin dashboard status
    @GetMapping("/adminDashboardStatus")
        public AdminDashboardStatsDTO getDashboardStats() {
        StudentCountDTO studentCount = studentService.getTotalStudentCount();
        CourseStatusCountDTO courseStatusCount = courseService.getCourseStatusCounts();

        return new AdminDashboardStatsDTO(
                courseStatusCount.getActiveCount(),
                courseStatusCount.getCompletedCount(),
                studentCount.getTotalStudents()
        );
    }

//get all the unassigned courses for a specific semester
    @GetMapping("/unassigned-courses")
    public List<UnassignedCourseSimpleDTO> getUnassignedCourses() {
        return courseService.getUnassignedCoursesSimple();
    }


    // get a course full details for a specific semester
    @GetMapping("/unassigned-courses/{courseId}")
    public UnassignedCourseDetailsDTO getUnassignedCourseDetails(@PathVariable Long courseId) {
        return courseService.getUnassignedCourseDetails(courseId);
    }
}
