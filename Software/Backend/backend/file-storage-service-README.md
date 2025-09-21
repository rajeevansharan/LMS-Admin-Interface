# File Storage Service Implementations

This project provides two implementations of the `FileStorageService` interface, allowing you to choose between local filesystem storage and Azure Blob Storage based on your deployment needs.

## Available Implementations

### 1. Local Filesystem Storage (`FileStorageServiceImpl`)
- **Default implementation** - activated when `file.storage.type=local` or not specified
- Stores files in the local filesystem organized by course ID
- Suitable for development and single-server deployments

### 2. Azure Blob Storage (`AzureBlobFileStorageServiceImpl`)
- **Cloud storage implementation** - activated when `file.storage.type=azure`
- Uses Spring Cloud Azure for seamless Spring Boot integration
- Stores files in Azure Blob Storage with course-based organization
- Suitable for production deployments with scalability requirements
- Follows Azure's recommended Spring Boot integration approach

## Configuration

### Local Filesystem Storage (Default)

```properties
# application.properties
file.storage.type=local
file.upload.directory=./uploads
```

### Azure Blob Storage (Spring Cloud Azure)

```properties
# application.properties
file.storage.type=azure
spring.cloud.azure.storage.blob.account-name=${AZURE_STORAGE_ACCOUNT_NAME}
spring.cloud.azure.storage.blob.endpoint=${AZURE_STORAGE_ACCOUNT_ENDPOINT}
azure.storage.container-name=mpma-files
```

## Maven Dependencies

### For Azure Blob Storage (Spring Cloud Azure)

```xml
<!-- Add dependency management section -->
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.azure.spring</groupId>
            <artifactId>spring-cloud-azure-dependencies</artifactId>
            <version>5.22.0</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>

<!-- Add the starter dependency -->
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-storage-blob</artifactId>
</dependency>
```
```

## Usage

The beauty of this design is that your controllers and other services don't need to know which implementation is being used. Simply inject the `FileStorageService` interface:

```java
@RestController
public class FileController {
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("courseId") String courseId) {
        
        try {
            // This works with any implementation (local, azure, or azure-spring-cloud)
            String filePath = fileStorageService.storeFile(file, Long.parseLong(courseId));
            return ResponseEntity.ok("File uploaded successfully: " + filePath);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }
}
```

## Implementation Switching

You can switch between implementations without changing any code - just update your `application.properties`:

### Switch to Local Storage
```properties
file.storage.type=local
```

### Switch to Azure (Direct SDK)
```properties
file.storage.type=azure
azure.storage.connection-string=your-connection-string
azure.storage.container-name=your-container
```

### Switch to Spring Cloud Azure (Recommended)
```properties
file.storage.type=azure-spring-cloud
spring.cloud.azure.storage.blob.account-name=youraccount
spring.cloud.azure.storage.blob.account-key=yourkey
azure.storage.container-name=your-container
```
            String filePath = fileStorageService.storeFile(file, courseId);
            return ResponseEntity.ok(filePath);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload file");
        }
    }
}
```

## Switching Between Implementations

To switch from local storage to Azure Blob Storage:

1. Add the Azure Blob Storage dependency to your `pom.xml`
2. Update your `application.properties`:
   - Change `file.storage.type` from `local` to `azure`
   - Add Azure storage configuration properties
3. Restart your application

No code changes are required in your controllers or services!

## File Organization

Both implementations organize files by course ID:

- **Local Filesystem**: `./uploads/{courseId}/{uniqueFileName}.{extension}`
- **Azure Blob Storage**: `{containerName}/{courseId}/{uniqueFileName}.{extension}`

## Features

### Common Features (Both Implementations)
- ✅ Course-based file organization
- ✅ Unique filename generation (UUID-based)
- ✅ File extension preservation
- ✅ Empty file validation
- ✅ Safe file deletion
- ✅ Same interface for all operations

### Azure Blob Storage Additional Features
- ✅ Automatic content-type detection
- ✅ HTTP headers configuration
- ✅ Direct blob URL generation
- ✅ Scalable cloud storage
- ✅ Built-in redundancy and backup

## Error Handling

Both implementations provide consistent error handling:
- `IllegalArgumentException` for empty files
- `IOException` for storage operation failures
- `RuntimeException` for initialization failures

## Security Considerations

### Local Filesystem
- Ensure proper file system permissions
- Validate file types and sizes before storage
- Consider disk space limitations

### Azure Blob Storage
- Use secure connection strings
- Implement proper access policies
- Consider blob access levels (private/public)
- Monitor storage costs and usage

## Development vs Production

### Development
Use local filesystem storage for easier debugging and development:
```properties
file.storage.type=local
file.upload.directory=./dev-uploads
```

### Production
Use Azure Blob Storage for scalability and reliability:
```properties
file.storage.type=azure
azure.storage.connection-string=${AZURE_STORAGE_CONNECTION_STRING}
azure.storage.container-name=${AZURE_STORAGE_CONTAINER_NAME}
```

## Summary

The FileStorageService refactoring is now complete with three fully functional implementations:

### ✅ Completed Features
1. **Interface-based Design**: All implementations follow the same `FileStorageService` interface
2. **Configuration-driven Switching**: Change storage implementation without code changes
3. **Local Filesystem Storage**: Production-ready with course-based organization
4. **Azure Blob Storage (Direct SDK)**: Full cloud storage with connection string authentication
5. **Azure Blob Storage (Spring Cloud Azure)**: Uses Azure-recommended Spring Boot integration with auto-configured beans
6. **Comprehensive Documentation**: Full setup and usage instructions
7. **Latest Azure Dependencies**: Updated to use Spring Cloud Azure Dependencies 5.22.0

### 🔧 Current Status
- All implementations compile without errors
- Maven dependencies properly configured with Spring Cloud Azure BOM
- Application properties cleaned up
- Configuration examples documented
- Three storage options available:
  - `file.storage.type=local` (default)
  - `file.storage.type=azure` (connection string)
  - `file.storage.type=azure-spring-cloud` (Spring Cloud Azure auto-configuration)

### 🚀 Next Steps
To use the implementations:
1. Choose your storage type by setting `file.storage.type` in `application.properties`
2. Add the appropriate configuration properties for your chosen implementation
3. For Spring Cloud Azure, ensure you have the proper dependencyManagement section
4. The service will automatically use the correct implementation
5. No code changes needed in controllers or other services
