using Microsoft.AspNetCore.Mvc;
using TurnoPOS.Data.Models;
using TurnoPOS.Service.Interfaces;

namespace TurnoPOS.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DepartmentController(IDepartmentService departmentService, ILogger<DepartmentController> logger) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IList<Department>>> GetAll()
        {
            var entities = await departmentService.GetAll();
            return Ok(entities);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Department>> GetById(long id)
        {
            var entity = await departmentService.GetById(id);
            if (entity == null)
                return NotFound();
            return Ok(entity);
        }

        [HttpPost]
        public async Task<ActionResult<Department>> Create([FromBody] Department entity)
        {
            var created = await departmentService.Create(entity);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] Department entity)
        {
            if (entity.Id == 0)
                return BadRequest();
            try
            {
                await departmentService.Update(entity);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                logger.LogWarning(ex, "Update failed for Department with id {Id}", entity.Id);
                return NotFound();
            }
        }
    }
}