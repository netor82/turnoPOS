using Microsoft.AspNetCore.Mvc;
using TurnoPOS.Data.Models;
using TurnoPOS.Service.Interfaces;
using TurnoPOS.Service.Services;

namespace TurnoPOS.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController(IInventoryService inventoryService,
        IThermalPrinterService printer,
        ILogger<InventoryController> logger) : ControllerBase
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
        public async Task<ActionResult<Item>> Create([FromBody] Item item)
        {
            var created = await inventoryService.Create(item);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateAsync([FromBody] Item entity)
        {
            if (entity.Id == 0)
                return BadRequest();
            try
            {
                await inventoryService.Update(entity);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                logger.LogWarning(ex, "Update failed for Item with id {Id}", entity.Id);
                return NotFound();
            }
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

        [HttpGet("printVertical/{text}")]
        public ActionResult PrintVertical(string text)
        {
            printer.PrintVertical(text);
            return NoContent();
        }
    }
}