using certificate_retrieval_be.Models.Dto;
using certificate_retrieval_be.Models;

namespace certificate_retrieval_be.Interfaces
{
    public interface IAuthRepository
    {
        Task<LoginResponseDTO> Login(LoginRequestDTO model);
        Task<bool> Register(RegisterRequestDTO model);
        Task<bool> UserExists(string username);
        string GenerateJwtToken(Users user, string role);
    }
}
