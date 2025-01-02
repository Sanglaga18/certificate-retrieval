using certificate_retrieval_be.Data;
using certificate_retrieval_be.Interfaces;
using certificate_retrieval_be.Models;
using certificate_retrieval_be.Models.Dto;
using certificate_retrieval_be.Services;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Text.RegularExpressions;

namespace certificate_retrieval_be.Repository
{
    public class DiplomaRepository : IDiplomaRepository
    {
        private readonly ApplicationDbContext _db;
        private readonly IBlobService _blobService;

        public DiplomaRepository(ApplicationDbContext db, IBlobService blobService)
        {
            _db = db;
            _blobService = blobService;
        }

        public async Task<IEnumerable<Diplomas>> GetAll(int? userID = null, string? searchString = null)
        {
            var user = await GetUserById(userID.GetValueOrDefault());
            // Khởi tạo truy vấn cơ bản với Include để kết hợp dữ liệu liên quan
            var query = _db.Diplomas
                .Include(c => c.ExamResult)
                .Include(c => c.DiplomaRegister)
                .AsQueryable();

            // Kiểm tra role
            if (user?.RoleID == 2) // Role Student
            {
                // Chỉ lấy chứng nhận thuộc StudentID của người dùng
                query = query.Where(c => c.ExamResult.StudentID == user.Username);
            }

            // Nếu có searchString, tìm kiếm theo các trường cần thiết
            if (!string.IsNullOrEmpty(searchString))
            {
                query = query.Where(c =>
                    c.DiplomaNumber.ToLower().Contains(searchString.ToLower()) ||
                    c.RegistryNumber.ToLower().Contains(searchString.ToLower()) ||
                    c.DiplomaName.ToLower().Contains(searchString.ToLower()));
            }

            // Thực thi truy vấn và trả về kết quả
            var diplomas = await query.ToListAsync();

            return diplomas;

        }

        public async Task<Diplomas> GetById(string diplomaNumber, int? userID = null)
        {
            var diploma = await _db.Diplomas
                .Include(d => d.DiplomaRegister)
                .Include(d => d.ExamResult)
                .FirstOrDefaultAsync(d => d.DiplomaNumber == diplomaNumber);
            return diploma;
        }

        public async Task<Diplomas> CreateDiploma(DiplomaCreateDTO model)
        {
            // Định nghĩa tên container dựa trên DiplomaID và RegistryNumber
            string containerName = SanitizeAzureName($"{model.DiplomaNumber}-{model.RegistryNumber}");

            // Tạo container mới nếu chưa tồn tại
            await _blobService.CreateContainerIfNotExists(containerName, "diploma");

            // Tên file
            string fileName = SanitizeAzureName($"{model.DiplomaNumber}-{model.RegistryNumber}") + Path.GetExtension(model.File.FileName);

            // Tải hình ảnh lên container
            string uploadedImageUrl = await _blobService.UploadBlob(fileName, containerName, model.File, "diploma");

            var newDiploma = new Diplomas
            {
                DiplomaNumber = model.DiplomaNumber,
                RegistryNumber = model.RegistryNumber,
                DiplomaRegisterID = model.DiplomaRegisterID,
                DiplomaName = model.DiplomaName,
                IssueDate = model.IssueDate,
                IsValid = model.IsValid,
                ExamResultID = model.ExamResultID,
                IssuingOrganization = model.IssuingOrganization,
                Image = uploadedImageUrl,
                Description = model.Description
            };

            await _db.Diplomas.AddAsync(newDiploma);
            await _db.SaveChangesAsync();

            return newDiploma;
        }

        public async Task<Diplomas> UpdateDiploma(string diplomaNumber, DiplomaUpdateDTO model)
        {
            var existingDiploma = await _db.Diplomas.FindAsync(diplomaNumber);
            if (existingDiploma == null) return null;
            // Cập nhật thông tin chứng chỉ
            existingDiploma.RegistryNumber = model.RegistryNumber;
            existingDiploma.DiplomaRegisterID = model.DiplomaRegisterID;
            existingDiploma.DiplomaName = model.DiplomaName;
            existingDiploma.IssueDate = model.IssueDate;
            existingDiploma.IsValid = model.IsValid;
            existingDiploma.IssuingOrganization = model.IssuingOrganization;
            existingDiploma.ExamResultID = model.ExamResultID;
            existingDiploma.Description = model.Description;
            if (model.File != null && model.File.Length > 0)
            {
                string containerName = SanitizeAzureName($"{model.DiplomaNumber}-{model.RegistryNumber}");
                string fileName = SanitizeAzureName($"{model.DiplomaNumber}-{model.RegistryNumber}") + Path.GetExtension(model.File.FileName);
                await _blobService.DeleteBlob(existingDiploma.Image.Split('/').Last(), containerName, "diploma");
                existingDiploma.Image = await _blobService.UploadBlob(fileName, containerName, model.File, "diploma");
            }

            // Lưu thay đổi vào cơ sở dữ liệu
            _db.Diplomas.Update(existingDiploma);
            await _db.SaveChangesAsync();

            return existingDiploma;
        }

        public async Task DeleteDiploma(string diplomaNumber)
        {
            var diploma = await _db.Diplomas.FindAsync(diplomaNumber);
            // Tạo tên container từ DiplomaNumber và RegistryNumber
            string containerName = SanitizeAzureName($"{diploma.DiplomaNumber}-{diploma.RegistryNumber}");

            // Xóa toàn bộ container (bao gồm tất cả file trong đó)
            await _blobService.DeleteContainer(containerName, "diploma");

            // Xóa chứng nhận khỏi database
            _db.Diplomas.Remove(diploma);
            await _db.SaveChangesAsync();
        }

        public async Task<Users> GetUserById(int userId)
        {
            return await _db.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserID == userId);
        }

        public async Task<bool> DiplomaExist(string id)
        {
            return await _db.Diplomas.AnyAsync(d => d.DiplomaNumber == id);
            
        }

        public async Task<bool> RegistryNumberExists(string registryNumber, string? excludeDiplomaId = null)
        {
            //Có 2 trường hợp:
            //  1: khi post thì kiểm tra trong csdl chỉ cần có 1 diploma có số vào số lưu giống thì là đúng
            //  2: khi put thì kiểm tra trong csdl chỉ cần có 1 diploma có số vào số lưu giống và nó phải là ở sổ khác thì là đúng
            return await _db.Diplomas.AnyAsync(r => 
            r.RegistryNumber == registryNumber && 
            (excludeDiplomaId == null || r.DiplomaNumber != excludeDiplomaId));
        }

        public async Task<bool> ExamResultExists(int? resultId)
        {
            return await _db.ExamResults.AnyAsync(er => er.ResultID == resultId);
        }

        public async Task<bool> DiplomaRegisterExists(int diplomaRegisterId)
        {
            return await _db.Diplomas.AnyAsync(dr => dr.DiplomaRegisterID == diplomaRegisterId);
        }

        // Hàm tiện ích để chuẩn hóa tên container và file
        private string SanitizeAzureName(string input)
        {
            // Loại bỏ ký tự không hợp lệ, chỉ giữ lại chữ thường, số và dấu '-'
            string sanitized = Regex.Replace(input, @"[^a-z0-9-]", "", RegexOptions.IgnoreCase);

            // Chuyển tất cả sang chữ thường
            sanitized = sanitized.ToLower();

            // Đảm bảo không có dấu '-' ở đầu hoặc cuối
            sanitized = sanitized.Trim('-');

            return sanitized;
        }
    }
}
