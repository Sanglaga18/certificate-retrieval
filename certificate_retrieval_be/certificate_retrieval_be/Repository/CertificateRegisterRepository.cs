using certificate_retrieval_be.Controllers;
using certificate_retrieval_be.Data;
using certificate_retrieval_be.Interfaces;
using certificate_retrieval_be.Models;
using Microsoft.EntityFrameworkCore;

namespace certificate_retrieval_be.Repository
{
    public class CertificateRegisterRepository : ICertificateRegisterRepository
    {
        private readonly ApplicationDbContext _db;

        public CertificateRegisterRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<CertificateRegister>> GetAll()
        {
            return await _db.CertificateRegisters.ToListAsync();
        }

        public async Task<CertificateRegister> GetById(int id)
        {
            return await _db.CertificateRegisters.FirstOrDefaultAsync(c => c.CertificateRegisterID == id);
        }

        public async Task<CertificateRegister> CreateCertificateRegister(CertificateRegister certificateRegister)
        {
            await _db.CertificateRegisters.AddAsync(certificateRegister);
            await _db.SaveChangesAsync();
            return certificateRegister;
        }

        public async Task<CertificateRegister> UpdateCertificateRegister(int id, CertificateRegister certificateRegister)
        {
            var existingRegister = await _db.CertificateRegisters.FirstOrDefaultAsync(c => c.CertificateRegisterID == id);
            if (existingRegister == null)
                return null;

            existingRegister.RegisterName = certificateRegister.RegisterName;
            existingRegister.IssuingInstitution = certificateRegister.IssuingInstitution;
            existingRegister.TrainingProgram = certificateRegister.TrainingProgram;
            existingRegister.TrainingDuration = certificateRegister.TrainingDuration;
            existingRegister.ExamBoard = certificateRegister.ExamBoard;

            _db.CertificateRegisters.Update(existingRegister);
            await _db.SaveChangesAsync();

            return existingRegister;
        }

        public async Task DeleteCertificateRegister(int id)
        {
            var certificateRegister = await _db.CertificateRegisters.FirstOrDefaultAsync(c => c.CertificateRegisterID == id);
            if (certificateRegister != null)
            {
                _db.CertificateRegisters.Remove(certificateRegister);
                await _db.SaveChangesAsync();
            }
        }

        public async Task<bool> HasLinkedCertificates(int id)
        {
            return await _db.Certificates.AnyAsync(d => d.CertificateRegisterID == id);
        }

        public async Task<bool> CertificateRegisterExists(int id)
        {
            return await _db.CertificateRegisters.AnyAsync(c => c.CertificateRegisterID == id);
        }


    }
}
