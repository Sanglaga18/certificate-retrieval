using certificate_retrieval_be.Models;
using certificate_retrieval_be.Models.Dto;
using Microsoft.AspNetCore.Mvc;

namespace certificate_retrieval_be.Interfaces
{
    public interface IDiplomaRepository
    {
        Task<IEnumerable<Diplomas>> GetAll(int? userID = null, string? searchString = null);
        Task<Diplomas> GetById(string diplomaNumber, int? userID = null);
        Task<Diplomas> CreateDiploma(DiplomaCreateDTO model);
        Task<Diplomas> UpdateDiploma(string diplomaNumber, DiplomaUpdateDTO model);
        Task DeleteDiploma(string diplomaNumber);
        Task<Users> GetUserById(int userId);
        Task<bool> DiplomaExist(string id);
        Task<bool> RegistryNumberExists(string registryNumber, string? excludeDiplomaId = null);
        Task<bool> ExamResultExists(int? resultId);
        Task<bool> DiplomaRegisterExists(int diplomaRegisterId);
    }
}
