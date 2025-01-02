using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs;
using System;

namespace certificate_retrieval_be.Services
{
    public class BlobService : IBlobService
    {
        private readonly BlobServiceClient _certificateBlobClient;
        private readonly BlobServiceClient _diplomaBlobClient;
        private readonly BlobServiceClient _studentImageBlobClient;
        private readonly BlobServiceClient _idCardBlobClient;

        public BlobService()
        {
            // Load environment variables from the .env file
            DotNetEnv.Env.Load();

            // Retrieve connection strings from the environment variables
            string certificateConnectionString = Environment.GetEnvironmentVariable("CERTIFICATE_STORAGE_ACCOUNT");
            string diplomaConnectionString = Environment.GetEnvironmentVariable("DIPLOMA_STORAGE_ACCOUNT");
            string studentImageConnectionString = Environment.GetEnvironmentVariable("STUDENT_IMAGE_STORAGE_ACCOUNT");
            string idCardConnectionString = Environment.GetEnvironmentVariable("ID_CARD_STORAGE_ACCOUNT");

            // Initialize BlobServiceClient instances
            _certificateBlobClient = new BlobServiceClient(certificateConnectionString);
            _diplomaBlobClient = new BlobServiceClient(diplomaConnectionString);
            _studentImageBlobClient = new BlobServiceClient(studentImageConnectionString);
            _idCardBlobClient = new BlobServiceClient(idCardConnectionString);
        }

        private BlobServiceClient GetBlobClient(string storageType)
        {
            return storageType switch
            {
                "certificate" => _certificateBlobClient,
                "diploma" => _diplomaBlobClient,
                "studentImage" => _studentImageBlobClient,
                "idCard" => _idCardBlobClient,
                _ => throw new ArgumentException($"Unknown storage type: {storageType}")
            };
        }

        public async Task<bool> DeleteBlob(string blobName, string containerName, string storageType)
        {
            var blobClient = GetBlobClient(storageType);
            BlobContainerClient blobContainerClient = blobClient.GetBlobContainerClient(containerName);
            BlobClient client = blobContainerClient.GetBlobClient(blobName);

            return await client.DeleteIfExistsAsync();
        }

        public async Task<string> GetBlob(string blobName, string containerName, string storageType)
        {
            var blobClient = GetBlobClient(storageType);
            BlobContainerClient blobContainerClient = blobClient.GetBlobContainerClient(containerName);
            BlobClient client = blobContainerClient.GetBlobClient(blobName);

            return client.Uri.AbsoluteUri;
        }

        public async Task<string> UploadBlob(string blobName, string containerName, IFormFile file, string storageType)
        {
            var blobClient = GetBlobClient(storageType);
            BlobContainerClient blobContainerClient = blobClient.GetBlobContainerClient(containerName);
            BlobClient client = blobContainerClient.GetBlobClient(blobName);

            var httpHeaders = new BlobHttpHeaders()
            {
                ContentType = file.ContentType
            };
            var result = await client.UploadAsync(file.OpenReadStream(), httpHeaders);

            if (result != null)
            {
                return await GetBlob(blobName, containerName, storageType);
            }
            return "";
        }

        public async Task CreateContainerIfNotExists(string containerName, string storageType)
        {
            var blobClient = GetBlobClient(storageType);
            BlobContainerClient blobContainerClient = blobClient.GetBlobContainerClient(containerName);
            await blobContainerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);
        }

        public async Task DeleteContainer(string containerName, string storageType)
        {
            var blobClient = GetBlobClient(storageType);
            BlobContainerClient blobContainerClient = blobClient.GetBlobContainerClient(containerName);
            await blobContainerClient.DeleteIfExistsAsync();
        }
    }
}
