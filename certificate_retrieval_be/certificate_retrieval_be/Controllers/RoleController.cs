using certificate_retrieval_be.Data;
using certificate_retrieval_be.Models;
using certificate_retrieval_be.Models.Dto;
using certificate_retrieval_be.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace certificate_retrieval_be.Controllers
{
    [Route("api/roles")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private ApiResponse _response;
        public RoleController(ApplicationDbContext db)
        {
            _db = db;
            _response = new ApiResponse();
        }

        [HttpGet]
        [Authorize(Roles = SD.Role_Staff)]
        public async Task<IActionResult> GetRoles()
        {
            _response.Result = _db.Roles;
            _response.StatusCode = HttpStatusCode.OK;
            return Ok(_response);
        }

        [HttpGet("{id:int}", Name = "GetRole")]
        [Authorize(Roles = SD.Role_Staff)]
        public async Task<IActionResult> GetRole(int id)
        {
            if (id == 0)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                return BadRequest(_response);
            }
            Roles role = _db.Roles.FirstOrDefault(u => u.RoleID == id);
            if (role == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                return NotFound(_response);
            }
            _response.Result = role;
            _response.StatusCode = HttpStatusCode.OK;
            return Ok(_response);
        }

        [HttpPost]
        [Authorize(Roles = SD.Role_Staff)]
        public async Task<ActionResult<ApiResponse>> CreateRole([FromBody] RoleCreateDTO roleCreateDTO)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    Roles roleToCreate = new()
                    {
                        RoleName = roleCreateDTO.RoleName
                    };
                    _db.Roles.Add(roleToCreate);
                    _db.SaveChanges();
                    _response.Result = roleToCreate;
                    _response.StatusCode = HttpStatusCode.Created;
                    return CreatedAtRoute("GetRole", new { id = roleToCreate.RoleID }, _response);
                }
                else
                {
                    _response.IsSuccess = false;
                }
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages = new List<string>() { ex.ToString() };
            }
            return _response;
        }

        [HttpPut("{id:int}")]
        [Authorize(Roles = SD.Role_Staff)]
        public async Task<ActionResult<ApiResponse>> UpdateRole(int id, [FromBody] RoleUpdateDTO roleUpdateDTO)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (roleUpdateDTO == null || id != roleUpdateDTO.RoleID)
                    {
                        _response.StatusCode = HttpStatusCode.BadRequest;
                        _response.IsSuccess = false;
                        return BadRequest();
                    }

                    Roles roleFromDb = await _db.Roles.FindAsync(id);
                    if (roleFromDb == null)
                    {
                        _response.StatusCode = HttpStatusCode.BadRequest;
                        _response.IsSuccess = false;
                        return BadRequest();
                    }

                    roleFromDb.RoleName = roleUpdateDTO.RoleName;

                    
                    _db.Roles.Update(roleFromDb);
                    _db.SaveChanges();
                    _response.StatusCode = HttpStatusCode.NoContent;
                    return Ok(_response);
                }
                else
                {
                    _response.IsSuccess = false;
                }
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages
                     = new List<string>() { ex.ToString() };
            }
            return _response;
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = SD.Role_Staff)]
        public async Task<ActionResult<ApiResponse>> DeleteRole(int id)
        {
            try
            {
                if (id == 0)
                {
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.IsSuccess = false;
                    return BadRequest();
                }

                Roles roleFromDb = await _db.Roles.FindAsync(id);
                if (roleFromDb == null)
                {
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.IsSuccess = false;
                    return BadRequest();
                }

                int milliseconds = 2000;
                Thread.Sleep(milliseconds);


                _db.Roles.Remove(roleFromDb);
                _db.SaveChanges();
                _response.StatusCode = HttpStatusCode.NoContent;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages
                     = new List<string>() { ex.ToString() };
            }
            return _response;
        }
    }
}
