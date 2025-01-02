using certificate_retrieval_be.Controllers;
using certificate_retrieval_be.Models;
using Microsoft.AspNetCore.Mvc;

namespace certificate_retrieval_be.Interfaces
{
    public interface ICertificateRegisterRepository
    {
        Task<IEnumerable<CertificateRegister>> GetAll();
        Task<CertificateRegister> GetById(int id);
        Task<CertificateRegister> CreateCertificateRegister(CertificateRegister certificateRegister);
        Task<CertificateRegister> UpdateCertificateRegister(int id, CertificateRegister certificateRegister);
        Task DeleteCertificateRegister(int id);
        Task<bool> HasLinkedCertificates(int id);
        Task<bool> CertificateRegisterExists(int id);
    }
}
