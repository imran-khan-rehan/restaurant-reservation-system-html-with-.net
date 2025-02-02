
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using restuarant_management_system.Models;

namespace RestaurantBookingSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TablesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TablesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetTables()
        {
            var tables = await _context.Tables
                .Join(
                    _context.Restaurants,  
                    table => table.RestaurantId,  
                    restaurant => restaurant.Id, 
                    (table, restaurant) => new
                    {
                        table.Id,
                        table.Name,
                        table.Price,
                        table.DateOfAvailability,
                        table.RestaurantId,
                        RestaurantName = restaurant.Name 
                    }
                )
                .ToListAsync();

            return Ok(tables);
        }


     
        [HttpGet("{id}")]
        public async Task<ActionResult<Table>> GetTable(int id)
        {
            var table = await _context.Tables.FirstOrDefaultAsync(t => t.Id == id);
            if (table == null) return NotFound();
            return table;
        }

      
        [HttpPost]
        public async Task<ActionResult<Table>> PostTable(Table table)
        {
            _context.Tables.Add(table);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTable), new { id = table.Id }, table);
        }

     
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTable(int id, Table table)
        {
            if (id != table.Id) return BadRequest();

            _context.Entry(table).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Tables.Any(e => e.Id == id)) return NotFound();
                throw;
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTable(int id)
        {
            var table = await _context.Tables.FindAsync(id);
            if (table == null) return NotFound();

            _context.Tables.Remove(table);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
