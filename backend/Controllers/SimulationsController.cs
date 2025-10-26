using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AquaGrow.Api.Data.DbContext;
using AquaGrow.Api.Data.Entities;

namespace AquaGrow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SimulationsController : ControllerBase
{
    private readonly AquaGrowDbContext _context;
    private readonly ILogger<SimulationsController> _logger;

    public SimulationsController(AquaGrowDbContext context, ILogger<SimulationsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/simulations
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Simulation>>> GetSimulations([FromQuery] string? landId = null)
    {
        try
        {
            IQueryable<Simulation> query = _context.Simulations.Include(s => s.Land);

            if (!string.IsNullOrEmpty(landId))
            {
                query = query.Where(s => s.LandId == landId);
            }

            var simulations = await query
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();

            return Ok(simulations);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving simulations");
            return StatusCode(500, "Internal server error");
        }
    }

    // GET: api/simulations/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Simulation>> GetSimulation(string id)
    {
        try
        {
            var simulation = await _context.Simulations
                .Include(s => s.Land)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (simulation == null)
            {
                return NotFound($"Simulation with ID {id} not found");
            }

            return Ok(simulation);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving simulation {SimulationId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    // POST: api/simulations
    [HttpPost]
    public async Task<ActionResult<Simulation>> CreateSimulation([FromBody] Simulation simulation)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Verify land exists
            if (!await _context.Lands.AnyAsync(l => l.Id == simulation.LandId))
            {
                return BadRequest($"Land with ID {simulation.LandId} not found");
            }

            // Generate new ID if not provided
            if (string.IsNullOrEmpty(simulation.Id))
            {
                simulation.Id = Guid.NewGuid().ToString();
            }

            _context.Simulations.Add(simulation);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSimulation), new { id = simulation.Id }, simulation);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating simulation");
            return StatusCode(500, "Internal server error");
        }
    }

    // PUT: api/simulations/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSimulation(string id, [FromBody] Simulation simulation)
    {
        try
        {
            if (id != simulation.Id)
            {
                return BadRequest("ID mismatch");
            }

            if (!await _context.Simulations.AnyAsync(s => s.Id == id))
            {
                return NotFound($"Simulation with ID {id} not found");
            }

            _context.Entry(simulation).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating simulation {SimulationId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    // DELETE: api/simulations/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSimulation(string id)
    {
        try
        {
            var simulation = await _context.Simulations.FindAsync(id);
            if (simulation == null)
            {
                return NotFound($"Simulation with ID {id} not found");
            }

            _context.Simulations.Remove(simulation);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting simulation {SimulationId}", id);
            return StatusCode(500, "Internal server error");
        }
    }
}
