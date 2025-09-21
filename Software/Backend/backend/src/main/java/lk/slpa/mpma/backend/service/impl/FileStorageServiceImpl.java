package lk.slpa.mpma.backend.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import lk.slpa.mpma.backend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Implementation of the FileStorageService interface for local filesystem storage.
 *
 * <p>This implementation provides file storage capabilities using the local filesystem. Files are
 * organized by course ID in separate directories, and unique filenames are generated to prevent
 * naming conflicts while preserving file extensions.
 *
 * <p>This service is activated when the property 'file.storage.type' is set to 'local' or not
 * specified.
 */
@Service
@ConditionalOnProperty(name = "file.storage.type", havingValue = "local", matchIfMissing = true)
public class FileStorageServiceImpl implements FileStorageService {

  @Value("${file.upload.directory}")
  private String uploadDirectory;

  /**
   * {@inheritDoc}
   *
   * <p>Creates the base upload directory if it doesn't exist using the configured path.
   */
  @Override
  public void init() {
    try {
      Files.createDirectories(Paths.get(uploadDirectory));
    } catch (IOException e) {
      throw new RuntimeException("Could not create upload directory", e);
    }
  }

  /**
   * {@inheritDoc}
   *
   * <p>Creates a course-specific subdirectory if it doesn't exist and stores the file with a
   * UUID-based filename to ensure uniqueness while preserving the original extension.
   */
  @Override
  public String storeFile(MultipartFile file, String courseId) throws IOException {
    if (file.isEmpty()) {
      throw new IllegalArgumentException("Cannot store empty file");
    }

    // Create course-specific directory
    String courseDirectory = uploadDirectory + "/" + courseId;
    Path coursePath = Paths.get(courseDirectory);
    if (!Files.exists(coursePath)) {
      Files.createDirectories(coursePath);
    }

    // Generate unique filename to prevent collisions
    String originalFilename = file.getOriginalFilename();
    String extension = "";
    if (originalFilename != null && originalFilename.contains(".")) {
      extension = originalFilename.substring(originalFilename.lastIndexOf("."));
    }
    String filename = UUID.randomUUID().toString() + extension;

    // Save the file
    Path destinationPath = Paths.get(courseDirectory, filename);
    Files.copy(file.getInputStream(), destinationPath, StandardCopyOption.REPLACE_EXISTING);

    // Return the relative path to store in the database
    return courseId + "/" + filename;
  }

  /**
   * {@inheritDoc}
   *
   * <p>Resolves the relative path against the configured upload directory to provide the absolute
   * file path.
   */
  @Override
  public Path getFilePath(String relativePath) {
    return Paths.get(uploadDirectory).resolve(relativePath);
  }

  /**
   * {@inheritDoc}
   *
   * <p>Uses Files.deleteIfExists() to safely delete the file without throwing an exception if the
   * file doesn't exist.
   */
  @Override
  public void deleteFile(String relativePath) throws IOException {
    Path filePath = Paths.get(uploadDirectory).resolve(relativePath);
    Files.deleteIfExists(filePath);
  }
}
