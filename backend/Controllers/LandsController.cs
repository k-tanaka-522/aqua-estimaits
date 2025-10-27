using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using AquaGrow.Api.Data.DbContext;
using AquaGrow.Api.Data.Entities;

namespace AquaGrow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
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
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User ID not found in token");
            }

            var lands = await _context.Lands
                .Include(l => l.Simulations)
                .Where(l => l.UserId == userId)
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync();

            return Ok(lands);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving lands for user");
            return StatusCode(500, "Internal server error");
        }
    }

    // GET: api/lands/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Land>> GetLand(string id)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User ID not found in token");
            }

            var land = await _context.Lands
                .Include(l => l.Simulations)
                .FirstOrDefaultAsync(l => l.Id == id && l.UserId == userId);

            if (land == null)
            {
                return NotFound($"Land with ID {id} not found or you don't have permission to access it");
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

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User ID not found in token");
            }

            // Generate new ID if not provided
            if (string.IsNullOrEmpty(land.Id))
            {
                land.Id = Guid.NewGuid().ToString();
            }

            // Set UserId to current user (override any client-provided value for security)
            land.UserId = userId;

            _context.Lands.Add(land);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Land {LandId} created by user {UserId}", land.Id, userId);

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

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User ID not found in token");
            }

            // Check if land exists and belongs to the current user
            var existingLand = await _context.Lands.FindAsync(id);
            if (existingLand == null)
            {
                return NotFound($"Land with ID {id} not found");
            }

            if (existingLand.UserId != userId)
            {
                return Forbid("You don't have permission to update this land");
            }

            // Preserve the UserId (prevent client from changing ownership)
            land.UserId = userId;

            _context.Entry(existingLand).State = EntityState.Detached;
            _context.Entry(land).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            _logger.LogInformation("Land {LandId} updated by user {UserId}", id, userId);

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
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User ID not found in token");
            }

            var land = await _context.Lands.FindAsync(id);
            if (land == null)
            {
                return NotFound($"Land with ID {id} not found");
            }

            // Check if the land belongs to the current user
            if (land.UserId != userId)
            {
                return Forbid("You don't have permission to delete this land");
            }

            _context.Lands.Remove(land);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Land {LandId} deleted by user {UserId}", id, userId);

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting land {LandId}", id);
            return StatusCode(500, "Internal server error");
        }
    }
}
