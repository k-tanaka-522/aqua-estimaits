using Microsoft.EntityFrameworkCore;
using AquaGrow.Api.Data.Entities;

namespace AquaGrow.Api.Data.DbContext;

public class AquaGrowDbContext : Microsoft.EntityFrameworkCore.DbContext
{
    public AquaGrowDbContext(DbContextOptions<AquaGrowDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Land> Lands { get; set; }
    public DbSet<Simulation> Simulations { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User entity
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(200);
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.Name).HasMaxLength(100);

            // Email must be unique
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.CreatedAt);

            // Configure relationships
            entity.HasMany(e => e.Lands)
                  .WithOne(e => e.User)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.Simulations)
                  .WithOne(e => e.User)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Land entity
        modelBuilder.Entity<Land>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Terrain).HasMaxLength(50);
            entity.Property(e => e.Sunlight).HasMaxLength(50);
            entity.Property(e => e.Memo).HasMaxLength(1000);

            entity.HasIndex(e => e.UserId);
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

            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.LandId);
            entity.HasIndex(e => e.CreatedAt);
        });

        // Seed data (optional - similar to mock data)
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        // Add a test user for development
        var testUser = new User
        {
            Id = "user-001",
            Email = "test@example.com",
            PasswordHash = "$2a$11$ExampleHashForDevelopment", // BCrypt hash for "password123"
            Name = "テストユーザー",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        modelBuilder.Entity<User>().HasData(testUser);

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
            UserId = "user-001",
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
            if (entry.Entity is User user)
            {
                if (entry.State == EntityState.Added)
                {
                    user.CreatedAt = DateTime.UtcNow;
                }
                user.UpdatedAt = DateTime.UtcNow;
            }
            else if (entry.Entity is Land land)
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
