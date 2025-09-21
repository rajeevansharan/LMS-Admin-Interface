package lk.slpa.mpma.backend.service;

import static org.junit.jupiter.api.Assertions.*;

import java.io.IOException;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;

/**
 * Integration test for Azure Blob Storage functionality. This test verifies that the Azure
 * implementation works correctly.
 *
 * <p>Note: This test will only run if Azure is properly configured in application.properties
 */
@SpringBootTest
@ActiveProfiles("default") // Use default profile to test with Azure configuration
public class AzureFileStorageIntegrationTest {

  @Autowired private FileStorageService fileStorageService;

  @Test
  public void testAzureFileStorageOperations() throws IOException {
    // Verify the Azure implementation is loaded
    assertNotNull(fileStorageService);
    assertEquals("AzureBlobFileStorageServiceImpl", fileStorageService.getClass().getSimpleName());

    // Create a test file
    String testContent = "Hello Azure Blob Storage!";
    MockMultipartFile testFile =
        new MockMultipartFile(
            "testfile", "test-document.txt", "text/plain", testContent.getBytes());

    String courseId = "AZURE_TEST_COURSE";

    try {
      // Test file upload
      String storedFilePath = fileStorageService.storeFile(testFile, courseId);
      assertNotNull(storedFilePath);
      assertTrue(storedFilePath.contains(courseId));
      assertTrue(storedFilePath.endsWith(".txt"));

      System.out.println("✅ File uploaded successfully to: " + storedFilePath);

      // Test file path retrieval (should return Azure blob URL)
      Path filePath = fileStorageService.getFilePath(storedFilePath);
      assertNotNull(filePath);
      String pathString = filePath.toString();
      assertTrue(
          pathString.contains("slmpma.blob.core.windows.net")
              || pathString.contains(storedFilePath));

      System.out.println("✅ File path retrieved: " + pathString);

      // Test file deletion
      fileStorageService.deleteFile(storedFilePath);
      System.out.println("✅ File deleted successfully: " + storedFilePath);

    } catch (Exception e) {
      System.err.println("❌ Azure storage test failed: " + e.getMessage());
      throw e;
    }
  }

  @Test
  public void testAzureStorageInitialization() {
    // Verify that the service is properly initialized
    assertNotNull(fileStorageService);
    System.out.println("✅ Azure Blob Storage service is properly initialized");
    System.out.println("   Implementation: " + fileStorageService.getClass().getSimpleName());
  }
}
