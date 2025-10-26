using Microsoft.EntityFrameworkCore;
using AquaGrow.Api.Data.Entities;

namespace AquaGrow.Api.Data.DbContext;

public class AquaGrowDbContext : Microsoft.EntityFrameworkCore.DbContext
{
    public AquaGrowDbContext(DbContextOptions<AquaGrowDbContext> options) : base(options)
    {
    }

    public DbSet<Land> Lands { get; set; }
    public DbSet<Simulation> Simulations { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Land entity
        modelBuilder.Entity<Land>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Terrain).HasMaxLength(50);
            entity.Property(e => e.Sunlight).HasMaxLength(50);
            entity.Property(e => e.Memo).HasMaxLength(1000);

            entity.HasIndex(e => e.CreatedAt);

            // Configure relationship
            entity.HasMany(e => e.Simulations)
                  .WithOne(e => e.Land)
                  .HasForeignKey(e => e.LandId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Simulation entity
        modelBuilder.Entity<Simulation>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.FishType).IsRequired().HasMaxLength(100);
            entity.Property(e => e.VegetableTypes).IsRequired();

            entity.HasIndex(e => e.LandId);
            entity.HasIndex(e => e.CreatedAt);
        });

        // Seed data (optional - similar to mock data)
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        // Add some initial lands for development
        var land1 = new Land
        {
            Id = "land-001",
            Name = "新潟農地A",
            Latitude = 37.9161,
            Longitude = 139.0364,
            Area = 600,
            Terrain = "flat",
            Sunlight = "full_sun",
            WaterSource = true,
            PowerSource = true,
            Address = "新潟県新潟市",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        modelBuilder.Entity<Land>().HasData(land1);
    }

    public override int SaveChanges()
    {
        UpdateTimestamps();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void UpdateTimestamps()
    {
        var entries = ChangeTracker.Entries()
            .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

        foreach (var entry in entries)
        {
            if (entry.Entity is Land land)
            {
                if (entry.State == EntityState.Added)
                {
                    land.CreatedAt = DateTime.UtcNow;
                }
                land.UpdatedAt = DateTime.UtcNow;
            }
            else if (entry.Entity is Simulation simulation)
            {
                if (entry.State == EntityState.Added)
                {
                    simulation.CreatedAt = DateTime.UtcNow;
                }
                simulation.UpdatedAt = DateTime.UtcNow;
            }
        }
    }
}
