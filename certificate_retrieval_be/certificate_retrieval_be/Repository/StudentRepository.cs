using certificate_retrieval_be.Data;
using certificate_retrieval_be.Interfaces;
using certificate_retrieval_be.Models.Dto;
using certificate_retrieval_be.Models;
using certificate_retrieval_be.Services;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace certificate_retrieval_be.Repository
{
    public class StudentRepository : IStudentRepository
    {
        private readonly ApplicationDbContext _db;
        private readonly IBlobService _blobService;

        public StudentRepository(ApplicationDbContext db, IBlobService blobService)
        {
            _db = db;
            _blobService = blobService;
        }

        public async Task<IEnumerable<Students>> GetAll()
        {
            return await _db.Students
                .Include(c => c.User)
                .ToListAsync();
        }

        public async Task<Students> GetById(string studentId)
        {
            return await _db.Students
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.StudentID == studentId);
        }

        public async Task<bool> StudentExists(string studentId)
        {
            return await _db.Students.AnyAsync(s => s.StudentID == studentId);
        }

        public async Task<Students> Update(string studentId, StudentsUpdateDTO updateDto)
        {
            var student = await _db.Students.FindAsync(studentId);
            if (student == null)
                return null;

            // Định nghĩa tên container dựa trên StudentID
            string containerName = SanitizeAzureName(studentId);

            // Cập nhật Student Image với các giá trị mới
            if (updateDto.Image != null && updateDto.Image.Length > 0)
            {
                student.Image = await UploadStudentImage(studentId, updateDto.Image);
            }

            // Cập nhật CCCD mặt trước của Student với các giá trị mới
            if (updateDto.FrontIdCard != null && updateDto.FrontIdCard.Length > 0)
            {
                student.FrontIdCard = await UploadIdCardImage(studentId, updateDto.FrontIdCard, true);
            }

            // Cập nhật CCCD mặt sau của Student với các giá trị mới
            if (updateDto.BackIdCard != null && updateDto.BackIdCard.Length > 0)
            {
                student.BackIdCard = await UploadIdCardImage(studentId, updateDto.BackIdCard, false);
            }

            _db.Students.Update(student);
            await _db.SaveChangesAsync();

            return student;
        }

        public async Task<string> UploadStudentImage(string studentId, IFormFile image)
        {
            // Định nghĩa tên container dựa trên StudentID
            string containerName = SanitizeAzureName(studentId);

            // Tạo container mới nếu chưa tồn tại
            await _blobService.CreateContainerIfNotExists(containerName, "studentImage");

            // Đặt tên fileName với cấu trúc Mã học viên + định dạng file vd: 4701104001.jpg
            string fileName = SanitizeAzureName(studentId) + Path.GetExtension(image.FileName);

            // Tìm học viên trong csdl
            var student = await _db.Students.FindAsync(studentId);

            // Nếu học viên đã có ảnh cũ thì xóa ảnh cũ đó để thêm ảnh mới
            if (student?.Image != null && student.Image.Length > 0)
            {
                //Xóa ảnh học viên trong store account trên azure
                await DeleteImage(student.Image, containerName, "studentImage");
            }

            //Gửi ảnh lên store account trên Azure
            return await _blobService.UploadBlob(fileName, containerName, image, "studentImage");
        }

        public async Task<string> UploadIdCardImage(string studentId, IFormFile image, bool isFrontSide)
        {
            // Định nghĩa tên container dựa trên StudentID
            string containerName = SanitizeAzureName(studentId);

            // Tạo container mới nếu chưa tồn tại
            await _blobService.CreateContainerIfNotExists(containerName, "idCard");

            string suffix = isFrontSide ? "-CCCDTruoc" : "-CCCDSau";

            // Đặt tên fileName với cấu trúc Mã học viên + mặt của cccd + định dạng file
            string fileName = SanitizeAzureName(studentId) + suffix + Path.GetExtension(image.FileName);

            // Tìm học viên trong csdl
            var student = await _db.Students.FindAsync(studentId);

            // Lấy tên file cccd theo mặt cccd
            string currentImage = isFrontSide ? student?.FrontIdCard : student?.BackIdCard;

            // Nếu học viên đã có ảnh cccd cũ thì xóa ảnh cũ đó để thêm ảnh mới
            if (currentImage != null && currentImage.Length > 0)
            {
                //Xóa ảnh cccd của học viên trong store account trên azure
                await DeleteImage(currentImage, containerName, "idCard");
            }

            return await _blobService.UploadBlob(fileName, containerName, image, "idCard");
        }

        public async Task DeleteImage(string imageUrl, string containerName, string imageType)
        {
            string fileName = imageUrl.Split('/').Last();

            //Xóa Blod ảnh có tên là "fileName", trong container "containerName" và trong store account "imageType"
            await _blobService.DeleteBlob(fileName, containerName, imageType);
        }

        private string SanitizeAzureName(string input)
        {
            string sanitized = Regex.Replace(input, @"[^a-z0-9-]", "", RegexOptions.IgnoreCase);
            sanitized = sanitized.ToLower();
            sanitized = sanitized.Trim('-');
            return sanitized;
        }
    }
}
