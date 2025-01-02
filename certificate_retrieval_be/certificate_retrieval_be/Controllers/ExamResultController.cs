using certificate_retrieval_be.Data;
using certificate_retrieval_be.Models;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Microsoft.EntityFrameworkCore;
using certificate_retrieval_be.Models.Dto;
using certificate_retrieval_be.Repository.IRepository;
using certificate_retrieval_be.Interfaces;
using certificate_retrieval_be.Repository;

namespace certificate_retrieval_be.Controllers
{
    [Route("api/exam-results")]
    [ApiController]
    public class ExamResultController : ControllerBase
    {
        private readonly IExamResultRepository _examResultRepository;
        private readonly ApiResponse _response;

        public ExamResultController(IExamResultRepository examResultRepository)
        {
            _examResultRepository = examResultRepository;
            _response = new ApiResponse();
        }

        // GET: api/exam-results
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            _response.Result = await _examResultRepository.GetAll();
            _response.StatusCode = HttpStatusCode.OK;
            _response.IsSuccess = true;
            return Ok(_response);
        }

        // GET: api/exam-results/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var examResult = await _examResultRepository.GetById(id);
            if (examResult == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Không tìm thấy thông tin đăng ký.");
                return NotFound(_response);
            }

            _response.Result = examResult;
            _response.StatusCode = HttpStatusCode.OK;
            _response.IsSuccess = true;
            return Ok(_response);
        }

        [HttpGet("student-info/{resultID:int}")]
        public async Task<IActionResult> GetStudentInfoByExamResultId(int resultID)
        {
            // Lấy thông tin ExamResult
            var examResult = await _examResultRepository.GetById(resultID);

            if (examResult == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Không tìm thấy kết quả kỳ thi.");
                return NotFound(_response);
            }

            var studentInfo = await _examResultRepository.GetStudentInfoByExamResultId(resultID);
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

        // POST: api/exam-results
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ExamResultsCreateDTO model)
        {
            if (model == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Dữ liệu không hợp lệ.");
                return BadRequest(_response);
            }

            if (!await _examResultRepository.StudentExists(model.StudentID))
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Mã học viên với ID '{model.StudentID}' không tồn tại.");
                return BadRequest(_response);
            }

            if (!await _examResultRepository.ExamExists(model.ExamID))
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Mã kỳ thi với ID '{model.ExamID}' không tồn tại.");
                return BadRequest(_response);
            }

            var newExamResult = await _examResultRepository.CreateExamResult(model);

            _response.Result = newExamResult;
            _response.StatusCode = HttpStatusCode.Created;
            _response.IsSuccess = true;
            return CreatedAtAction(nameof(GetById), new { id = newExamResult.ResultID }, _response);
        }


        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, [FromBody] ExamResultsUpdateDTO model)
        {
            if (id != model.ResultID)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Dữ liệu không hợp lệ.");
                return BadRequest(_response);
            }

            if (!await _examResultRepository.ExamResultExists(id))
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Không tìm thấy kết quả thi.");
                return NotFound(_response);
            }

            if (!await _examResultRepository.StudentExists(model.StudentID))
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Mã học viên với ID '{model.StudentID}' không tồn tại.");
                return BadRequest(_response);
            }

            if (!await _examResultRepository.ExamExists(model.ExamID))
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Mã kỳ thi với ID '{model.ExamID}' không tồn tại.");
                return BadRequest(_response);
            }

            var examResult = await _examResultRepository.UpdateExamResult(id, model);

            _response.StatusCode = HttpStatusCode.OK;
            _response.IsSuccess = true;
            _response.Result = examResult;
            return Ok(_response);
        }


        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                if (!await _examResultRepository.ExamResultExists(id))
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Không tìm thấy kết quả thi để xóa.");
                    return NotFound(_response);
                }

                if (await _examResultRepository.HasLinkedDiolomas(id))
                {
                    _response.StatusCode = HttpStatusCode.Conflict;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Không thể xóa kết quả kỳ thi vì có chứng chỉ liên quan đến kết quả này.");
                    return Conflict(_response);
                }

                await _examResultRepository.DeleteExamResult(id);
                _response.StatusCode = HttpStatusCode.NoContent;
                _response.IsSuccess = true;
                _response.Result = "Xóa kết quả kỳ thi thành công.";
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
