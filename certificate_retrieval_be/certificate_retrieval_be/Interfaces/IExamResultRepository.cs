using certificate_retrieval_be.Models.Dto;
using certificate_retrieval_be.Models;

namespace certificate_retrieval_be.Interfaces
{
    public interface IExamResultRepository
    {
        Task<IEnumerable<ExamResults>> GetAll();
        Task<ExamResults> GetById(int id);
        Task<object> GetStudentInfoByExamResultId(int examResultId);
        Task<ExamResults> CreateExamResult(ExamResultsCreateDTO createDto);
        Task<ExamResults> UpdateExamResult(int id, ExamResultsUpdateDTO updateDto);
        Task DeleteExamResult(int id);
        Task<bool> ExamResultExists(int id);
        Task<bool> StudentExists(string studentId);
        Task<bool> ExamExists(int examId);
        Task<bool> HasLinkedDiolomas(int examResultId);
    }
}
