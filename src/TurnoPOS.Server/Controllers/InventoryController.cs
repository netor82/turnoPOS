using Microsoft.AspNetCore.Mvc;
using TurnoPOS.Service.Interfaces;
using TurnoPOS.Data.Models;

namespace TurnoPOS.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class InventoryController(IInventoryService inventoryService, ILogger<InventoryController> logger) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Item>>> GetAll([FromQuery] int? parentId, [FromQuery] bool includeAll = false)
        {
            var items = await inventoryService.GetAll(parentId, includeAll);
            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Item>> GetById(int id)
        {
            var item = await inventoryService.GetById(id);
            if (item == null)
                return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public ActionResult<Item> Create([FromBody] Item item)
        {
            var created = inventoryService.Create(item);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut]
        public IActionResult Update([FromBody] Item item)
        {
            if (item.Id == 0)
                return BadRequest();
            inventoryService.Update(item);
            return NoContent();
        }

        [HttpPatch("{id}/active/{isActive:bool}")]
        public async Task<ActionResult<Item>> PatchActive(int id, bool isActive)
        {
            var updated = await inventoryService.PatchActive(id, isActive);
            if (updated == null)
                return NotFound();
            return Ok(updated);
        }

        [HttpPatch("{id}/stock/{units:int}")]
        public async Task<ActionResult<Item>> PatchStock(int id, int units)
        {
            var updated = await inventoryService.PatchStock(id, units);
            if (updated == null)
                return NotFound();
            return Ok(updated);
        }

        [HttpPatch("{id}/move/{newParent:int}")]
        public async Task<ActionResult<Item>> PatchParent(int id, int? newParent)
        {
            var updated = await inventoryService.PatchParent(id, newParent);
            if (updated == null)
                return NotFound();
            return Ok(updated);
        }
    }
}