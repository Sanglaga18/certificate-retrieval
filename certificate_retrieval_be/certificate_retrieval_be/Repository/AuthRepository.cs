using certificate_retrieval_be.Data;
using certificate_retrieval_be.Interfaces;
using certificate_retrieval_be.Models.Dto;
using certificate_retrieval_be.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace certificate_retrieval_be.Repository
{
    public class AuthRepository : IAuthRepository
    {
        private readonly ApplicationDbContext _db;
        private readonly string _secretKey;

        public AuthRepository(ApplicationDbContext db, IConfiguration configuration)
        {
            _db = db;
            _secretKey = configuration.GetValue<string>("ApiSettings:Secret");
        }

        public async Task<LoginResponseDTO> Login(LoginRequestDTO model)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u =>
                u.Username.ToLower() == model.Username.ToLower());

            if (user == null || !BCrypt.Net.BCrypt.Verify(model.Password, user.Password))
            {
                return null;
            }

            var role = await _db.Roles
                .Where(r => r.RoleID == user.RoleID)
                .Select(r => r.RoleName)
                .FirstOrDefaultAsync() ?? "User";

            var token = GenerateJwtToken(user, role);

            return new LoginResponseDTO
            {
                Email = user.Email,
                Token = token
            };
        }

        public async Task<bool> Register(RegisterRequestDTO model)
        {
            if (await UserExists(model.Username))
            {
                return false;
            }

            using var transaction = await _db.Database.BeginTransactionAsync();
            try
            {
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);

                var newUser = new Users
                {
                    Username = model.Username,
                    Password = hashedPassword,
                    FullName = model.FullName,
                    Email = model.Email,
                    Phone = model.Phone,
                    DateOfBirth = model.DateOfBirth,
                    RoleID = model.RoleID,
                    IsActive = model.IsActive,
                };

                _db.Users.Add(newUser);
                await _db.SaveChangesAsync();

                switch (model.RoleID)
                {
                    case 1: // Member
                        _db.Members.Add(new Members
                        {
                            MemberID = model.Username,
                            UserID = newUser.UserID,
                            RegistrationDate = DateTime.Now
                        });
                        break;
                    case 2: // Student
                        _db.Students.Add(new Students
                        {
                            StudentID = model.Username,
                            UserID = newUser.UserID
                        });
                        break;
                    case 3: // Teacher
                        _db.Teachers.Add(new Teachers
                        {
                            TeacherID = model.Username,
                            UserID = newUser.UserID,
                            HireDate = DateTime.Now
                        });
                        break;
                    case 4: // Staff
                        _db.Staffs.Add(new Staffs
                        {
                            StaffID = model.Username,
                            UserID = newUser.UserID
                        });
                        break;
                    default:
                        throw new ArgumentException("Invalid Role ID");
                }

                await _db.SaveChangesAsync();
                await transaction.CommitAsync();
                return true;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> UserExists(string username)
        {
            return await _db.Users.AnyAsync(u => u.Username.ToLower() == username.ToLower());
        }

        public string GenerateJwtToken(Users user, string role)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var secretKey = Environment.GetEnvironmentVariable("API_SECRET");
            var key = Encoding.ASCII.GetBytes(secretKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim("fullName", user.FullName ?? ""),
                    new Claim("id", user.UserID.ToString()),
                    new Claim(ClaimTypes.Email, user.Email ?? ""),
                    new Claim(ClaimTypes.Role, role),
                    new Claim("isActive", user.IsActive ? "true" : "false")
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
