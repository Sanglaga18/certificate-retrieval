using certificate_retrieval_be.Interfaces;
using certificate_retrieval_be.Models;
using certificate_retrieval_be.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace certificate_retrieval_be.Controllers
{
    [Route("api/diploma-register")]
    [ApiController]
    public class DiplomaRegisterController : ControllerBase
    {
        private readonly IDiplomaRegisterRepository _repository;
        private readonly ApiResponse _response;

        public DiplomaRegisterController(IDiplomaRegisterRepository repository)
        {
            _repository = repository;
            _response = new ApiResponse();
        }

        // GET: api/diploma-register
        [HttpGet]
        [Authorize(Roles = SD.Role_Staff)]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var registers = await _repository.GetAll();
                _response.Result = registers;
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

        // GET: api/diploma-register/{id}
        [HttpGet("{id:int}")]
        [Authorize(Roles = SD.Role_Staff)]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var diplomaRegister = await _repository.GetById(id);
                if (diplomaRegister == null)
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Không tìm thấy sổ cấp chứng chỉ.");
                    return NotFound(_response);
                }

                _response.Result = diplomaRegister;
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

        // POST: api/diploma-register
        [HttpPost]
        [Authorize(Roles = SD.Role_Staff)]
        public async Task<IActionResult> Post([FromBody] DiplomaRegister model)
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

                var createdRegister = await _repository.CreateDiplomaRegister(model);
                _response.Result = createdRegister;
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

        // PUT: api/diploma-register/{id}
        [HttpPut("{id:int}")]
        [Authorize(Roles = SD.Role_Staff)]
        public async Task<IActionResult> Put(int id, [FromBody] DiplomaRegister model)
        {
            try
            {
                if (model == null || id != model.DiplomaRegisterID)
                {
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Dữ liệu không hợp lệ.");
                    return BadRequest(_response);
                }

                var updatedRegister = await _repository.UpdateDiplomaRegister(id, model);
                if (updatedRegister == null)
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Không tìm thấy sổ cấp chứng chỉ.");
                    return NotFound(_response);
                }

                _response.Result = updatedRegister;
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

        // DELETE: api/diploma-register/{id}
        [HttpDelete("{id:int}")]
        [Authorize(Roles = SD.Role_Staff)]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                if (!await _repository.DiplomaRegisterExists(id))
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Sổ cấp chứng chỉ không tồn tại.");
                    return NotFound(_response);
                }

                if (await _repository.HasLinkedDiploma(id))
                {
                    _response.StatusCode = HttpStatusCode.Conflict;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Không thể xóa sổ cấp chứng chỉ vì có chứng chỉ tồn tại trong sổ này.");
                    return Conflict(_response);
                }

                await _repository.DeleteDiplomaRegister(id);

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
