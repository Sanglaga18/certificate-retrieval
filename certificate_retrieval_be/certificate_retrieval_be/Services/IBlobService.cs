namespace certificate_retrieval_be.Services
{
    public interface IBlobService
    {
        Task<string> GetBlob(string blobName, string containerName, string storageType);
        Task<bool> DeleteBlob(string blobName, string containerName, string storageType);
        Task<string> UploadBlob(string blobName, string containerName, IFormFile file, string storageType);
        Task CreateContainerIfNotExists(string containerName, string storageType);
        Task DeleteContainer(string containerName, string storageType);
    }
}
