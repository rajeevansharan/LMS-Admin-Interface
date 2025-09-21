package lk.slpa.mpma.backend.service.impl;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import lk.slpa.mpma.backend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Azure Blob Storage implementation using Spring Cloud Azure.
 *
 * <p>This implementation uses Spring Cloud Azure for seamless Spring Boot integration. It leverages
 * auto-configuration and Spring Cloud Azure's BlobServiceClient bean. Files are organized by course
 * ID using blob prefixes, and unique filenames are generated to prevent naming conflicts while
 * preserving file extensions.
 *
 * <p>This service is activated when the property 'file.storage.type' is set to 'azure'. It uses
 * Spring Cloud Azure recommended properties and auto-configured beans.
 */
@Service
@ConditionalOnProperty(name = "file.storage.type", havingValue = "azure")
public class AzureBlobFileStorageServiceImpl implements FileStorageService {

  @Autowired private BlobServiceClient blobServiceClient;

  @Value("${azure.storage.container-name}")
  private String containerName;

  private BlobContainerClient containerClient;

  /**
   * {@inheritDoc}
   *
   * <p>Initializes the Azure Blob Storage container using the auto-configured BlobServiceClient
   * from Spring Cloud Azure. Creates the container if it doesn't exist.
   */
  @Override
  public void init() {
    try {
      // Get container client using Spring Cloud Azure auto-configured client
      containerClient = blobServiceClient.getBlobContainerClient(containerName);

      // Create container if it doesn't exist
      if (!containerClient.exists()) {
        containerClient.create();
        System.out.println("Created Azure Blob container: " + containerName);
      }

      System.out.println(
          "Spring Cloud Azure Blob Storage initialized successfully with container: "
              + containerName);
    } catch (Exception e) {
      System.err.println("Failed to initialize Spring Cloud Azure Blob Storage: " + e.getMessage());
      throw new RuntimeException("Azure Blob Storage initialization failed", e);
    }
  }

  /**
   * {@inheritDoc}
   *
   * <p>Stores the file in Azure Blob Storage with a unique filename and organized by course ID. The
   * blob path structure is: {courseId}/{uniqueFilename}.{extension}
   *
   * @param file the multipart file to store
   * @param courseId the course ID for organization
   * @return the blob name (path) where the file was stored
   */
  @Override
  public String storeFile(MultipartFile file, String courseId) throws IOException {
    try {
      // Generate unique filename while preserving extension
      String originalFilename = file.getOriginalFilename();
      String extension = "";
      if (originalFilename != null && originalFilename.contains(".")) {
        extension = originalFilename.substring(originalFilename.lastIndexOf("."));
      }

      String uniqueFilename = UUID.randomUUID().toString() + extension;
      String blobName = courseId + "/" + uniqueFilename;

      // Get blob client
      BlobClient blobClient = containerClient.getBlobClient(blobName);

      // Upload file with content type detection
      try (InputStream inputStream = file.getInputStream()) {
        String contentType = file.getContentType();
        if (contentType == null || contentType.isEmpty()) {
          contentType = "application/octet-stream";
        }

        // Upload the blob
        blobClient.upload(inputStream, file.getSize(), true);

        // Set content type
        blobClient.setHttpHeaders(
            new com.azure.storage.blob.models.BlobHttpHeaders().setContentType(contentType));

        System.out.println("File uploaded to Azure Blob Storage: " + blobName);
        return blobName;
      }
    } catch (IOException e) {
      System.err.println("Failed to store file in Azure Blob Storage: " + e.getMessage());
      throw e;
    } catch (Exception e) {
      System.err.println("Failed to store file in Azure Blob Storage: " + e.getMessage());
      throw new IOException("File storage failed", e);
    }
  }

  /**
   * {@inheritDoc}
   *
   * <p>For Azure Blob Storage, this returns a Path object containing the blob URL. Since Azure
   * blobs are accessed via URLs rather than filesystem paths, the Path contains the blob URL that
   * can be used to access the file.
   *
   * @param relativePath the blob name returned from storeFile
   * @return a Path object containing the blob URL
   */
  @Override
  public Path getFilePath(String relativePath) {
    try {
      BlobClient blobClient = containerClient.getBlobClient(relativePath);
      String blobUrl = blobClient.getBlobUrl();
      return Paths.get(blobUrl);
    } catch (Exception e) {
      System.err.println("Failed to get blob URL: " + e.getMessage());
      return Paths.get(relativePath); // Fallback to blob name
    }
  }

  /**
   * {@inheritDoc}
   *
   * <p>Deletes the blob from Azure Blob Storage.
   *
   * @param relativePath the blob name to delete
   * @throws IOException if deletion fails
   */
  @Override
  public void deleteFile(String relativePath) throws IOException {
    try {
      BlobClient blobClient = containerClient.getBlobClient(relativePath);
      boolean deleted = blobClient.deleteIfExists();

      if (deleted) {
        System.out.println("File deleted from Azure Blob Storage: " + relativePath);
      } else {
        System.out.println("File not found in Azure Blob Storage: " + relativePath);
      }
    } catch (Exception e) {
      System.err.println("Failed to delete file from Azure Blob Storage: " + e.getMessage());
      throw new IOException("File deletion failed", e);
    }
  }

  /**
   * Loads a file from Azure Blob Storage as a Spring Resource. This allows streaming the file
   * content directly to the client.
   *
   * @param blobName The full path/name of the blob to load (e.g., "1/abc-123.pdf").
   * @return A Resource object containing the file's data.
   * @throws IOException if the blob is not found or cannot be read.
   */
  public Resource loadFileAsResource(String blobName) throws IOException {
    try {
      System.out.println("DEBUG: Loading file from Azure Blob Storage");
      System.out.println("DEBUG: Container name: " + containerName);
      System.out.println("DEBUG: Blob name requested: " + blobName);
      System.out.println(
          "DEBUG: Full blob URL would be: "
              + containerClient.getBlobContainerUrl()
              + "/"
              + blobName);

      BlobClient blobClient = containerClient.getBlobClient(blobName);

      if (!blobClient.exists()) {
        System.err.println("DEBUG: Blob does not exist at path: " + blobName);
        System.err.println("DEBUG: Blob URL: " + blobClient.getBlobUrl());
        throw new IOException("File not found: " + blobClient.getBlobUrl());
      }

      System.out.println("DEBUG: Blob found, downloading...");
      // Download the blob content into a byte array
      ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
      blobClient.downloadStream(outputStream);

      // Create a Spring Resource from the byte array
      Resource resource =
          new ByteArrayResource(outputStream.toByteArray()) {
            @Override
            public String getFilename() {
              // Extract the filename from the blob path
              String filename = blobName.substring(blobName.lastIndexOf('/') + 1);
              System.out.println(
                  "DEBUG: Extracted filename from blob path '" + blobName + "': " + filename);
              return filename;
            }
          };

      return resource;
    } catch (Exception e) {
      System.err.println("Failed to load file from Azure: " + e.getMessage());
      throw new IOException("Could not read file: " + blobName, e);
    }
  }
}
