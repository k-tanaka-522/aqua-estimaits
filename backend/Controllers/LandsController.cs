using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AquaGrow.Api.Data.DbContext;
using AquaGrow.Api.Data.Entities;

namespace AquaGrow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LandsController : ControllerBase
{
    private readonly AquaGrowDbContext _context;
    private readonly ILogger<LandsController> _logger;

    public LandsController(AquaGrowDbContext context, ILogger<LandsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/lands
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Land>>> GetLands()
    {
        try
        {
            var lands = await _context.Lands
                .Include(l => l.Simulations)
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync();

            return Ok(lands);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving lands");
            return StatusCode(500, "Internal server error");
        }
    }

    // GET: api/lands/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Land>> GetLand(string id)
    {
        try
        {
            var land = await _context.Lands
                .Include(l => l.Simulations)
                .FirstOrDefaultAsync(l => l.Id == id);

            if (land == null)
            {
                return NotFound($"Land with ID {id} not found");
            }

            return Ok(land);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving land {LandId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    // POST: api/lands
    [HttpPost]
    public async Task<ActionResult<Land>> CreateLand([FromBody] Land land)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Generate new ID if not provided
            if (string.IsNullOrEmpty(land.Id))
            {
                land.Id = Guid.NewGuid().ToString();
            }

            _context.Lands.Add(land);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLand), new { id = land.Id }, land);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating land");
            return StatusCode(500, "Internal server error");
        }
    }

    // PUT: api/lands/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateLand(string id, [FromBody] Land land)
    {
        try
        {
            if (id != land.Id)
            {
                return BadRequest("ID mismatch");
            }

            if (!await _context.Lands.AnyAsync(l => l.Id == id))
            {
                return NotFound($"Land with ID {id} not found");
            }

            _context.Entry(land).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating land {LandId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    // DELETE: api/lands/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLand(string id)
    {
        try
        {
            var land = await _context.Lands.FindAsync(id);
            if (land == null)
            {
                return NotFound($"Land with ID {id} not found");
            }

            _context.Lands.Remove(land);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting land {LandId}", id);
            return StatusCode(500, "Internal server error");
        }
    }
}
