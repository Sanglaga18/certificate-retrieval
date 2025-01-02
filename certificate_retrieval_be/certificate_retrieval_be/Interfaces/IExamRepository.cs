using certificate_retrieval_be.Models;

namespace certificate_retrieval_be.Interfaces
{
    public interface IExamRepository
    {
        Task<IEnumerable<Exams>> GetAll();
        Task<Exams> GetById(int id);
        Task<Exams> CreateExam(Exams exam);
        Task<Exams> UpdateExam(int id, Exams exam);
        Task DeleteExam(int id);
        Task<bool> HasLinkedExamResult(int id);
        Task<bool> ExamExists(int id);
    }
}
