using Microsoft.AspNetCore.Mvc;
using System.Net;
using certificate_retrieval_be.Models;
using certificate_retrieval_be.Models.Dto;
using certificate_retrieval_be.Interfaces;
using Microsoft.AspNetCore.Authorization;
using certificate_retrieval_be.Utility;

namespace certificate_retrieval_be.Controllers
{
    [Route("api/certificate")]
    [ApiController]
    public class CertificatesController : ControllerBase
    {
        private readonly ICertificateRepository _certificateRepository;
        private readonly ApiResponse _response;

        public CertificatesController(ICertificateRepository certificateRepository)
        {
            _certificateRepository = certificateRepository;
            _response = new ApiResponse();
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAllCertificates(int? userID = null, string? searchString = null)
        {
            try
            {
                // Lấy thông tin người dùng từ UserID
                var user = await _certificateRepository.GetUserById(userID.GetValueOrDefault());
                if (userID.HasValue && user == null)
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Người dùng không tồn tại.");
                    return Ok(_response);
                }

                // Thực thi truy vấn và trả về kết quả
                var certificates = await _certificateRepository.GetAllCertificates(userID, searchString);
                if (!certificates.Any())
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Không tìm thấy chứng nhận với thông tin trên.");
                }
                else
                {
                    _response.Result = certificates;
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

        [HttpGet("{certificateID}")]
        [Authorize]
        public async Task<IActionResult> GetCertificateById(string certificateID, int? userID = null)
        {
            try
            {
                // Giải mã URL nếu certificateID bị mã hóa
                certificateID = Uri.UnescapeDataString(certificateID);

                // Lấy thông tin người dùng từ userID (nếu có)
                var user = await _certificateRepository.GetUserById(userID.GetValueOrDefault());
                if (userID.HasValue && user == null)
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Người dùng không tồn tại.");
                    return Ok(_response);
                }


                var certificate = await _certificateRepository.GetCertificateById(certificateID, userID);

                if (certificate == null)
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add($"Không tìm thấy chứng nhận với số hiệu {certificateID}.");
                    return Ok(_response);
                }

                // Nếu role là Student (RoleID = 2), kiểm tra quyền truy vấn
                if (user?.RoleID == 2)
                {
                    if (certificate.Enrollment.StudentID.ToLower() != user.Username.ToLower())
                    {
                        // Student không được truy vấn chứng nhận không thuộc về mình
                        _response.StatusCode = HttpStatusCode.Forbidden;
                        _response.IsSuccess = false;
                        _response.ErrorMessages.Add("Bạn không có quyền truy vấn chứng nhận này.");
                        return Ok(_response);
                    }
                }

                // Trả về thông tin chứng nhận nếu hợp lệ
                _response.Result = certificate;
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

        [HttpPost]
        [Authorize(Roles = SD.Role_Staff)]
        public async Task<IActionResult> PostCertificate([FromForm] CertificatesDTO certificateDTO)
        {
            try
            {
                if (certificateDTO == null)
                {
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Dữ liệu không hợp lệ.");
                    return BadRequest(_response);
                }

                // Kiểm tra CertificateID có tồn tại chưa
                if (await _certificateRepository.CertificateExists(certificateDTO.CertificateID))
                {
                    _response.StatusCode = HttpStatusCode.Conflict;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add($"Đã tồn tại chứng nhận với số hiệu: {certificateDTO.CertificateID}.");
                    return Conflict(_response);
                }

                // Kiểm tra RegistryNumber có tồn tại chưa
                if (await _certificateRepository.RegistryNumberExists(certificateDTO.RegistryNumber))
                {
                    _response.StatusCode = HttpStatusCode.Conflict;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add($"Đã tồn tại chứng nhận với số vào sổ lưu: {certificateDTO.RegistryNumber}.");
                    return Conflict(_response);
                }

                // Kiểm tra sự tồn tại của EnrollmentID
                if (!await _certificateRepository.EnrollmentExists(certificateDTO.EnrollmentID))
                {
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add($"Mã đăng ký với ID '{certificateDTO.EnrollmentID}' không tồn tại.");
                    return BadRequest(_response);
                }

                // Kiểm tra sự tồn tại của của CertificateRegisterID
                if (!await _certificateRepository.CertificateRegisterExists(certificateDTO.CertificateRegisterID))
                {
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add($"Mã sổ gốc cấp chứng nhận với với ID '{certificateDTO.CertificateRegisterID}' không tồn tại.");
                    return BadRequest(_response);
                }

                var certificate = await _certificateRepository.CreateCertificate(certificateDTO);

                _response.StatusCode = HttpStatusCode.Created;
                _response.IsSuccess = true;
                _response.Result = certificate;
                return CreatedAtAction(nameof(GetCertificateById), new { certificateID = certificate.CertificateID }, _response);
            }
            catch (Exception ex)
            {
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add(ex.Message);
                return StatusCode((int)HttpStatusCode.InternalServerError, _response);
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = SD.Role_Staff)]
        public async Task<IActionResult> UpdateCertificate(string id, [FromForm] CertificatesDTO certificateDTO)
        {
            id = Uri.UnescapeDataString(id);
            // Kiểm tra ID từ endpoint với ID từ DTO có khớp không
            if (id != certificateDTO.CertificateID)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Không thể thay đổi số hiệu chứng nhận.");
                return BadRequest(_response);
            }

            // Kiểm tra Certificate có tồn tại không
            var existingCertificate = await _certificateRepository.GetCertificateById(id, null);
            if (existingCertificate == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Chứng nhận với số hiệu '{id}' không tồn tại.");
                return NotFound(_response);
            }

            if (certificateDTO.RegistryNumber != existingCertificate.RegistryNumber)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Không thể thay đổi số vào sổ cấp chứng nhận.");
                return BadRequest(_response);
            }

            // Kiểm tra RegistryNumber có tồn tại ở chứng nhận khác hay chưa
            if (await _certificateRepository.RegistryNumberExists(certificateDTO.RegistryNumber, id))
            {
                _response.StatusCode = HttpStatusCode.Conflict;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Đã tồn tại chứng nhận với số vào sổ lưu: {certificateDTO.RegistryNumber}.");
                return Conflict(_response);
            }

            // Kiểm tra EnrollmentID
            if (!await _certificateRepository.EnrollmentExists(certificateDTO.EnrollmentID))
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Mã đăng ký với ID '{certificateDTO.EnrollmentID}' không tồn tại.");
                return BadRequest(_response);
            }

            // Kiểm tra CertificateRegisterID
            if (!await _certificateRepository.CertificateRegisterExists(certificateDTO.CertificateRegisterID))
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Mã sổ gốc cấp chứng nhận với với ID '{certificateDTO.CertificateRegisterID}' không tồn tại.");
                return BadRequest(_response);
            }

           var updatedCertificate = await _certificateRepository.UpdateCertificate(id, certificateDTO);

            _response.StatusCode = HttpStatusCode.OK;
            _response.IsSuccess = true; 
            _response.Result = updatedCertificate;
            return Ok(_response);
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = SD.Role_Staff)]
        public async Task<ActionResult<ApiResponse>> DeleteCertificate(string id)
        {
            try
            {
                // Giải mã URL nếu certificateID bị mã hóa
                id = Uri.UnescapeDataString(id);

                //Kiểm tra chứng nhận có tồn tại
                if (!await _certificateRepository.CertificateExists(id))
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add($"Chứng nhận với số hiệu '{id}' không tồn tại.");
                    return NotFound(_response);
                }

                await _certificateRepository.DeleteCertificate(id);

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
