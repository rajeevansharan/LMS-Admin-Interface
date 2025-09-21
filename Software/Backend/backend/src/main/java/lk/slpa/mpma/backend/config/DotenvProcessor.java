package lk.slpa.mpma.backend.config;

import io.github.cdimascio.dotenv.Dotenv;
import java.util.HashMap;
import java.util.Map;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.stereotype.Component;

/**
 * Environment post-processor that loads configuration from a .env file. This class enables the
 * application to use environment variables defined in a .env file at the root of the project, which
 * is particularly useful for local development and keeping sensitive information out of version
 * control.
 *
 * <p>The processor loads database connection properties and JPA configuration from the .env file
 * into Spring's environment, making them available to the application context.
 */
@Component
public class DotenvProcessor implements EnvironmentPostProcessor {

  /**
   * Processes the Spring environment after it has been created but before the application context
   * is created. Loads variables from the .env file and adds them to the environment with high
   * priority.
   *
   * @param environment The Spring environment to be modified
   * @param application The Spring application being started
   */
  @Override
  public void postProcessEnvironment(
      ConfigurableEnvironment environment, SpringApplication application) {

    // Load .env file for all environments but handle gracefully if not found
    Dotenv dotenv;
    try {
      dotenv = Dotenv.configure().ignoreIfMissing().load();
    } catch (Exception e) {
      // If .env file is not found or cannot be loaded, skip processing
      return;
    }

    Map<String, Object> propertySource = new HashMap<>();

    // Check if we're in test profile to determine which properties to load
    boolean isTestProfile = false;
    String[] activeProfiles = environment.getActiveProfiles();
    for (String profile : activeProfiles) {
      if ("test".equals(profile)) {
        isTestProfile = true;
        break;
      }
    }

    // For test profile, only load Azure credentials as environment variables
    // Do NOT load database properties to avoid overriding H2 test configuration
    if (isTestProfile) {
      // Only provide Azure credentials as AZURE_ environment variables for integration tests
      // These won't activate Azure auto-configuration but will be available for explicit Azure
      // tests
      String azureAccountName = dotenv.get("SPRING_CLOUD_AZURE_STORAGE_BLOB_ACCOUNT_NAME");
      String azureEndpoint = dotenv.get("SPRING_CLOUD_AZURE_STORAGE_BLOB_ENDPOINT");
      String azureAccountKey = dotenv.get("SPRING_CLOUD_AZURE_STORAGE_BLOB_ACCOUNT_KEY");
      String azureContainerName = dotenv.get("AZURE_STORAGE_CONTAINER_NAME");

      if (azureAccountName != null)
        propertySource.put("AZURE_STORAGE_ACCOUNT_NAME", azureAccountName);
      if (azureEndpoint != null) propertySource.put("AZURE_STORAGE_ENDPOINT", azureEndpoint);
      if (azureAccountKey != null) propertySource.put("AZURE_STORAGE_ACCOUNT_KEY", azureAccountKey);
      if (azureContainerName != null)
        propertySource.put("AZURE_STORAGE_CONTAINER_NAME", azureContainerName);
    } else {
      // For non-test profiles, load all properties including Azure

      // Database configuration
      String dbUrl = dotenv.get("SPRING_DATASOURCE_URL");
      String dbUsername = dotenv.get("SPRING_DATASOURCE_USERNAME");
      String dbPassword = dotenv.get("SPRING_DATASOURCE_PASSWORD");
      String ddlAuto = dotenv.get("SPRING_JPA_HIBERNATE_DDL_AUTO");

      if (dbUrl != null) propertySource.put("spring.datasource.url", dbUrl);
      if (dbUsername != null) propertySource.put("spring.datasource.username", dbUsername);
      if (dbPassword != null) propertySource.put("spring.datasource.password", dbPassword);
      if (ddlAuto != null) propertySource.put("spring.jpa.hibernate.ddl-auto", ddlAuto);

      // Azure Blob Storage configuration
      String azureAccountName = dotenv.get("SPRING_CLOUD_AZURE_STORAGE_BLOB_ACCOUNT_NAME");
      String azureEndpoint = dotenv.get("SPRING_CLOUD_AZURE_STORAGE_BLOB_ENDPOINT");
      String azureAccountKey = dotenv.get("SPRING_CLOUD_AZURE_STORAGE_BLOB_ACCOUNT_KEY");
      String azureContainerName = dotenv.get("AZURE_STORAGE_CONTAINER_NAME");

      if (azureAccountName != null) {
        propertySource.put("spring.cloud.azure.storage.blob.account-name", azureAccountName);
        propertySource.put("AZURE_STORAGE_ACCOUNT_NAME", azureAccountName);
      }
      if (azureEndpoint != null) {
        propertySource.put("spring.cloud.azure.storage.blob.endpoint", azureEndpoint);
        propertySource.put("AZURE_STORAGE_ENDPOINT", azureEndpoint);
      }
      if (azureAccountKey != null) {
        propertySource.put("spring.cloud.azure.storage.blob.account-key", azureAccountKey);
        propertySource.put("AZURE_STORAGE_ACCOUNT_KEY", azureAccountKey);
      }
      if (azureContainerName != null) {
        propertySource.put("azure.storage.container-name", azureContainerName);
        propertySource.put("AZURE_STORAGE_CONTAINER_NAME", azureContainerName);
      }
    }

    // Add the property source to the environment if it contains any properties
    if (!propertySource.isEmpty()) {
      environment
          .getPropertySources()
          .addFirst(new MapPropertySource("dotenvProperties", propertySource));
    }
  }
}
