package lk.slpa.mpma.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * Configuration validator that runs at startup to verify the FileStorageService is properly
 * configured and initialized.
 */
@Component
public class FileStorageConfigValidator implements ApplicationRunner {

  @Autowired private FileStorageService fileStorageService;

  @Override
  public void run(ApplicationArguments args) throws Exception {
    try {
      // Initialize the storage service
      fileStorageService.init();

      // Log which implementation is active
      String implementationClass = fileStorageService.getClass().getSimpleName();
      System.out.println("✅ FileStorageService initialized successfully: " + implementationClass);

    } catch (Exception e) {
      System.err.println("❌ FileStorageService initialization failed: " + e.getMessage());
      throw e;
    }
  }
}
