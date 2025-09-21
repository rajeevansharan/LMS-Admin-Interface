package lk.slpa.mpma.backend.service;

import static org.junit.jupiter.api.Assertions.*;

import lk.slpa.mpma.backend.service.impl.FileStorageServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

/** Test class for FileStorageService implementations. */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@ActiveProfiles("test")
@TestPropertySource(
    properties = {
      "file.storage.type=local",
      "file.upload.directory=${java.io.tmpdir}/test-uploads"
    })
public class FileStorageServiceTest {

  @Autowired private FileStorageService fileStorageService;

  @Test
  public void testLocalFileStorageServiceBeanCreation() {
    assertNotNull(fileStorageService);
    assertTrue(fileStorageService instanceof FileStorageServiceImpl);
    System.out.println(
        "Local FileStorageService bean created successfully: "
            + fileStorageService.getClass().getSimpleName());
  }

  @Test
  public void testFileStorageServiceInitialization() {
    assertDoesNotThrow(
        () -> {
          fileStorageService.init();
        });
    System.out.println("FileStorageService initialized successfully");
  }
}
