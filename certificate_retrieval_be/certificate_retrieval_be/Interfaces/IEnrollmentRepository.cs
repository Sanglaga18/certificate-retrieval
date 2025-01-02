using certificate_retrieval_be.Models;
using certificate_retrieval_be.Models.Dto;

namespace certificate_retrieval_be.Repository.IRepository
{
    public interface IEnrollmentRepository
    {
        Task<IEnumerable<Enrollments>> GetAll();
        Task<Enrollments> GetById(int id);
        Task<object> GetStudentInfoByEnrollmentId(int enrollmentId);
        Task<Enrollments> CreateEnrollment(EnrollmentsCreateDTO createDto);
        Task<Enrollments> UpdateEnrollment(int id, EnrollmentsUpdateDTO updateDto);
        Task DeleteEnrollment(int id);
        Task<bool> EnrollmentExists(int id);
        Task<bool> StudentExists(string studentId);
        Task<bool> CourseExists(int courseId);
        Task<bool> HasLinkedCertificates(int enrollmentId);
    }
}