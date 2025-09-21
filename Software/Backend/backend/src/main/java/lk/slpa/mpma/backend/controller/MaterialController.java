package lk.slpa.mpma.backend.controller;

import java.util.List;
import java.util.stream.Collectors;
import lk.slpa.mpma.backend.dto.AnnouncementDTO;
import lk.slpa.mpma.backend.dto.AssignmentDTO;
import lk.slpa.mpma.backend.dto.MaterialDocumentDTO;
import lk.slpa.mpma.backend.dto.QuizDTO;
import lk.slpa.mpma.backend.model.Assignment;
import lk.slpa.mpma.backend.model.Course;
import lk.slpa.mpma.backend.model.Material;
import lk.slpa.mpma.backend.model.MaterialAnnouncement;
import lk.slpa.mpma.backend.model.MaterialDocument;
import lk.slpa.mpma.backend.model.Quiz;
import lk.slpa.mpma.backend.service.CourseService;
import lk.slpa.mpma.backend.service.impl.AzureBlobFileStorageServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/materials")
@RequiredArgsConstructor
public class MaterialController {

  // Inject your specific Azure implementation
  private final AzureBlobFileStorageServiceImpl fileStorageService;
  private final CourseService courseService;

  @GetMapping("/download/{courseId}/{fileName:.+}") // <-- THE MAIN FIX IS HERE
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<Resource> downloadFile(
      @PathVariable Long courseId, @PathVariable String fileName) {
    // Reconstruct the full file ID as it's stored in your database and Azure
    String fileIdentifier = courseId + "/" + fileName;

    try {
      Resource resource = fileStorageService.loadFileAsResource(fileIdentifier);

      if (resource.exists() && resource.isReadable()) {
        // A simple way to determine the content type
        String contentType = "application/octet-stream";
        if (fileName.endsWith(".pdf")) {
          contentType = "application/pdf";
        } else if (fileName.endsWith(".png")) {
          contentType = "image/png";
        } else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
          contentType = "image/jpeg";
        }
        // Add more types as needed

        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(contentType))
            .header(
                HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + resource.getFilename() + "\"")
            .body(resource);
      } else {
        // This case handles when the file doesn't exist in storage
        System.err.println("File not found in storage: " + fileIdentifier);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
      }
    } catch (Exception e) {
      // This catches any other errors during file retrieval
      System.err.println("Error downloading file '" + fileIdentifier + "': " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  /** Endpoint to get a list of all material documents for a specific course. */
  @GetMapping("/course/{courseId}")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<List<MaterialDocumentDTO>> getCourseMaterials(@PathVariable Long courseId) {
    try {
      // 1. Get the full course object, which contains the list of all its materials
      Course course = courseService.getCourseById(courseId);

      // 2. Filter the materials to get only the documents and convert them into DTOs
      List<MaterialDocumentDTO> documents =
          course.getMaterials().stream()
              .filter(material -> material instanceof MaterialDocument)
              .map(
                  material -> {
                    MaterialDocument doc = (MaterialDocument) material;
                    // Build the DTO to send to the frontend
                    return new MaterialDocumentDTO(
                        doc.getMaterialId(),
                        doc.getTitle(),
                        doc.getDescription(),
                        doc.getFileID(), // This is the path like "1/abc-123.pdf"
                        doc.getUploadDate(),
                        doc.getVisible(),
                        doc.getCreator() != null ? doc.getCreator().getName() : "N/A");
                  })
              .collect(Collectors.toList());

      return ResponseEntity.ok(documents);
    } catch (RuntimeException e) {
      // This will catch the "Course not found" exception from courseService
      System.err.println("Error getting course materials: " + e.getMessage());
      return ResponseEntity.notFound().build();
    }
  }

  @DeleteMapping("/{materialId}")
  @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'LECTURER')")
  public ResponseEntity<Void> deleteMaterial(@PathVariable Long materialId) {
    try {
      courseService.deleteCourseMaterial(materialId);
      return ResponseEntity.noContent().build(); // HTTP 204: Success, no content to return
    } catch (Exception e) {
      System.err.println("Error deleting material: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @PatchMapping("/{materialId}/toggle-visibility")
  @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'LECTURER')")
  public ResponseEntity<?> toggleVisibility(@PathVariable Long materialId) {
    try {
      Material updatedMaterial = courseService.toggleMaterialVisibility(materialId);

      // Handle different material types polymorphically
      if (updatedMaterial instanceof MaterialDocument) {
        MaterialDocument doc = (MaterialDocument) updatedMaterial;
        MaterialDocumentDTO dto =
            new MaterialDocumentDTO(
                doc.getMaterialId(),
                doc.getTitle(),
                doc.getDescription(),
                doc.getFileID(),
                doc.getUploadDate(),
                doc.getVisible(),
                doc.getCreator() != null ? doc.getCreator().getName() : "N/A");
        return ResponseEntity.ok(dto);
      } else if (updatedMaterial instanceof MaterialAnnouncement) {
        MaterialAnnouncement announcement = (MaterialAnnouncement) updatedMaterial;
        AnnouncementDTO dto =
            new AnnouncementDTO(
                announcement.getMaterialId(),
                announcement.getTitle(),
                announcement.getDescription(),
                announcement.getUploadDate(),
                announcement.getVisible(),
                announcement.getCourse() != null ? announcement.getCourse().getCourseId() : null,
                announcement.getCourse() != null ? announcement.getCourse().getName() : null,
                announcement.getCreator() != null ? announcement.getCreator().getPersonId() : null,
                announcement.getCreator() != null ? announcement.getCreator().getName() : null);
        return ResponseEntity.ok(dto);
      } else if (updatedMaterial instanceof Quiz) {
        Quiz quiz = (Quiz) updatedMaterial;
        QuizDTO dto = new QuizDTO();
        dto.setId(quiz.getMaterialId());
        dto.setTitle(quiz.getTitle());
        dto.setDescription(quiz.getDescription());
        dto.setTimeLimit(quiz.getTimeLimit());
        dto.setMaxAttempts(quiz.getMaxAttempts());
        dto.setShuffleQuestions(quiz.getShuffleQuestions());
        // Note: We don't include questions list in the toggle response for performance
        return ResponseEntity.ok(dto);
      } else if (updatedMaterial instanceof Assignment) {
        Assignment assignment = (Assignment) updatedMaterial;
        AssignmentDTO dto =
            new AssignmentDTO(
                assignment.getMaterialId(),
                assignment.getTitle(),
                assignment.getDescription(),
                assignment.getUploadDate(),
                assignment.getVisible(),
                assignment.getEndDate(),
                assignment.getMaxMarks(),
                assignment.getPassMark(),
                assignment.getWeight(),
                assignment.getInstruction(),
                assignment.getAllowedFileTypes(),
                assignment.getMaxFileSize(),
                assignment.getMaxFileCount(),
                assignment.getCreator() != null ? assignment.getCreator().getName() : "N/A");
        return ResponseEntity.ok(dto);
      } else {
        System.err.println(
            "Unsupported material type: " + updatedMaterial.getClass().getSimpleName());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
      }
    } catch (Exception e) {
      System.err.println("Error toggling material visibility: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }
}
