using certificate_retrieval_be.Models.Dto;
using certificate_retrieval_be.Models;

namespace certificate_retrieval_be.Interfaces
{
    public interface IStudentRepository
    {
        Task<IEnumerable<Students>> GetAll();
        Task<Students> GetById(string studentId);
        Task<Students> Update(string studentId, StudentsUpdateDTO updateDto);
        Task<bool> StudentExists(string studentId);
        Task<string> UploadStudentImage(string studentId, IFormFile image);
        Task<string> UploadIdCardImage(string studentId, IFormFile image, bool isFrontSide);
        Task DeleteImage(string imageUrl, string containerName, string imageType);
    }
}
