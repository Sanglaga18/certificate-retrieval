using certificate_retrieval_be.Models;

namespace certificate_retrieval_be.Interfaces
{
    public interface ICourseRepository
    {
        Task<IEnumerable<Courses>> GetAll();
        Task<Courses> GetById(int id);
        Task<Courses> CreateCourse(Courses course);
        Task<Courses> UpdateCourse(int id, Courses course);
        Task DeleteCourse(int id);
        Task<bool> HasLinkedEnrollment(int id);
        Task<bool> CourseExists(int id);
    }
}
