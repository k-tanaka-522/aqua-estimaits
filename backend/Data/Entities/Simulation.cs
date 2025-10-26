using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AquaGrow.Api.Data.Entities;

public class Simulation
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string LandId { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string FishType { get; set; } = string.Empty;

    [Required]
    public string VegetableTypes { get; set; } = string.Empty; // JSON array

    [Required]
    public double CultivationArea { get; set; }

    [Required]
    public double WholesaleRatio { get; set; }

    [Required]
    public double RetailRatio { get; set; }

    [Required]
    public double WholesalePrice { get; set; }

    [Required]
    public double RetailPrice { get; set; }

    public double InitialInvestment { get; set; }

    public double AnnualRevenue { get; set; }

    public double AnnualCost { get; set; }

    public double AnnualProfit { get; set; }

    public double PaybackPeriod { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("LandId")]
    public Land? Land { get; set; }
}
