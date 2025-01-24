using certificate_retrieval_be.Data;
using certificate_retrieval_be.Interfaces;
using certificate_retrieval_be.Models.Dto;
using certificate_retrieval_be.Models;
using Microsoft.EntityFrameworkCore;

namespace certificate_retrieval_be.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _db;

        public UserRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<Users>> GetAll()
        {
            return await _db.Users.Include(c => c.Role).ToListAsync();
        }

        public async Task<Users> GetById(int userId)
        {
            return await _db.Users
                .Include(c => c.Role)
                .FirstOrDefaultAsync(c => c.UserID == userId);
        }

        public async Task<string> GetUsernameById(int userId)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.UserID == userId);
            return user?.Username;
        }

        public async Task<Users> Create(UserCreateDTO userDto)
        {
            var userExists = await _db.Users.FirstOrDefaultAsync(u =>
                u.Username.ToLower() == userDto.Username.ToLower());
            if (userExists != null)
            {
                throw new Exception("Tên người dùng đã tồn tại");
            }

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
            var newUser = new Users
            {
                Username = userDto.Username,
                Password = hashedPassword,
                FullName = userDto.FullName,
                Email = userDto.Email,
                Phone = userDto.Phone,
                DateOfBirth = userDto.DateOfBirth,
                RoleID = userDto.RoleID,
                IsActive = userDto.IsActive,
            };

            await _db.Users.AddAsync(newUser);
            await _db.SaveChangesAsync();

            await CreateUserRoleEntity(newUser, userDto.RoleID);
            await _db.SaveChangesAsync();

            return newUser;
        }

        public async Task<Users> Update(int id, UserUpdateDTO userDto)
        {
            if (id != userDto.UserID)
            {
                throw new Exception("Không thể thay đổi mã người dùng.");
            }

            var existingUser = await _db.Users.FindAsync(id);
            if (existingUser == null)
            {
                throw new Exception($"Người dùng với mã '{id}' không tồn tại.");
            }

            existingUser.FullName = userDto.FullName;
            existingUser.Email = userDto.Email;
            existingUser.Phone = userDto.Phone;
            existingUser.DateOfBirth = userDto.DateOfBirth;
            existingUser.IsActive = userDto.IsActive;

            _db.Users.Update(existingUser);
            await _db.SaveChangesAsync();

            return existingUser;
        }

        public async Task<Users> UpdateSelf(UserSelfUpdateDTO userDto)
        {
            var existingUser = await _db.Users.FindAsync(userDto.UserID);
            if (existingUser == null)
            {
                throw new Exception($"Người dùng với mã '{userDto.UserID}' không tồn tại.");
            }

            // Cập nhật thông tin
            existingUser.FullName = userDto.FullName;
            existingUser.Email = userDto.Email;
            existingUser.Phone = userDto.Phone;
            existingUser.DateOfBirth = userDto.DateOfBirth;

            _db.Users.Update(existingUser);
            await _db.SaveChangesAsync();

            return existingUser;
        }


        public async Task<bool> ResetPassword(int id)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.UserID == id);
            if (user.DateOfBirth == null)
            {
                return false;
            }

            string newPassword = user.DateOfBirth.ToString("dd/MM/yyyy");
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(newPassword);

            user.Password = hashedPassword;
            _db.Users.Update(user);
            await _db.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ChangePassword(int id, ChangePasswordDTO changePasswordDto)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null)
            {
                return false;
            }

            bool isOldPasswordValid = BCrypt.Net.BCrypt.Verify(
                changePasswordDto.OldPassword, user.Password);
            if (!isOldPasswordValid)
            {
                throw new Exception("Mật khẩu cũ không chính xác.");
            }

            string hashedNewPassword = BCrypt.Net.BCrypt.HashPassword(
                changePasswordDto.NewPassword);
            user.Password = hashedNewPassword;

            _db.Users.Update(user);
            await _db.SaveChangesAsync();

            return true;
        }

        private async Task CreateUserRoleEntity(Users user, int roleId)
        {
            switch (roleId)
            {
                case 1:
                    await _db.Members.AddAsync(new Members
                    {
                        MemberID = user.Username,
                        UserID = user.UserID,
                        RegistrationDate = DateTime.Now
                    });
                    break;
                case 2:
                    await _db.Students.AddAsync(new Students
                    {
                        StudentID = user.Username,
                        UserID = user.UserID
                    });
                    break;
                case 3:
                    await _db.Teachers.AddAsync(new Teachers
                    {
                        TeacherID = user.Username,
                        UserID = user.UserID,
                        HireDate = DateTime.Now
                    });
                    break;
                case 4:
                    await _db.Staffs.AddAsync(new Staffs
                    {
                        StaffID = user.Username,
                        UserID = user.UserID
                    });
                    break;
                default:
                    throw new Exception("Mã Role không hợp lệ");
            }
        }
    }
}
