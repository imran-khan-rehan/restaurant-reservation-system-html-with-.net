
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using restuarant_management_system.Models;

namespace restuarant_management_system.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookTablesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BookTablesController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<BookTable>>> GetUserBookTables(int userId)
        {
       

            return await _context.BookTables
                .Where(bt => bt.UserId == userId)
                .ToListAsync();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<BookTable>> GetBookTable(int id)
        {
            var bookTable = await _context.BookTables.FirstOrDefaultAsync(bt => bt.Id == id);
            if (bookTable == null) return NotFound();
            return bookTable;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookTable>>> GetBookTables()
        {
            return await _context.BookTables.ToListAsync();
        }

     
     

     
        [HttpPost]
        public async Task<ActionResult<BookTable>> PostBookTable(BookTable bookTable)
        {
            _context.BookTables.Add(bookTable);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetBookTable), new { id = bookTable.Id }, bookTable);
        }

       
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBookTable(int id, BookTable bookTable)
        {
            if (id != bookTable.Id) return BadRequest();

            _context.Entry(bookTable).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.BookTables.Any(e => e.Id == id)) return NotFound();
                throw;
            }
            return NoContent();
        }

       
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBookTable(int id)
        {
            var bookTable = await _context.BookTables.FindAsync(id);
            if (bookTable == null) return NotFound();

            _context.BookTables.Remove(bookTable);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
