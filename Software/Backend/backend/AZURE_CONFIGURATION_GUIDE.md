# Azure Blob Storage Configuration Guide

## Why the Application Failed

The application failed with the error:
```
Could not resolve placeholder 'azure.storage.container-name' in value "${azure.storage.container-name}"
```

**Root Cause**: The Azure implementation (`AzureBlobFileStorageServiceImpl`) was activated but missing required configuration properties.

## The Problem

When you set `file.storage.type=azure`, Spring activates the `AzureBlobFileStorageServiceImpl` service using the `@ConditionalOnProperty` annotation. However, this service requires:

1. **Container name**: `azure.storage.container-name` (was commented out)
2. **Azure authentication**: Missing account key or managed identity configuration
3. **BlobServiceClient bean**: Auto-configured by Spring Cloud Azure when authentication is properly set up

## Required Azure Configuration

### Option 1: Account Key Authentication (Recommended for Development)

```properties
# application.properties
file.storage.type=azure
spring.cloud.azure.storage.blob.account-name=slmpma
spring.cloud.azure.storage.blob.endpoint=https://slmpma.blob.core.windows.net/
spring.cloud.azure.storage.blob.account-key=${AZURE_STORAGE_ACCOUNT_KEY}
azure.storage.container-name=mpma-files
```

**Environment Variable Required:**
```bash
export AZURE_STORAGE_ACCOUNT_KEY="your-actual-azure-storage-account-key"
```

### Option 2: Connection String Authentication

```properties
file.storage.type=azure
spring.cloud.azure.storage.blob.connection-string=${AZURE_STORAGE_CONNECTION_STRING}
azure.storage.container-name=mpma-files
```

**Environment Variable Required:**
```bash
export AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=slmpma;AccountKey=your-key;EndpointSuffix=core.windows.net"
```

### Option 3: Managed Identity (Production)

```properties
file.storage.type=azure
spring.cloud.azure.storage.blob.account-name=slmpma
azure.storage.container-name=mpma-files
# No explicit credentials needed - uses Azure Managed Identity
```

## How to Get Your Azure Storage Account Key

1. **Azure Portal**: Go to your Storage Account → Access Keys
2. **Azure CLI**: 
   ```bash
   az storage account keys list --resource-group your-resource-group --account-name slmpma
   ```

## Complete Working Configuration Example

```properties
# For development with Azure Blob Storage
file.storage.type=azure
spring.cloud.azure.storage.blob.account-name=slmpma
spring.cloud.azure.storage.blob.account-key=${AZURE_STORAGE_ACCOUNT_KEY:replace-with-your-key}
azure.storage.container-name=mpma-files
file.max-size=10MB

# Alternative: For local development
# file.storage.type=local
# file.upload.directory=./uploads
# file.max-size=10MB
```

## Switching Between Local and Azure Storage

### For Local Development:
```properties
file.storage.type=local
file.upload.directory=./uploads
```

### For Azure Production:
```properties
file.storage.type=azure
spring.cloud.azure.storage.blob.account-name=slmpma
spring.cloud.azure.storage.blob.account-key=${AZURE_STORAGE_ACCOUNT_KEY}
azure.storage.container-name=mpma-files
```

## Security Best Practices

1. **Never commit credentials to Git**
2. **Use environment variables for sensitive data**
3. **Use Managed Identity in production**
4. **Rotate access keys regularly**

## Testing the Configuration

1. **Set the environment variable**:
   ```bash
   export AZURE_STORAGE_ACCOUNT_KEY="your-actual-key"
   ```

2. **Update application.properties**:
   ```properties
   file.storage.type=azure
   spring.cloud.azure.storage.blob.account-name=slmpma
   spring.cloud.azure.storage.blob.account-key=${AZURE_STORAGE_ACCOUNT_KEY}
   azure.storage.container-name=mpma-files
   ```

3. **Restart the application**

## Current Configuration

The application is now configured to use **local storage** by default. To switch to Azure:

1. Get your Azure Storage Account Key
2. Set the `AZURE_STORAGE_ACCOUNT_KEY` environment variable
3. Uncomment and configure the Azure properties in `application.properties`
4. Change `file.storage.type=azure`

## Troubleshooting

### Error: "Could not resolve placeholder"
- **Cause**: Missing configuration property
- **Solution**: Ensure all required properties are uncommented and set

### Error: "BlobServiceClient bean not found"
- **Cause**: Spring Cloud Azure auto-configuration failed
- **Solution**: Check authentication configuration (account key, connection string, or managed identity)

### Error: "Access denied"
- **Cause**: Invalid credentials or insufficient permissions
- **Solution**: Verify account key and storage account permissions
