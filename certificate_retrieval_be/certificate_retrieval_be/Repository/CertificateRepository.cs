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
    public class CertificateRepository : ICertificateRepository
    {
        private readonly ApplicationDbContext _db;
        private readonly IBlobService _blobService;

        public CertificateRepository(ApplicationDbContext db, IBlobService blobService)
        {
            _db = db;
            _blobService = blobService;
        }

        public async Task<IEnumerable<Certificates>> GetAllCertificates(int? userID = null, string? searchString = null)
        {
            var user = await GetUserById(userID.GetValueOrDefault());
            var query = _db.Certificates
                    .Include(c => c.Enrollment)
                    .Include(c => c.CertificateRegister)
                    .AsQueryable();

            // Kiểm tra role
            if (user?.RoleID == 2) // Role Student
            {
                // Chỉ lấy chứng nhận thuộc StudentID của người dùng
                query = query.Where(c => c.Enrollment.StudentID == user.Username);
            }

            // Nếu có searchString, tìm kiếm theo các trường cần thiết
            if (!string.IsNullOrEmpty(searchString))
            {
                query = query.Where(c =>
                    c.CertificateID.ToLower().Contains(searchString.ToLower()) ||
                    c.RegistryNumber.ToLower().Contains(searchString.ToLower()) ||
                    c.CertificateName.ToLower().Contains(searchString.ToLower()));
            }

            // Thực thi truy vấn và trả về kết quả
            return await query.ToListAsync();

        }

        public async Task<Certificates> GetCertificateById(string certificateID, int? userID = null)
        {
            var user = await GetUserById(userID.GetValueOrDefault());

            // Lấy thông tin chứng nhận dựa trên certificateID
            var certificate = await _db.Certificates
                .Include(c => c.Enrollment)
                .Include(c => c.CertificateRegister)
                .FirstOrDefaultAsync(c => c.CertificateID == certificateID);
                       
            return certificate;
        }

        public async Task<Certificates> CreateCertificate(CertificatesDTO certificateDTO)
        {
            // Định nghĩa tên container dựa trên CertificateID và RegistryNumber
            string containerName = SanitizeAzureName($"{certificateDTO.CertificateID}-{certificateDTO.RegistryNumber}");

            // Tạo container mới nếu chưa tồn tại
            await _blobService.CreateContainerIfNotExists(containerName, "certificate");

            // Tên file
            string fileName = SanitizeAzureName($"{certificateDTO.CertificateID}-{certificateDTO.RegistryNumber}") + Path.GetExtension(certificateDTO.File.FileName);

            // Tải hình ảnh lên container
            string uploadedImageUrl = await _blobService.UploadBlob(fileName, containerName, certificateDTO.File, "certificate");

            // Tạo đối tượng Certificate từ DTO
            var certificate = new Certificates
            {
                CertificateID = certificateDTO.CertificateID,
                RegistryNumber = certificateDTO.RegistryNumber,
                CertificateRegisterID = certificateDTO.CertificateRegisterID,
                CertificateName = certificateDTO.CertificateName,
                IssueDate = certificateDTO.IssueDate,
                IsValid = certificateDTO.IsValid,
                IssuingOrganization = certificateDTO.IssuingOrganization,
                EnrollmentID = certificateDTO.EnrollmentID,
                Image = uploadedImageUrl,
                Description = certificateDTO.Description
            };

            await _db.Certificates.AddAsync(certificate);
            await _db.SaveChangesAsync();

            return certificate;
        }

        public async Task<Certificates> UpdateCertificate(string id, CertificatesDTO certificateDTO)
        {
            var existingCertificate = await _db.Certificates.FindAsync(id);
            if (existingCertificate == null)
                return null;

            // Cập nhật certificate với các giá trị mới
            existingCertificate.RegistryNumber = certificateDTO.RegistryNumber;
            existingCertificate.CertificateRegisterID = certificateDTO.CertificateRegisterID;
            existingCertificate.CertificateName = certificateDTO.CertificateName;
            existingCertificate.IssueDate = certificateDTO.IssueDate;
            existingCertificate.IsValid = certificateDTO.IsValid;
            existingCertificate.IssuingOrganization = certificateDTO.IssuingOrganization;
            existingCertificate.EnrollmentID = certificateDTO.EnrollmentID;
            existingCertificate.Description = certificateDTO.Description;
            if (certificateDTO.File != null && certificateDTO.File.Length > 0)
            {
                string containerName = SanitizeAzureName($"{certificateDTO.CertificateID}-{certificateDTO.RegistryNumber}");
                string fileName = SanitizeAzureName($"{certificateDTO.CertificateID}-{certificateDTO.RegistryNumber}") + Path.GetExtension(certificateDTO.File.FileName);
                await _blobService.DeleteBlob(existingCertificate.Image.Split('/').Last(), containerName, "certificate");
                existingCertificate.Image = await _blobService.UploadBlob(fileName, containerName, certificateDTO.File, "certificate");
            }

            _db.Certificates.Update(existingCertificate);
            await _db.SaveChangesAsync();

            return existingCertificate;
        }

        public async Task DeleteCertificate(string id)
        {
            var certificate = await _db.Certificates.FindAsync(id);
            if (certificate != null)
            {
                string containerName = SanitizeAzureName($"{certificate.CertificateID}-{certificate.RegistryNumber}");
                await _blobService.DeleteContainer(containerName, "certificate");

                _db.Certificates.Remove(certificate);
                await _db.SaveChangesAsync();
            }
        }
        public async Task<bool> CertificateExists(string id)
        {
            return await _db.Certificates.AnyAsync(c => c.CertificateID == id);
        }

        public async Task<Users> GetUserById(int userId)
        {
            return await _db.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserID == userId);
        }
        
        public async Task<bool> CertificateExits(string id)
        {
            return await _db.Certificates.AnyAsync(c => c.CertificateID == id);
        }

        public async Task<bool> RegistryNumberExists(string registryNumber, string? excludeCertificateId = null)
        {
            return await _db.Certificates.AnyAsync(c =>
                c.RegistryNumber == registryNumber &&
                (excludeCertificateId == null || c.CertificateID != excludeCertificateId));
        }

        public async Task<bool> EnrollmentExists(int? enrollmentId)
        {
            return await _db.Enrollments.AnyAsync(e => e.EnrollmentID == enrollmentId);
        }

        public async Task<bool> CertificateRegisterExists(int certificateRegisterId)
        {
            return await _db.CertificateRegisters.AnyAsync(cr => cr.CertificateRegisterID == certificateRegisterId);
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
