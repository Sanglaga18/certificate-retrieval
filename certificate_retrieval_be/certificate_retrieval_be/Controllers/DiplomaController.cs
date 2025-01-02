using certificate_retrieval_be.Interfaces;
using certificate_retrieval_be.Models;
using certificate_retrieval_be.Models.Dto;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace certificate_retrieval_be.Controllers
{
    [Route("api/diplomas")]
    [ApiController]
    public class DiplomaController : ControllerBase
    {
        private readonly IDiplomaRepository _diplomaRepository;
        private readonly ApiResponse _response;

        public DiplomaController(IDiplomaRepository diplomaRepository)
        {
            _diplomaRepository = diplomaRepository;
            _response = new ApiResponse();
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(int? userID = null, string? searchString = null)
        {
            try
            {
                // Lấy thông tin người dùng từ UserID
                var user = await _diplomaRepository.GetUserById(userID.GetValueOrDefault());
                if (userID.HasValue && user == null)
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Người dùng không tồn tại.");
                    return Ok(_response);
                }

                var diplomas = await _diplomaRepository.GetAll(userID, searchString);
                if (!diplomas.Any())
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Không tìm thấy chứng chỉ với thông tin trên.");
                }
                else
                {
                    _response.Result = diplomas;
                    _response.StatusCode = HttpStatusCode.OK;
                    _response.IsSuccess = true;
                }
            }
            catch (Exception ex)
            {
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add(ex.Message);
            }

            return Ok(_response);
        }

        [HttpGet("{diplomaNumber}")]
        public async Task<IActionResult> GetById(string diplomaNumber, int? userID = null)
        {
            try
            {
                diplomaNumber = Uri.UnescapeDataString(diplomaNumber);
                // Lấy thông tin người dùng từ userID (nếu có)
                var user = await _diplomaRepository.GetUserById(userID.GetValueOrDefault());
                if (userID.HasValue && user == null)
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Người dùng không tồn tại.");
                    return Ok(_response);
                }

                var diploma = await _diplomaRepository.GetById(diplomaNumber, userID.GetValueOrDefault());

                if (diploma == null)
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add($"Không tìm thấy chứng nhận với số hiệu {diplomaNumber}.");
                    return NotFound(_response);
                }

                // Nếu role là Student (RoleID = 2), kiểm tra quyền truy vấn
                if (user?.RoleID == 2)
                {
                    if (diploma.ExamResult.StudentID.ToLower() != user.Username.ToLower())
                    {
                        // Student không được truy vấn chứng nhận không thuộc về mình
                        _response.StatusCode = HttpStatusCode.Forbidden;
                        _response.IsSuccess = false;
                        _response.ErrorMessages.Add("Bạn không có quyền truy vấn chứng chỉ này.");
                        return Ok(_response);
                    }
                }

                _response.Result = diploma;
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add(ex.Message);
            }

            return Ok(_response);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromForm] DiplomaCreateDTO model)
        {
            try
            {
                if (model == null)
                {
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Dữ liệu không hợp lệ.");
                    return BadRequest(_response);
                }

                if (await _diplomaRepository.DiplomaExist(model.DiplomaNumber))
                {
                    _response.StatusCode = HttpStatusCode.Conflict;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add($"Đã tồn tại chứng chỉ với số hiệu: {model.DiplomaNumber}.");
                    return Conflict(_response);
                }

                // Kiểm tra RegistryNumber có tồn tại chưa
                if (await _diplomaRepository.RegistryNumberExists(model.RegistryNumber))
                {
                    _response.StatusCode = HttpStatusCode.Conflict;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add($"Đã tồn tại chứng chỉ với số vào sổ lưu: {model.RegistryNumber}.");
                    return Conflict(_response);
                }

                // Kiểm tra sự tồn tại của của ExamResultID
                if (!await _diplomaRepository.ExamResultExists(model.ExamResultID))
                {
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add($"Mã kết quả bài thi với ID '{model.ExamResultID}' không tồn tại.");
                    return BadRequest(_response);
                }

                // Kiểm tra sự tồn tại của của DiplomaRegisterID
                if (!await _diplomaRepository.DiplomaRegisterExists(model.DiplomaRegisterID))
                {
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add($"Mã sổ gốc cấp chứng chỉ với với ID '{model.DiplomaRegisterID}' không tồn tại.");
                    return BadRequest(_response);
                }

                var newDiploma = await _diplomaRepository.CreateDiploma(model);

                _response.StatusCode = HttpStatusCode.Created;
                _response.IsSuccess = true;
                _response.Result = newDiploma;
                return CreatedAtAction(nameof(GetById), new { diplomaNumber = newDiploma.DiplomaNumber }, _response);
            }
            catch (Exception ex)
            {
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add(ex.Message);
                return StatusCode((int)HttpStatusCode.InternalServerError, _response);
            }
        }

        [HttpPut("{diplomaNumber}")]
        public async Task<IActionResult> UpdateDiploma(string diplomaNumber, [FromForm] DiplomaUpdateDTO model)
        {
            diplomaNumber = Uri.UnescapeDataString(diplomaNumber);
            // Kiểm tra dữ liệu đầu vào
            if (diplomaNumber != model.DiplomaNumber)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Không thể thay đổi số hiệu chứng chỉ.");
                return BadRequest(_response);
            }

            // Tìm kiếm chứng chỉ trong cơ sở dữ liệu
            var existingDiploma = await _diplomaRepository.GetById(model.DiplomaNumber, null);
            if (existingDiploma == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Không tìm thấy chứng chỉ với số hiệu '{diplomaNumber}'.");
                return NotFound(_response);
            }

            if (model.RegistryNumber != existingDiploma.RegistryNumber)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Không thể thay đổi số vào sổ cấp chứng chỉ.");
                return BadRequest(_response);
            }

            // Kiểm tra RegistryNumber có tồn tại ở chứng chỉ khác chưa
            if (await _diplomaRepository.RegistryNumberExists(model.RegistryNumber, model.DiplomaNumber))
            {
                _response.StatusCode = HttpStatusCode.Conflict;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Đã tồn tại chứng nhận với số vào sổ lưu: {model.RegistryNumber}.");
                return Conflict(_response);
            }

            // Kiểm tra ExamResultID
            if (!await _diplomaRepository.ExamResultExists(model.ExamResultID))
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Mã kết quả bài thi với ID '{model.ExamResultID}' không tồn tại.");
                return BadRequest(_response);
            }

            // Kiểm tra DiplomaRegisterID
            if (!await _diplomaRepository.DiplomaRegisterExists(model.DiplomaRegisterID))
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Mã sổ gốc cấp chứng chỉ với ID '{model.DiplomaRegisterID}' không tồn tại.");
                return BadRequest(_response);
            }

            var updateDiploma = await _diplomaRepository.UpdateDiploma(diplomaNumber, model);

            // Trả về phản hồi thành công
            _response.StatusCode = HttpStatusCode.OK;
            _response.IsSuccess = true;
            _response.Result = updateDiploma;
            return Ok(_response);
        }


        [HttpDelete("{diplomaNumber}")]
        public async Task<IActionResult> DeleteDiploma(string diplomaNumber)
        {
            try
            {
                diplomaNumber = Uri.UnescapeDataString(diplomaNumber);

                // Kiểm tra nếu không tìm thấy Diploma
                if (await _diplomaRepository.DiplomaExist(diplomaNumber))
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add($"Chứng chỉ với số hiệu '{diplomaNumber}' không tồn tại.");
                    return NotFound(_response);
                }

                await _diplomaRepository.DeleteDiploma(diplomaNumber);

                _response.StatusCode = HttpStatusCode.NoContent;
                _response.IsSuccess = true;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages = new List<string> { ex.Message };
                return StatusCode((int)HttpStatusCode.InternalServerError, _response);
            }
        }


    }
}
