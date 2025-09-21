package lk.slpa.mpma.backend.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import lk.slpa.mpma.backend.dto.CourseStatusCountDTO;
import lk.slpa.mpma.backend.dto.CourseViewDTO;
import lk.slpa.mpma.backend.dto.SimpleCourseViewDTO;
import lk.slpa.mpma.backend.service.CourseService;
import lk.slpa.mpma.backend.service.EnrollmentService;
import lk.slpa.mpma.backend.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/courseView")
public class CourseViewController {
    private final CourseService courseService;
    @Autowired
    private ImageService imageService;

    @Autowired
    private EnrollmentService enrollmentService;

    public CourseViewController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping("/images/{filename}")
    public ResponseEntity<Resource> getCourseImage(@PathVariable String filename) {
        try {
            Resource image = imageService.getCourseImage(filename);
            if (image != null) {
                String contentType = Files.probeContentType(Paths.get(image.getFile().getAbsolutePath()));
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(
                                HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + image.getFilename() + "\"")
                        .body(image);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/adminView")
    public ResponseEntity<List<CourseViewDTO>> getAllCoursesForAdminView() {
        return ResponseEntity.ok(courseService.getAllCoursesForAdminView());
    }

    // In CourseViewController.java
    @GetMapping("/student/{username}/courses")
    public ResponseEntity<List<SimpleCourseViewDTO>> getEnrolledCoursesByUsername(@PathVariable String username) {
        List<SimpleCourseViewDTO> courses = enrollmentService.getEnrolledCoursesByUsername(username);
        return ResponseEntity.ok(courses);
    }


}
