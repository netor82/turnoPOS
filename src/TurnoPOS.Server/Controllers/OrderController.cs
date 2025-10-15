using Microsoft.AspNetCore.Mvc;
using TurnoPOS.Service.Interfaces;
using TurnoPOS.Data.Models;
using System.ComponentModel.DataAnnotations;

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
        public async Task<ActionResult<IList<Order>>> GetAll([Required, FromQuery] DateTime date)
        {
            var orders = await orderService.GetAll(date);
            return Ok(orders);
        }

        [HttpGet("itemsSold")]
        public async Task<IActionResult> GetItemsSold()
        {
            var result = await orderService.GetItemsSold();
            return Ok(result);
        }

        [HttpGet("dates")]
        public async Task<IActionResult> GetOrderDates()
        {
            var result = await orderService.GetOrderDates();
            return Ok(result);
        }

        // Cancel an order
        [HttpPost("{id}/cancel")]
        public async Task<IActionResult> Cancel(int id)
        {
            await orderService.Cancel(id);
            return NoContent();
        }

        [HttpGet("{id}/print")]
        public async Task<IActionResult> Print(int id)
        {
            await orderService.Print(id);

            return NoContent();
        }
    }
}