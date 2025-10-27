using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AquaGrow.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddUserAuthentication : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    RefreshToken = table.Column<string>(type: "TEXT", nullable: true),
                    RefreshTokenExpiryTime = table.Column<DateTime>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Lands",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Latitude = table.Column<double>(type: "REAL", nullable: false),
                    Longitude = table.Column<double>(type: "REAL", nullable: false),
                    Area = table.Column<double>(type: "REAL", nullable: false),
                    Terrain = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Sunlight = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    WaterSource = table.Column<bool>(type: "INTEGER", nullable: false),
                    PowerSource = table.Column<bool>(type: "INTEGER", nullable: false),
                    Memo = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true),
                    Address = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UserId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lands", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Lands_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Simulations",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    LandId = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    FishType = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    VegetableTypes = table.Column<string>(type: "TEXT", nullable: false),
                    CultivationArea = table.Column<double>(type: "REAL", nullable: false),
                    WholesaleRatio = table.Column<double>(type: "REAL", nullable: false),
                    RetailRatio = table.Column<double>(type: "REAL", nullable: false),
                    WholesalePrice = table.Column<double>(type: "REAL", nullable: false),
                    RetailPrice = table.Column<double>(type: "REAL", nullable: false),
                    InitialInvestment = table.Column<double>(type: "REAL", nullable: false),
                    AnnualRevenue = table.Column<double>(type: "REAL", nullable: false),
                    AnnualCost = table.Column<double>(type: "REAL", nullable: false),
                    AnnualProfit = table.Column<double>(type: "REAL", nullable: false),
                    PaybackPeriod = table.Column<double>(type: "REAL", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UserId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Simulations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Simulations_Lands_LandId",
                        column: x => x.LandId,
                        principalTable: "Lands",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Simulations_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "Name", "PasswordHash", "RefreshToken", "RefreshTokenExpiryTime", "UpdatedAt" },
                values: new object[] { "user-001", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "test@example.com", "テストユーザー", "$2a$11$ExampleHashForDevelopment", null, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.InsertData(
                table: "Lands",
                columns: new[] { "Id", "Address", "Area", "CreatedAt", "Latitude", "Longitude", "Memo", "Name", "PowerSource", "Sunlight", "Terrain", "UpdatedAt", "UserId", "WaterSource" },
                values: new object[] { "land-001", "新潟県新潟市", 600.0, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 37.9161, 139.03639999999999, null, "新潟農地A", true, "full_sun", "flat", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "user-001", true });

            migrationBuilder.CreateIndex(
                name: "IX_Lands_CreatedAt",
                table: "Lands",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Lands_UserId",
                table: "Lands",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Simulations_CreatedAt",
                table: "Simulations",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Simulations_LandId",
                table: "Simulations",
                column: "LandId");

            migrationBuilder.CreateIndex(
                name: "IX_Simulations_UserId",
                table: "Simulations",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_CreatedAt",
                table: "Users",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Simulations");

            migrationBuilder.DropTable(
                name: "Lands");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
