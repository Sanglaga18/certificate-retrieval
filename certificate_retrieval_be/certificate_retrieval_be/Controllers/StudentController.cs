using certificate_retrieval_be.Interfaces;
using certificate_retrieval_be.Models;
using certificate_retrieval_be.Models.Dto;
using certificate_retrieval_be.Repository.IRepository;
using certificate_retrieval_be.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace certificate_retrieval_be.Controllers
{
    [Route("api/students")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly IStudentRepository _studentRepository;
        private readonly ApiResponse _response;

        public StudentController(IStudentRepository studentRepository)
        {
            _studentRepository = studentRepository;
            _response = new ApiResponse();
        }

        [HttpGet]
        [Authorize(Roles = SD.Role_Staff)]
        public async Task<IActionResult> GetAllStudents()
        {
            try
            {
                _response.Result = await _studentRepository.GetAll();
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

        [HttpGet("{studentID}")]
        [Authorize(Roles = SD.Role_Staff)]
        public async Task<IActionResult> GetStudentById(string studentID)
        {
            try
            {
                var student = await _studentRepository.GetById(studentID);

                if (student == null)
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add($"Không tìm thấy học viên với mã số {studentID}.");
                    return NotFound(_response);
                }

                _response.Result = student;
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

        [HttpPut("{id}")]
        [Authorize(Roles = SD.Role_Staff)]
        public async Task<IActionResult> UpdateStudent(string id, [FromForm] StudentsUpdateDTO studentUpdateDTO)
        {
            if (id != studentUpdateDTO.StudentID)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Dữ liệu không hợp lệ hoặc không khớp mã sinh viên.");
                return BadRequest(_response);
            }

            if (!await _studentRepository.StudentExists(id))
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add($"Học viên với mã '{id}' không tồn tại.");
                return NotFound(_response);
            }

            try
            {
                var updatedStudent = await _studentRepository.Update(id, studentUpdateDTO);
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
                _response.Result = updatedStudent;
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