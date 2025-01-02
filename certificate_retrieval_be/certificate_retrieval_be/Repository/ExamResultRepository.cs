using certificate_retrieval_be.Data;
using certificate_retrieval_be.Models.Dto;
using certificate_retrieval_be.Models;
using Microsoft.EntityFrameworkCore;
using certificate_retrieval_be.Interfaces;

namespace certificate_retrieval_be.Repository
{
    public class ExamResultRepository : IExamResultRepository
    {
        private readonly ApplicationDbContext _db;

        public ExamResultRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<ExamResults>> GetAll()
        {
            return await _db.ExamResults
                .Include(e => e.Student)
                .Include(e => e.Exam)
                .ToListAsync();
        }

        public async Task<ExamResults> GetById(int id)
        {
            return await _db.ExamResults
                .Include(e => e.Student)
                .Include(e => e.Exam)
                .FirstOrDefaultAsync(e => e.ResultID == id);
        }
            
        public async Task<object> GetStudentInfoByExamResultId(int examResultId)
        {
            var examResult = await _db.ExamResults
                .Include(e => e.Student)
                .Include(e => e.Exam)
                .FirstOrDefaultAsync(e => e.ResultID == examResultId);

            if (examResult == null)
                return null;

            var student = await _db.Students
                .FirstOrDefaultAsync(s => s.StudentID == examResult.StudentID);

            if (student == null)
                return null;

            var user = await _db.Users
                .FirstOrDefaultAsync(u => u.Username == student.StudentID);

            if (user == null)
                return null;

            return new
            {
                StudentID = student.StudentID,
                FullName = user.FullName,
                Image = student.Image,  // Hình ảnh cá nhân
                FrontIdCard = student.FrontIdCard,  // Hình ảnh căn cước công dân
                ExamName = examResult.Exam.ExamName,
                MarksObtained = examResult.MarksObtained
            };
        }

        public async Task<ExamResults> CreateExamResult(ExamResultsCreateDTO createDto)
        {
            var newExamResult = new ExamResults
            {
                ExamID = createDto.ExamID,
                StudentID = createDto.StudentID,
                MarksObtained = createDto.MarksObtained,
                ExamStatus = createDto.ExamStatus
            };

            await _db.ExamResults.AddAsync(newExamResult);
            await _db.SaveChangesAsync();
            return newExamResult;
        }

        public async Task<ExamResults> UpdateExamResult(int id, ExamResultsUpdateDTO updateDto)
        {
            var examResult = await _db.ExamResults.FindAsync(id);
            if (examResult == null)
                return null;

            examResult.StudentID = updateDto.StudentID;
            examResult.ExamID = updateDto.ExamID;
            examResult.MarksObtained = updateDto.MarksObtained;
            examResult.ExamStatus = updateDto.ExamStatus;

            _db.ExamResults.Update(examResult);
            await _db.SaveChangesAsync();
            return examResult;
        }

        public async Task DeleteExamResult(int id)
        {
            var examResult = await _db.ExamResults.FindAsync(id);
            if (examResult != null)
            {
                _db.ExamResults.Remove(examResult);
                await _db.SaveChangesAsync();
            }
        }

        public async Task<bool> ExamResultExists(int id)
        {
            return await _db.ExamResults.AnyAsync(e => e.ResultID == id);
        }

        public async Task<bool> StudentExists(string studentId)
        {
            return await _db.Students.AnyAsync(s => s.StudentID == studentId);
        }

        public async Task<bool> ExamExists(int examId)
        {
            return await _db.Exams.AnyAsync(c => c.ExamID == examId);
        }

        public async Task<bool> HasLinkedDiolomas(int examResultId)
        {  
            return await _db.Diplomas.AnyAsync(d => d.ExamResultID == examResultId);
        }
    }
}
