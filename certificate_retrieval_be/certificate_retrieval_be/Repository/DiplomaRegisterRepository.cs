using certificate_retrieval_be.Data;
using certificate_retrieval_be.Interfaces;
using certificate_retrieval_be.Models;
using Microsoft.EntityFrameworkCore;

namespace certificate_retrieval_be.Repository
{
    public class DiplomaRegisterRepository : IDiplomaRegisterRepository
    {
        private readonly ApplicationDbContext _db;

        public DiplomaRegisterRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<DiplomaRegister>> GetAll()
        {
            return await _db.DiplomaRegisters.ToListAsync();
        }

        public async Task<DiplomaRegister> GetById(int id)
        {
            return await _db.DiplomaRegisters.FirstOrDefaultAsync(c => c.DiplomaRegisterID == id);
        }

        public async Task<DiplomaRegister> CreateDiplomaRegister(DiplomaRegister diplomaRegister)
        {
            await _db.DiplomaRegisters.AddAsync(diplomaRegister);
            await _db.SaveChangesAsync();
            return diplomaRegister;
        }

        public async Task<DiplomaRegister> UpdateDiplomaRegister(int id, DiplomaRegister diplomaRegister)
        {
            var existingRegister = await _db.DiplomaRegisters.FirstOrDefaultAsync(d => d.DiplomaRegisterID == id);
            if (existingRegister == null)
                return null;

            existingRegister.RegisterName = diplomaRegister.RegisterName;
            existingRegister.IssuingInstitution = diplomaRegister.IssuingInstitution;
            existingRegister.TrainingProgram = diplomaRegister.TrainingProgram;
            existingRegister.TrainingDuration = diplomaRegister.TrainingDuration;
            existingRegister.ExamBoard = diplomaRegister.ExamBoard;

            _db.DiplomaRegisters.Update(existingRegister);
            await _db.SaveChangesAsync();

            return existingRegister;
        }

        public async Task DeleteDiplomaRegister(int id)
        {
            var diplomaRegister = await _db.DiplomaRegisters.FirstOrDefaultAsync(d => d.DiplomaRegisterID == id);
            if (diplomaRegister != null)
            {
                _db.DiplomaRegisters.Remove(diplomaRegister);
                await _db.SaveChangesAsync();
            }
        }

        public async Task<bool> HasLinkedDiploma(int id)
        {
            return await _db.Diplomas.AnyAsync(d => d.DiplomaRegisterID == id);
        }

        public async Task<bool> DiplomaRegisterExists(int id)
        {
            return await _db.DiplomaRegisters.AnyAsync(c => c.DiplomaRegisterID == id);
        }
    }
}
