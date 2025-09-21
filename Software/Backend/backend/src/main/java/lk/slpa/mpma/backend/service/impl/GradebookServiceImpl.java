package lk.slpa.mpma.backend.service.impl;

import lk.slpa.mpma.backend.dto.ActivityGradeDTO;
import lk.slpa.mpma.backend.dto.StudentGradebookDTO;
import lk.slpa.mpma.backend.exception.ResourceNotFoundException;
import lk.slpa.mpma.backend.model.*;
import lk.slpa.mpma.backend.repository.CourseRepository;
import lk.slpa.mpma.backend.repository.SubmissionRepository;
import lk.slpa.mpma.backend.service.GradebookService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // Using Lombok for constructor injection
public class GradebookServiceImpl implements GradebookService {

  private final CourseRepository courseRepository;
  private final SubmissionRepository submissionRepository;

  @Override
  @Transactional(readOnly = true) // Use a read-only transaction for performance
  public List<StudentGradebookDTO> getCourseGradebook(Long courseId) {
    // 1. Fetch the course with its related entities
    Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

    // 2. Get all activities for the course
    // The materials list contains various types, so we filter for Activity instances
    List<Activity> activities = course.getMaterials().stream()
            .filter(material -> material instanceof Activity)
            .map(material -> (Activity) material)
            .collect(Collectors.toList());

    // 3. Get all students in the course
    List<Student> students = course.getStudents();
    if (students.isEmpty()) {
      return new ArrayList<>(); // Return empty gradebook if no students
    }

    // 4. Build the gradebook structure
    List<StudentGradebookDTO> gradebook = new ArrayList<>();

    for (Student student : students) {
      List<ActivityGradeDTO> studentGrades = new ArrayList<>();

      // For each student, iterate through all course activities
      for (Activity activity : activities) {
        // Step 2a: Find ALL submissions for this specific student and activity.
        // This now returns a List, preventing the crash.
        List<Submission> submissions = submissionRepository
                .findByActivityIdAndStudentId(String.valueOf(activity.getMaterialId()), String.valueOf(student.getPersonId()));

        // Step 2b: From the list, find the submission with the latest date.
        // This handles multiple attempts correctly.
        Optional<Submission> latestSubmission = submissions.stream()
                .max(Comparator.comparing(Submission::getSubmissionDate));

        // Build the grade DTO
        ActivityGradeDTO gradeDTO = ActivityGradeDTO.builder()
                .activityId(activity.getMaterialId())
                .activityTitle(activity.getTitle())
                .maxMarks(activity.getMaxMarks() != null ? activity.getMaxMarks().doubleValue() : 0.0)
                // If the latest submission exists, get its marks. Otherwise, marks are null.
                .marksObtained(latestSubmission.map(Submission::getMarksObtained).orElse(null))
                .build();

        studentGrades.add(gradeDTO);
      }

      // Build the student's row in the gradebook
      StudentGradebookDTO studentGradebookDTO = StudentGradebookDTO.builder()
              .personId(student.getPersonId())
              .studentName(student.getName())
              .studentEmail(student.getEmail())
              .grades(studentGrades)
              .build();

      gradebook.add(studentGradebookDTO);
    }

    return gradebook;
  }
}