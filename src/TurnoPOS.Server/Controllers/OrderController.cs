using Microsoft.AspNetCore.Mvc;
using TurnoPOS.Service.Interfaces;
using TurnoPOS.Data.Models;

namespace TurnoPOS.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController(IOrderService orderService) : ControllerBase
    {
        // Create a new order
        [HttpPost]
        public async Task<ActionResult<Order>> Create([FromBody] Order order)
        {
            var createdOrder = await orderService.Create(order);
            return CreatedAtAction(nameof(GetById), new { id = createdOrder.Id }, createdOrder);
        }

        // Get order by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetById(int id)
        {
            var order = await orderService.GetById(id);
            if (order == null)
                return NotFound();
            return Ok(order);
        }

        // Get all orders
        [HttpGet]
        public async Task<ActionResult<IList<Order>>> GetAll()
        {
            var orders = await orderService.GetAll();
            return Ok(orders);
        }

        // Cancel an order
        [HttpPost("{id}/cancel")]
        public async Task<IActionResult> Cancel(int id)
        {
            await orderService.Cancel(id);
            return NoContent();
        }
    }
}