using certificate_retrieval_be.Interfaces;
using certificate_retrieval_be.Models;
using certificate_retrieval_be.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace certificate_retrieval_be.Controllers
{
    [Route("api/exams")]
    [ApiController]
    public class ExamController : ControllerBase
    {
        private readonly IExamRepository _repository;
        private readonly ApiResponse _response;

        public ExamController(IExamRepository repository)
        {
            _repository = repository;
            _response = new ApiResponse();
        }


        [HttpGet]
        [Authorize(Roles = SD.Role_Staff)]
        public async Task<IActionResult> GetExams()
        {
            try
            {
                var exam = await _repository.GetAll();
                _response.Result = exam;
                _response.StatusCode = HttpStatusCode.OK;
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

        [HttpGet("{id}")]
        [Authorize(Roles = SD.Role_Staff)]
        public async Task<IActionResult> GetExam(int id)
        {
            try
            {
                var exam = await _repository.GetById(id);
                if (exam == null)
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Bài thi không tồn tại.");
                    return NotFound(_response);
                }

                _response.Result = exam;
                _response.StatusCode = HttpStatusCode.OK;
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

        [HttpPost]
        [Authorize(Roles = SD.Role_Staff)]
        public async Task<IActionResult> CreateExam([FromBody] Exams exam)
        {
            try
            {
                if (exam == null)
                {
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Dữ liệu không hợp lệ.");
                    return BadRequest(_response);
                }

                var createdExam = await _repository.CreateExam(exam);
                _response.Result = createdExam;
                _response.StatusCode = HttpStatusCode.Created;
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

        [HttpPut("{id}")]
        [Authorize(Roles = SD.Role_Staff)]
        public async Task<IActionResult> UpdateExam(int id, [FromBody] Exams exam)
        {
            try
            {
                if (exam == null || id != exam.ExamID)
                {
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("ID không hợp lệ.");
                    return BadRequest(_response);
                }

                var updatedExam = await _repository.UpdateExam(id, exam);
                if (updatedExam == null)
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Bài thi không tồn tại.");
                    return NotFound(_response);
                }

                _response.Result = updatedExam;
                _response.StatusCode = HttpStatusCode.OK;
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

        [HttpDelete("{id}")]
        [Authorize(Roles = SD.Role_Staff)]
        public async Task<IActionResult> DeleteExam(int id)
        {
            try
            {
                if (!await _repository.ExamExists(id))
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Bài thi không tồn tại.");
                    return NotFound(_response);
                }

                if (await _repository.HasLinkedExamResult(id))
                {
                    _response.StatusCode = HttpStatusCode.Conflict;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Không thể xóa kỳ thi vì có kết quả kỳ thi liên quan đến kỳ thi này.");
                    return Conflict(_response);
                }

                await _repository.DeleteExam(id);

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
