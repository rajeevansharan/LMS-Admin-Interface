package com.LmsProject.AdminInterface.Controller;

import java.util.Map;
import java.util.Optional;

import com.LmsProject.AdminInterface.DTO.AdminDTO;
import com.LmsProject.AdminInterface.DTO.AdminDashboardStatsDTO;
import com.LmsProject.AdminInterface.DTO.CourseStatusCountDTO;
import com.LmsProject.AdminInterface.DTO.StudentCountDTO;
import com.LmsProject.AdminInterface.Service.AdminService;
import com.LmsProject.AdminInterface.Service.CourseService;
import com.LmsProject.AdminInterface.Service.StudentService;
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
        Map<String,Long> counts= courseService.getCourseStatusCounts();
        CourseStatusCountDTO courseStatusCount = new CourseStatusCountDTO(counts.get("ACTIVE"), counts.get("COMPLETED"));

        return new AdminDashboardStatsDTO(
                courseStatusCount.getActiveCount(),
                courseStatusCount.getCompletedCount(),
                studentCount.getTotalStudents()
        );
    }




}
