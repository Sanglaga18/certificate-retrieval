using certificate_retrieval_be.Data;
using certificate_retrieval_be.Interfaces;
using certificate_retrieval_be.Models;
using Microsoft.EntityFrameworkCore;

namespace certificate_retrieval_be.Repository
{
    public class CourseRepository : ICourseRepository
    {
        private readonly ApplicationDbContext _db;

        public CourseRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<Courses>> GetAll()
        {
            return await _db.Courses.ToListAsync();
        }

        public async Task<Courses> GetById(int id)
        {
            return await _db.Courses.FirstOrDefaultAsync(c => c.CourseID == id);
        }

        public async Task<Courses> CreateCourse(Courses course)
        {
            await _db.Courses.AddAsync(course);
            await _db.SaveChangesAsync();
            return course;
        }

        public async Task<Courses> UpdateCourse(int id, Courses course)
        {
            var existingCourse = await _db.Courses.FirstOrDefaultAsync(c => c.CourseID == id);
            if (existingCourse == null)
                return null;

            // Cập nhật thông tin khóa học
            existingCourse.CourseName = course.CourseName;
            existingCourse.StartDate = course.StartDate;
            existingCourse.EndDate = course.EndDate;

            _db.Courses.Update(existingCourse);
            await _db.SaveChangesAsync();

            return existingCourse;
        }

        public async Task DeleteCourse(int id)
        {
            var course = await _db.Courses.FirstOrDefaultAsync(c => c.CourseID == id);
            if (course != null)
            {
                _db.Courses.Remove(course);
                await _db.SaveChangesAsync();
            }
        }

        public async Task<bool> CourseExists(int id)
        {
            return await _db.Courses.AnyAsync(c => c.CourseID == id);
        }

        public async Task<bool> HasLinkedEnrollment(int id)
        {
            return await _db.Enrollments.AnyAsync(e => e.CourseID == id);
        }

    }
}
