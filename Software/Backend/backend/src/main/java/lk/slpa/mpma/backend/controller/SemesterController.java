package lk.slpa.mpma.backend.controller;

import lk.slpa.mpma.backend.dto.SemesterRequestDTO;
import lk.slpa.mpma.backend.dto.SimpleCourseViewDTO;
import lk.slpa.mpma.backend.exception.CourseNotFoundException;
import lk.slpa.mpma.backend.exception.SemesterNotFoundException;
import lk.slpa.mpma.backend.model.Semester;
import lk.slpa.mpma.backend.service.SemesterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/semesters")
public class SemesterController {

    private final SemesterService semesterService;
    public SemesterController(SemesterService semesterService) {
        this.semesterService = semesterService;
    }


    //Fetch all semester data
    @GetMapping
    public ResponseEntity<List<Semester>> getAllSemesters() {
        List<Semester> semesters = semesterService.getAllSemesters();
        return ResponseEntity.ok(semesters);
    }

    @GetMapping("/{semesterId}/academic-year/{academicYear}/courses")
    public ResponseEntity<List<SimpleCourseViewDTO>> getCoursesBySemesterAndAcademicYear(
            @PathVariable String semesterId,
            @PathVariable String academicYear) {
        try {
            List<SimpleCourseViewDTO> courses = semesterService.getCoursesBySemesterAndAcademicYear(semesterId, academicYear);
            return ResponseEntity.ok(courses);
        } catch (SemesterNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }


          // create a new semester with existing courses
    // without a course a semester will not be created
          @PostMapping
          public ResponseEntity<?> createSemester(@RequestBody SemesterRequestDTO semesterRequest) {
              try {
                  // Check if a semester with this ID already exists
                  if (semesterService.getAllSemesters().stream()
                          .anyMatch(s -> s.getSemesterId().equals(semesterRequest.getSemesterId()))) {
                      return ResponseEntity.status(HttpStatus.CONFLICT)
                              .body(Map.of(
                                      "type", "SemesterAlreadyExists",
                                      "message", "Semester with ID " + semesterRequest.getSemesterId() + " already exists"
                              ));
                  }

                  Semester createdSemester = semesterService.createSemesterWithCourses(semesterRequest);
                  return ResponseEntity.ok(createdSemester);
              } catch (CourseNotFoundException e) {
                  return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                          .body(Map.of("type", "CourseNotFound", "message", e.getMessage()));
              }
          }




    @PutMapping("/{semesterId}")
    public ResponseEntity<?> updateSemester(
            @PathVariable String semesterId,
            @RequestBody SemesterRequestDTO semesterRequest) {
        try {
            Semester updatedSemester = semesterService.updateSemesterWithCourses(semesterId, semesterRequest);
            return ResponseEntity.ok(updatedSemester);
        } catch (SemesterNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (CourseNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}