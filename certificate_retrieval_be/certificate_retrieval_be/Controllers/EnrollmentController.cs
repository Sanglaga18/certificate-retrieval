using certificate_retrieval_be.Models;
using certificate_retrieval_be.Models.Dto;
using certificate_retrieval_be.Repository.IRepository;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace certificate_retrieval_be.Controllers
{
    [Route("api/enrollment")]
    [ApiController]
    public class EnrollmentController : ControllerBase
    {
        private readonly IEnrollmentRepository _enrollmentRepository;
        private readonly ApiResponse _response;

        public EnrollmentController(IEnrollmentRepository enrollmentRepository)
        {
            _enrollmentRepository = enrollmentRepository;
            _response = new ApiResponse();
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            _response.Result = await _enrollmentRepository.GetAll();
            _response.StatusCode = HttpStatusCode.OK;
            _response.IsSuccess = true;
            return Ok(_response);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var enrollment = await _enrollmentRepository.GetById(id);
            if (enrollment == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Không tìm thấy thông tin đăng ký.");
                return NotFound(_response);
            }

            _response.Result = enrollment;
            _response.StatusCode = HttpStatusCode.OK;
            _response.IsSuccess = true;
            return Ok(_response);
        }

        [HttpGet("student-info/{enrollmentId:int}")]
        public async Task<IActionResult> GetStudentInfoByEnrollmentId(int enrollmentId)
        {
            // Lấy thông tin Enrollment
            var enrollment = await _enrollmentRepository.GetById(enrollmentId);

            if (enrollment == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Không tìm thấy thông tin đăng ký.");
                return NotFound(_response);
            }

            var studentInfo = await _enrollmentRepository.GetStudentInfoByEnrollmentId(enrollmentId);
            if (studentInfo == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Không tìm thấy thông tin học viên.");
                return NotFound(_response);
            }

            _response.Result = studentInfo;
            _response.StatusCode = HttpStatusCode.OK;
            _response.IsSuccess = true;
            return Ok(_response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateEnrollment([FromBody] EnrollmentsCreateDTO model)
        {
            if (model == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Dữ liệu không hợp lệ.");
                return BadRequest(_response);
            }

            if (!await _enrollmentRepository.StudentExists(model.StudentID))
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Mã học viên với ID '{model.StudentID}' không tồn tại.");
                return BadRequest(_response);
            }

            if (!await _enrollmentRepository.CourseExists(model.CourseID))
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Mã khóa học có ID '{model.CourseID}' không tồn tại.");
                return BadRequest(_response);
            }

            var newEnrollment = await _enrollmentRepository.CreateEnrollment(model);

            _response.Result = newEnrollment;
            _response.StatusCode = HttpStatusCode.Created;
            _response.IsSuccess = true;
            return CreatedAtAction(nameof(GetById), new { id = newEnrollment.EnrollmentID }, _response);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateEnrollment(int id, [FromBody] EnrollmentsUpdateDTO updateDto)
        {
            if (id != updateDto.EnrollmentID)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("ID không khớp với ID đăng ký cần cập nhật.");
                return BadRequest(_response);
            }

            if (!await _enrollmentRepository.EnrollmentExists(id))
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Không tìm thấy thông tin đăng ký.");
                return NotFound(_response);
            }

            if (!await _enrollmentRepository.StudentExists(updateDto.StudentID))
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Mã học viên với ID '{updateDto.StudentID}' không tồn tại.");
                return BadRequest(_response);
            }

            if (!await _enrollmentRepository.CourseExists(updateDto.CourseID))
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Mã khóa học có ID '{updateDto.CourseID}' không tồn tại.");
                return BadRequest(_response);
            }

            var enrollment = await _enrollmentRepository.UpdateEnrollment(id, updateDto);

            _response.StatusCode = HttpStatusCode.OK;
            _response.IsSuccess = true;
            _response.Result = enrollment;
            return Ok(_response);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteEnrollment(int id)
        {
            try
            {
                if (!await _enrollmentRepository.EnrollmentExists(id))
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Không tìm thấy thông tin đăng ký khóa học để xóa.");
                    return NotFound(_response);
                }

                if (await _enrollmentRepository.HasLinkedCertificates(id))
                {
                    _response.StatusCode = HttpStatusCode.Conflict;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Không thể xóa thông tin đăng ký vì có chứng nhận liên quan đến thông tin này.");
                    return Conflict(_response);
                }

                await _enrollmentRepository.DeleteEnrollment(id);

                _response.StatusCode = HttpStatusCode.NoContent;
                _response.IsSuccess = true;
                _response.Result = "Xóa thông tin đăng ký khóa học thành công.";
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