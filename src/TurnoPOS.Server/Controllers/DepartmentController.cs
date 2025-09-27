using Microsoft.AspNetCore.Mvc;
using TurnoPOS.Service.Interfaces;
using TurnoPOS.Data.Models;

namespace TurnoPOS.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DepartmentController(IDepartmentService departmentService, ILogger<DepartmentController> logger) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IList<Department>>> GetAll()
        {
            var departments = await departmentService.GetAll();
            return Ok(departments);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Department>> GetById(long id)
        {
            var department = await departmentService.GetById(id);
            if (department == null)
                return NotFound();
            return Ok(department);
        }

        [HttpPost]
        public async Task<ActionResult<Department>> Create([FromBody] Department department)
        {
            var created = await departmentService.Create(department);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
    }
}