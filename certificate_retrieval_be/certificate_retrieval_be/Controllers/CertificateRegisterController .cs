using certificate_retrieval_be.Data;
using certificate_retrieval_be.Interfaces;
using certificate_retrieval_be.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace certificate_retrieval_be.Controllers
{
    [Route("api/certificate-register")]
    [ApiController]
    public class CertificateRegisterController : ControllerBase
    {
        private readonly ICertificateRegisterRepository _repository;
        private readonly ApiResponse _response;

        public CertificateRegisterController(ICertificateRegisterRepository repository)
        {
            _repository = repository;
            _response = new ApiResponse();
        }

        // GET: api/certificate-register
        [HttpGet]
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

        // GET: api/certificate-register/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var certificateRegister = await _repository.GetById(id);
                if (certificateRegister == null)
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Không tìm thấy sổ cấp chứng nhận.");
                    return NotFound(_response);
                }

                _response.Result = certificateRegister;
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

        // POST: api/certificate-register
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CertificateRegister model)
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

                var createdRegister = await _repository.CreateCertificateRegister(model);
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

        // PUT: api/certificate-register/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, [FromBody] CertificateRegister model)
        {
            try
            {
                if (model == null || id != model.CertificateRegisterID)
                {
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Dữ liệu không hợp lệ.");
                    return BadRequest(_response);
                }

                var updatedRegister = await _repository.UpdateCertificateRegister(id, model);
                if (updatedRegister == null)
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Không tìm thấy sổ cấp chứng nhận.");
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

        // DELETE: api/certificate-register/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                if (!await _repository.CertificateRegisterExists(id))
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Sổ cấp chứng nhận không tồn tại.");
                    return NotFound(_response);
                }

                if (await _repository.HasLinkedCertificates(id))
                {
                    _response.StatusCode = HttpStatusCode.Conflict;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Không thể xóa sổ cấp chứng nhận vì có chứng nhận tồn tại trong sổ này.");
                    return Conflict(_response);
                }

                await _repository.DeleteCertificateRegister(id);

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
