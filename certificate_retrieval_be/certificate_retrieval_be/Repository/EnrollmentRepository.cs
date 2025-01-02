using certificate_retrieval_be.Data;
using certificate_retrieval_be.Models;
using certificate_retrieval_be.Models.Dto;
using certificate_retrieval_be.Repository.IRepository;
using Microsoft.EntityFrameworkCore;

namespace certificate_retrieval_be.Repository
{
    public class EnrollmentRepository : IEnrollmentRepository
    {
        private readonly ApplicationDbContext _db;

        public EnrollmentRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<Enrollments>> GetAll()
        {
            return await _db.Enrollments
                .Include(e => e.Student)
                .Include(e => e.Course)
                .ToListAsync();
        }

        public async Task<Enrollments> GetById(int id)
        {
            return await _db.Enrollments
                .Include(e => e.Student)
                .Include(e => e.Course)
                .FirstOrDefaultAsync(e => e.EnrollmentID == id);
        }

        public async Task<object> GetStudentInfoByEnrollmentId(int enrollmentId)
        {
            var enrollment = await _db.Enrollments
                .Include(e => e.Student)
                .Include(e => e.Course)
                .FirstOrDefaultAsync(e => e.EnrollmentID == enrollmentId);

            if (enrollment == null)
                return null;

            var student = await _db.Students
                .FirstOrDefaultAsync(s => s.StudentID == enrollment.StudentID);

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
                Image = student.Image,
                FrontIdCard = student.FrontIdCard,
                CourseName = enrollment.Course.CourseName,
                FinalTestScore = enrollment.FinalTestScore
            };
        }

        public async Task<Enrollments> CreateEnrollment(EnrollmentsCreateDTO createDto)
        {
            var newEnrollment = new Enrollments
            {
                StudentID = createDto.StudentID,
                CourseID = createDto.CourseID,
                EnrollmentDate = createDto.EnrollmentDate,
                FinalTestScore = createDto.FinalTestScore
            };

            await _db.Enrollments.AddAsync(newEnrollment);
            await _db.SaveChangesAsync();
            return newEnrollment;
        }

        public async Task<Enrollments> UpdateEnrollment(int id, EnrollmentsUpdateDTO updateDto)
        {
            var enrollment = await _db.Enrollments.FindAsync(id);
            if (enrollment == null)
                return null;

            enrollment.StudentID = updateDto.StudentID;
            enrollment.CourseID = updateDto.CourseID;
            enrollment.EnrollmentDate = updateDto.EnrollmentDate;
            enrollment.FinalTestScore = updateDto.FinalTestScore;

            _db.Enrollments.Update(enrollment);
            await _db.SaveChangesAsync();
            return enrollment;
        }

        public async Task DeleteEnrollment(int id)
        {
            var enrollment = await _db.Enrollments.FindAsync(id);
            if (enrollment != null)
            {
                _db.Enrollments.Remove(enrollment);
                await _db.SaveChangesAsync();
            }
        }

        public async Task<bool> EnrollmentExists(int id)
        {
            return await _db.Enrollments.AnyAsync(e => e.EnrollmentID == id);
        }

        public async Task<bool> StudentExists(string studentId)
        {
            return await _db.Students.AnyAsync(s => s.StudentID == studentId);
        }

        public async Task<bool> CourseExists(int courseId)
        {
            return await _db.Courses.AnyAsync(c => c.CourseID == courseId);
        }

        public async Task<bool> HasLinkedCertificates(int enrollmentId)
        {
            return await _db.Certificates.AnyAsync(d => d.EnrollmentID == enrollmentId);
        }
    }
}