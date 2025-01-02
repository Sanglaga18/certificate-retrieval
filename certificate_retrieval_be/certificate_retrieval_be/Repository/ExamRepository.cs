using certificate_retrieval_be.Data;
using certificate_retrieval_be.Interfaces;
using certificate_retrieval_be.Models;
using Microsoft.EntityFrameworkCore;

namespace certificate_retrieval_be.Repository
{
    public class ExamRepository : IExamRepository
    {
        private readonly ApplicationDbContext _db;

        public ExamRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<Exams>> GetAll()
        {
            return await _db.Exams.ToListAsync();
        }

        public async Task<Exams> GetById(int id)
        {
            return await _db.Exams.FirstOrDefaultAsync(c => c.ExamID == id);
        }

        public async Task<Exams> CreateExam(Exams exam)
        {
            await _db.Exams.AddAsync(exam);
            await _db.SaveChangesAsync();
            return exam;
        }

        public async Task<Exams> UpdateExam(int id, Exams exam)
        {
            var existingExam = await _db.Exams.FirstOrDefaultAsync(c => c.ExamID == id);
            if (existingExam == null)
                return null;

            // Cập nhật thông tin khóa học
            existingExam.ExamName = exam.ExamName;
            existingExam.ExamDate = exam.ExamDate;

            _db.Exams.Update(existingExam);
            await _db.SaveChangesAsync();

            return existingExam;
        }

        public async Task DeleteExam(int id)
        {
            var exam = await _db.Exams.FirstOrDefaultAsync(c => c.ExamID == id);
            if (exam != null)
            {
                _db.Exams.Remove(exam);
                await _db.SaveChangesAsync();
            }
        }

        public async Task<bool> ExamExists(int id)
        {
            return await _db.Exams.AnyAsync(c => c.ExamID == id);
        }
        public async Task<bool> HasLinkedExamResult(int id)
        {
            return await _db.ExamResults.AnyAsync(e => e.ExamID == id);
        }
    }
}
