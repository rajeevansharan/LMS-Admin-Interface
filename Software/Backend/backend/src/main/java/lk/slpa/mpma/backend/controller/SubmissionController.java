package lk.slpa.mpma.backend.controller;

import java.io.IOException;
import java.util.List;
import lk.slpa.mpma.backend.dto.GradeSubmissionRequestDTO;
import lk.slpa.mpma.backend.dto.QuizAttemptDetailDTO;
import lk.slpa.mpma.backend.dto.SubmissionDTO;
import lk.slpa.mpma.backend.model.Person;
import lk.slpa.mpma.backend.security.UserDetailsImpl;
import lk.slpa.mpma.backend.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor // Use constructor injection
public class SubmissionController {

  private final SubmissionService submissionService;

  // =========== THIS IS THE NEW ENDPOINT =================
  /**
   * POST /api/submissions/assignment/{assignmentId}
   * Allows a student to submit a file for a given assignment.
   *
   * @param assignmentId The ID of the assignment.
   * @param file The uploaded file.
   * @return The DTO of the newly created submission.
   */
  @PostMapping("/assignment/{assignmentId}")
  @PreAuthorize("hasRole('STUDENT')")
  public ResponseEntity<SubmissionDTO> handleFileUpload(
          @PathVariable Long assignmentId,
          @RequestParam("file") MultipartFile file) {
    try {
      SubmissionDTO submission = submissionService.createSubmission(assignmentId, file);
      return ResponseEntity.status(HttpStatus.CREATED).body(submission);
    } catch (IOException e) {
      // Log the exception in a real application
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    } catch (RuntimeException e) {
      // Catches things like user not found, assignment not found, etc.
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
  }
  // =======================================================


  /**
   * GET /api/submissions/activity/{activityId} Retrieves all submissions associated with a specific
   * activity.
   *
   * @param activityId The ID of the activity (quiz, assignment, etc.).
   * @return A list of submission data transfer objects.
   */
  @GetMapping("/activity/{activityId}")
  public ResponseEntity<List<SubmissionDTO>> getSubmissionsByActivity(
          @PathVariable String activityId) {
    List<SubmissionDTO> submissions = submissionService.getSubmissionsByActivityId(activityId);
    return ResponseEntity.ok(submissions);
  }

  /**
   * PUT /api/submissions/{submissionId} Grades or re-grades a specific submission.
   *
   * @param submissionId The ID of the submission to update.
   * @param gradeRequest The request body containing the marks and feedback.
   * @return The updated submission data.
   */
  @PutMapping("/{submissionId}")
  @PreAuthorize("hasAuthority('LECTURER')")
  public ResponseEntity<SubmissionDTO> updateSubmissionGrade(
          @PathVariable Long submissionId,
          @RequestBody GradeSubmissionRequestDTO gradeRequest,
          @AuthenticationPrincipal UserDetailsImpl userDetails) {
    Person grader = userDetails.getPerson();
    SubmissionDTO updatedSubmission =
            submissionService.gradeSubmission(submissionId, gradeRequest, grader);
    return ResponseEntity.ok(updatedSubmission);
  }

  @GetMapping("/{submissionId}/review")
  @PreAuthorize("hasAuthority('LECTURER')")
  public ResponseEntity<QuizAttemptDetailDTO> getSubmissionReview(@PathVariable Long submissionId) {
    QuizAttemptDetailDTO reviewDetails = submissionService.getQuizAttemptDetails(submissionId);
    return ResponseEntity.ok(reviewDetails);
  }

  /**
   * GET /api/submissions/{submissionId}/download Downloads the submitted file for a specific
   * submission.
   *
   * @param submissionId The ID of the submission whose file should be downloaded.
   * @return The file as a downloadable resource.
   */
  @GetMapping("/{submissionId}/download")
  @PreAuthorize("hasAuthority('LECTURER')")
  public ResponseEntity<Resource> downloadSubmissionFile(@PathVariable Long submissionId) {
    try {
      Resource resource = submissionService.getSubmissionFile(submissionId);
      if (resource.exists() && resource.isReadable()) {
        String filename = resource.getFilename();
        String contentType = "application/octet-stream";

        if (filename != null) {
          if (filename.endsWith(".pdf")) contentType = "application/pdf";
          else if (filename.endsWith(".png")) contentType = "image/png";
          else if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) contentType = "image/jpeg";
          // Add other content types as needed
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(
                        HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(resource);
      } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
      }
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }
}