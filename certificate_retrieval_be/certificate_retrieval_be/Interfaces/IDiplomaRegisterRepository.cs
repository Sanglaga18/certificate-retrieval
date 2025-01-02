using certificate_retrieval_be.Models;

namespace certificate_retrieval_be.Interfaces
{
    public interface IDiplomaRegisterRepository
    {
        Task<IEnumerable<DiplomaRegister>> GetAll();
        Task<DiplomaRegister> GetById(int id);
        Task<DiplomaRegister> CreateDiplomaRegister(DiplomaRegister diplomaRegister);
        Task<DiplomaRegister> UpdateDiplomaRegister(int id, DiplomaRegister diplomaRegister);
        Task DeleteDiplomaRegister(int id);
        Task<bool> HasLinkedDiploma(int id);
        Task<bool> DiplomaRegisterExists(int id);
    }
}
