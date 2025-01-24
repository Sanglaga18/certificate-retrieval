using certificate_retrieval_be.Models.Dto;
using certificate_retrieval_be.Models;

namespace certificate_retrieval_be.Interfaces
{
    public interface IUserRepository
    {
        Task<IEnumerable<Users>> GetAll();
        Task<Users> GetById(int userId);
        Task<string> GetUsernameById(int userId);
        Task<Users> Create(UserCreateDTO userDto);
        Task<Users> Update(int id, UserUpdateDTO userDto);
        Task<bool> ResetPassword(int id);
        Task<bool> ChangePassword(int id, ChangePasswordDTO changePasswordDto);
        Task<Users> UpdateSelf(UserSelfUpdateDTO userDto);
    }
}
