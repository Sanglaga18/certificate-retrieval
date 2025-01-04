using certificate_retrieval_be.Interfaces;
using certificate_retrieval_be.Models;
using certificate_retrieval_be.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace certificate_retrieval_be.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly ICourseRepository _repository;
        private readonly ApiResponse _response;

        public CourseController(ICourseRepository repository)
        {
            _repository = repository;
            _response = new ApiResponse();
        }

        [HttpGet]
        [Authorize(Roles = SD.Role_Staff)]
        public async Task<IActionResult> GetCourses()
        {
            try
            {
                var course = await _repository.GetAll();
                _response.Result = course;
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
        public async Task<IActionResult> GetCourse(int id)
        {
            try
            {
                var course = await _repository.GetById(id);
                if (course == null)
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Khóa học không tồn tại.");
                    return NotFound(_response);
                }

                _response.Result = course;
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
        public async Task<IActionResult> AddCourse([FromBody] Courses course)
        {
            try
            {
                if (course == null)
                {
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Dữ liệu không hợp lệ.");
                    return BadRequest(_response);
                }

                var createdCourse = await _repository.CreateCourse(course);
                _response.Result = createdCourse;
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
        public async Task<IActionResult> UpdateCourse(int id, [FromBody] Courses course)
        {
            try
            {
                if (course == null || id != course.CourseID)
                {
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("ID không hợp lệ.");
                    return BadRequest(_response);
                }

                var updatedCourse = await _repository.UpdateCourse(id, course);
                if (updatedCourse == null)
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Khóa học không tồn tại.");
                    return NotFound(_response);
                }

                _response.Result = updatedCourse;
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
        public async Task<IActionResult> DeleteCourse(int id)
        {
            try
            {
                if (!await _repository.CourseExists(id))
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Khóa học không tồn tại.");
                    return NotFound(_response);
                }

                if (await _repository.HasLinkedEnrollment(id))
                {
                    _response.StatusCode = HttpStatusCode.Conflict;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Không thể xóa khóa học vì có thông tin đăng ký khóa học liên quan đến khóa học này.");
                    return Conflict(_response);
                }

                await _repository.DeleteCourse(id);

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
