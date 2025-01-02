using certificate_retrieval_be.Models;
using certificate_retrieval_be.Models.Dto;
using Microsoft.AspNetCore.Mvc;

namespace certificate_retrieval_be.Interfaces
{
    public interface ICertificateRepository
    {
        Task<IEnumerable<Certificates>> GetAllCertificates(int? userID = null, string? searchString = null);
        Task<Certificates> GetCertificateById(string certificateID, int? userID = null);
        Task<Certificates> CreateCertificate(CertificatesDTO certificateDTO);
        Task<Certificates> UpdateCertificate(string id, CertificatesDTO certificateDTO);
        Task DeleteCertificate(string id);
        Task<bool> CertificateExists(string id);
        Task<bool> RegistryNumberExists(string registryNumber, string? excludeCertificateId = null);
        Task<bool> EnrollmentExists(int? enrollmentId);
        Task<bool> CertificateRegisterExists(int certificateRegisterId);
        Task<Users> GetUserById(int userId);
    }
}
