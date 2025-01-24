using certificate_retrieval_be.Data;
using certificate_retrieval_be.Interfaces;
using certificate_retrieval_be.Models;
using certificate_retrieval_be.Models.Dto;
using certificate_retrieval_be.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace certificate_retrieval_be.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly ApiResponse _response;

        public UserController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
            _response = new ApiResponse();
        }

        [HttpGet]
        [Authorize(Roles = SD.Role_Staff)]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                _response.Result = await _userRepository.GetAll();
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add(ex.Message);
            }
            return Ok(_response);
        }

        [HttpGet("{userID}")]
        [Authorize]
        public async Task<IActionResult> GetUserById(int userID)
        {
            try
            {
                var user = await _userRepository.GetById(userID);
                if (user == null)
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add($"Không tìm thấy người dùng với mã số {userID}.");
                    return NotFound(_response);
                }

                _response.Result = user;
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add(ex.Message);
            }
            return Ok(_response);
        }

        [HttpGet("GetUsernameByUserId")]
        [Authorize(Roles = SD.Role_Staff)]
        public async Task<IActionResult> GetUsernameByUserId(int userId)
        {
            try
            {
                var username = await _userRepository.GetUsernameById(userId);
                if (username == null)
                {
                    return NotFound("Không tìm thấy người dùng với UserID đã cung cấp.");
                }
                return Ok(new { Username = username });
            }
            catch (Exception)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Có lỗi trong quá trình tìm kiếm");
                return BadRequest(_response);
            }
        }

        [HttpPost]
        [Authorize(Roles = SD.Role_Staff)]
        public async Task<IActionResult> Post([FromBody] UserCreateDTO model)
        {
            try
            {
                var newUser = await _userRepository.Create(model);
                _response.Result = newUser;
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add(ex.Message);
                return BadRequest(_response);
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = SD.Role_Staff)]
        public async Task<IActionResult> Update(int id, [FromBody] UserUpdateDTO userUpdateDTO)
        {
            try
            {
                var updatedUser = await _userRepository.Update(id, userUpdateDTO);
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
                _response.Result = updatedUser;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages = new List<string> { ex.Message };
                return StatusCode((int)HttpStatusCode.InternalServerError, _response);
            }
        }

        [HttpPut("self/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateSelf(int id, [FromBody] UserSelfUpdateDTO userSelfUpdateDTO)
        {
            try
            {
                var updatedUser = await _userRepository.UpdateSelf(userSelfUpdateDTO);
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
                _response.Result = updatedUser;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages = new List<string> { ex.Message };
                return StatusCode((int)HttpStatusCode.InternalServerError, _response);
            }
        }


        [HttpPut("resetpassword/{id}")]
        [Authorize(Roles = SD.Role_Staff)]
        public async Task<IActionResult> ResetPassword(int id)
        {
            try
            {
                var user = await _userRepository.GetById(id);
                if (user == null)
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add($"Không tìm thấy người dùng với mã số {id}.");
                    return NotFound(_response);
                }

                var result = await _userRepository.ResetPassword(id);
                if (!result)
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Người dùng không có thông tin ngày sinh để đặt lại mật khẩu.");
                    return NotFound(_response);
                }

                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
                _response.Result = "Mật khẩu đã được đặt lại thành công.";
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add(ex.Message);
                return StatusCode((int)HttpStatusCode.InternalServerError, _response);
            }
        }

        [HttpPut("changepassword/{id}")]
        [Authorize]
        public async Task<IActionResult> ChangePassword(int id, [FromBody] ChangePasswordDTO changePasswordDTO)
        {
            try
            {
                var result = await _userRepository.ChangePassword(id, changePasswordDTO);
                if (!result)
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add($"Người dùng với mã '{id}' không tồn tại.");
                    return NotFound(_response);
                }

                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
                _response.Result = "Mật khẩu đã được thay đổi thành công.";
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add(ex.Message);
                return StatusCode((int)HttpStatusCode.InternalServerError, _response);
            }
        }
    }
}
