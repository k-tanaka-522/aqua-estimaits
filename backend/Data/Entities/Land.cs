using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AquaGrow.Api.Data.Entities;

public class Land
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public double Latitude { get; set; }

    [Required]
    public double Longitude { get; set; }

    [Required]
    public double Area { get; set; }

    [Required]
    [MaxLength(50)]
    public string Terrain { get; set; } = string.Empty; // flat, slope, mixed

    [Required]
    [MaxLength(50)]
    public string Sunlight { get; set; } = string.Empty; // full_sun, partial_shade, shade

    public bool WaterSource { get; set; }

    public bool PowerSource { get; set; }

    [MaxLength(1000)]
    public string? Memo { get; set; }

    public string? Address { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Simulation> Simulations { get; set; } = new List<Simulation>();

    // Computed property
    [NotMapped]
    public double CultivationArea => Area * 0.7;
}
