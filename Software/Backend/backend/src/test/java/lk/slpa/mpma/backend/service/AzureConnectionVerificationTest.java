package lk.slpa.mpma.backend.service;

import static org.junit.jupiter.api.Assertions.*;

import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.azure.storage.blob.models.BlobContainerItem;
import com.azure.storage.blob.models.StorageAccountInfo;
import com.azure.storage.common.StorageSharedKeyCredential;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.env.Environment;
import org.springframework.test.context.ActiveProfiles;

/**
 * Comprehensive test to verify Azure Blob Storage connection and credentials. This test directly
 * connects to Azure to validate the connection is working.
 */
@SpringBootTest
@ActiveProfiles("default")
public class AzureConnectionVerificationTest {

  @Autowired private Environment environment;

  @Test
  public void testAzureCredentialsAndConnection() {
    // Get Azure credentials from environment variables (set by DotenvProcessor)
    String accountName = System.getenv("AZURE_STORAGE_ACCOUNT_NAME");
    String accountKey = System.getenv("AZURE_STORAGE_ACCOUNT_KEY");
    String endpoint = System.getenv("AZURE_STORAGE_ENDPOINT");
    String containerName = System.getenv("AZURE_STORAGE_CONTAINER_NAME");

    System.out.println("🔍 Checking Azure credentials from environment variables:");
    System.out.println("  Account Name: " + (accountName != null ? accountName : "❌ NOT SET"));
    System.out.println(
        "  Account Key: "
            + (accountKey != null ? "✅ SET (length: " + accountKey.length() + ")" : "❌ NOT SET"));
    System.out.println("  Endpoint: " + (endpoint != null ? endpoint : "❌ NOT SET"));
    System.out.println("  Container: " + (containerName != null ? containerName : "❌ NOT SET"));

    // Also check Spring Environment properties (these should be set by DotenvProcessor)
    System.out.println("\n🔍 Checking Azure credentials from Spring Environment:");
    String envAccountName = environment.getProperty("spring.cloud.azure.storage.blob.account-name");
    String envEndpoint = environment.getProperty("spring.cloud.azure.storage.blob.endpoint");
    String envAccountKey = environment.getProperty("spring.cloud.azure.storage.blob.account-key");
    String envContainer = environment.getProperty("azure.storage.container-name");

    System.out.println(
        "  Env Account Name: " + (envAccountName != null ? envAccountName : "❌ NOT SET"));
    System.out.println("  Env Account Key: " + (envAccountKey != null ? "✅ SET" : "❌ NOT SET"));
    System.out.println("  Env Endpoint: " + (envEndpoint != null ? envEndpoint : "❌ NOT SET"));
    System.out.println("  Env Container: " + (envContainer != null ? envContainer : "❌ NOT SET"));

    // Also check environment variables
    String envVarAccountName = environment.getProperty("AZURE_STORAGE_ACCOUNT_NAME");
    String envVarAccountKey = environment.getProperty("AZURE_STORAGE_ACCOUNT_KEY");
    String envVarEndpoint = environment.getProperty("AZURE_STORAGE_ENDPOINT");
    String envVarContainer = environment.getProperty("AZURE_STORAGE_CONTAINER_NAME");

    System.out.println("\n🔍 Checking AZURE_* environment variables from Spring Environment:");
    System.out.println(
        "  AZURE_STORAGE_ACCOUNT_NAME: "
            + (envVarAccountName != null ? envVarAccountName : "❌ NOT SET"));
    System.out.println(
        "  AZURE_STORAGE_ACCOUNT_KEY: " + (envVarAccountKey != null ? "✅ SET" : "❌ NOT SET"));
    System.out.println(
        "  AZURE_STORAGE_ENDPOINT: " + (envVarEndpoint != null ? envVarEndpoint : "❌ NOT SET"));
    System.out.println(
        "  AZURE_STORAGE_CONTAINER_NAME: "
            + (envVarContainer != null ? envVarContainer : "❌ NOT SET"));

    // Since we're running in default profile, the DotenvProcessor should provide properties
    // Let's use the Spring environment properties as the source of truth
    if (accountName == null)
      accountName = envAccountName != null ? envAccountName : envVarAccountName;
    if (accountKey == null) accountKey = envAccountKey != null ? envAccountKey : envVarAccountKey;
    if (endpoint == null) endpoint = envEndpoint != null ? envEndpoint : envVarEndpoint;
    if (containerName == null)
      containerName = envContainer != null ? envContainer : envVarContainer;

    // Verify all credentials are present (from either source)
    System.out.println("\n📋 Final credential check:");
    System.out.println(
        "  Final Account Name: " + (accountName != null ? accountName : "❌ NOT SET"));
    System.out.println("  Final Account Key: " + (accountKey != null ? "✅ SET" : "❌ NOT SET"));
    System.out.println("  Final Endpoint: " + (endpoint != null ? endpoint : "❌ NOT SET"));
    System.out.println(
        "  Final Container: " + (containerName != null ? containerName : "❌ NOT SET"));

    assertNotNull(accountName, "Azure account name is not available from any source");
    assertNotNull(accountKey, "Azure account key is not available from any source");
    assertNotNull(endpoint, "Azure endpoint is not available from any source");
    assertNotNull(containerName, "Azure container name is not available from any source");

    try {
      // Create Azure Blob Service Client with credentials
      System.out.println("\n🔗 Attempting to connect to Azure Blob Storage...");

      BlobServiceClient blobServiceClient =
          new BlobServiceClientBuilder()
              .endpoint(endpoint)
              .credential(new StorageSharedKeyCredential(accountName, accountKey))
              .buildClient();

      // Test connection by getting account info
      System.out.println("📊 Getting Azure storage account information...");
      StorageAccountInfo accountInfo = blobServiceClient.getAccountInfo();
      System.out.println("✅ Successfully connected to Azure Storage Account");
      System.out.println("  Account Kind: " + accountInfo.getAccountKind());
      System.out.println("  SKU Name: " + accountInfo.getSkuName());

      // List containers to verify access
      System.out.println("\n📁 Listing containers in the storage account:");
      for (BlobContainerItem container : blobServiceClient.listBlobContainers()) {
        System.out.println("  - Container: " + container.getName());
        if (container.getName().equals(containerName)) {
          System.out.println("    ✅ Target container '" + containerName + "' found!");
        }
      }

      // Test specific container access
      System.out.println("\n🎯 Testing access to target container: " + containerName);
      var containerClient = blobServiceClient.getBlobContainerClient(containerName);

      if (containerClient.exists()) {
        System.out.println("✅ Container '" + containerName + "' exists and is accessible");

        // Test listing blobs in the container
        System.out.println("📋 Listing some blobs in the container:");
        int blobCount = 0;
        for (var blob : containerClient.listBlobs()) {
          System.out.println("  - " + blob.getName());
          blobCount++;
          if (blobCount >= 5) { // Limit to first 5 blobs
            System.out.println("  ... (showing first 5 blobs)");
            break;
          }
        }
        if (blobCount == 0) {
          System.out.println("  (Container is empty)");
        }
      } else {
        fail("Container '" + containerName + "' does not exist or is not accessible");
      }

      System.out.println("\n🎉 Azure Blob Storage connection verification SUCCESSFUL!");
      System.out.println("✅ All credentials are valid");
      System.out.println("✅ Connection to Azure is working");
      System.out.println("✅ Container access is confirmed");

    } catch (Exception e) {
      System.err.println("\n❌ Azure connection verification FAILED!");
      System.err.println("Error: " + e.getMessage());
      System.err.println("Class: " + e.getClass().getSimpleName());

      if (e.getCause() != null) {
        System.err.println("Cause: " + e.getCause().getMessage());
      }

      fail("Azure Blob Storage connection failed: " + e.getMessage());
    }
  }

  @Test
  public void testSpringPropertyResolution() {
    // Test that Spring properties are properly resolved
    System.out.println("\n🔍 Testing Spring property resolution:");

    String[] propertiesToCheck = {
      "spring.cloud.azure.storage.blob.account-name",
      "spring.cloud.azure.storage.blob.endpoint",
      "spring.cloud.azure.storage.blob.account-key",
      "azure.storage.container-name"
    };

    for (String property : propertiesToCheck) {
      String value = System.getProperty(property);
      System.out.println("  " + property + ": " + (value != null ? "✅ SET" : "❌ NOT SET"));
    }
  }
}
