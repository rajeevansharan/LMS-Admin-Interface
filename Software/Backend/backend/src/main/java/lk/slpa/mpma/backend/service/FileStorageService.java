package lk.slpa.mpma.backend.service;

import java.io.IOException;
import java.nio.file.Path;
import org.springframework.web.multipart.MultipartFile;

/**
 * Service interface for managing file storage operations in the MPMA system.
 *
 * <p>This interface defines the contract for file storage operations, including storing,
 * retrieving, and deleting files. It provides an abstraction layer for file management operations,
 * allowing different storage implementations (local filesystem, cloud storage, etc.).
 */
public interface FileStorageService {

  /**
   * Initializes the file storage system.
   *
   * <p>This method sets up necessary directories and configurations required for file storage.
   * Should be called during application startup to ensure the storage system is ready.
   *
   * @throws RuntimeException if the storage system cannot be initialized
   */
  void init();

  /**
   * Stores a file in the storage system with course-specific organization.
   *
   * <p>Files are organized by course to maintain proper separation and easy retrieval. The method
   * generates unique filenames to prevent collisions while preserving file extensions.
   *
   * @param file The multipart file to store
   * @param courseId The ID of the course this file belongs to
   * @return The relative path of the stored file for database storage
   * @throws IOException if an error occurs during file storage
   * @throws IllegalArgumentException if the file is empty
   */
  String storeFile(MultipartFile file, String courseId) throws IOException;

  /**
   * Retrieves the file path for a given relative path.
   *
   * <p>Converts a relative file path (as stored in database) to an absolute path that can be used
   * for file access operations.
   *
   * @param relativePath The relative path of the file
   * @return The absolute path to the file
   */
  Path getFilePath(String relativePath);

  /**
   * Deletes a file from the storage system.
   *
   * <p>Removes the file from the filesystem. If the file doesn't exist, the operation completes
   * without error.
   *
   * @param relativePath The relative path of the file to delete
   * @throws IOException if an error occurs during file deletion
   */
  void deleteFile(String relativePath) throws IOException;
}
