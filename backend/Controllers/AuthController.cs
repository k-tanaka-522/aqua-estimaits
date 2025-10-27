using AquaGrow.Api.Data.DbContext;
using AquaGrow.Api.Data.Entities;
using AquaGrow.Api.Models.Auth;
using AquaGrow.Api.Services;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AquaGrow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AquaGrowDbContext _context;
    private readonly IJwtService _jwtService;
    private readonly ILogger<AuthController> _logger;
    private readonly IConfiguration _configuration;

    public AuthController(
        AquaGrowDbContext context,
        IJwtService jwtService,
        ILogger<AuthController> logger,
        IConfiguration configuration)
    {
        _context = context;
        _jwtService = jwtService;
        _logger = logger;
        _configuration = configuration;
    }

    /// <summary>
    /// ユーザー登録
    /// </summary>
    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        // Check if user already exists
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return BadRequest(new { message = "このメールアドレスは既に登録されています" });
        }

        // Create new user
        var user = new User
        {
            Email = request.Email,
            Name = request.Name,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, workFactor: 12),
            RefreshToken = _jwtService.GenerateRefreshToken(),
            RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        _logger.LogInformation("New user registered: {Email}", user.Email);

        // Generate tokens
        var accessToken = _jwtService.GenerateAccessToken(user);
        var refreshTokenExpirationMinutes = int.Parse(_configuration.GetSection("JwtSettings")["AccessTokenExpirationMinutes"] ?? "60");

        var response = new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = user.RefreshToken,
            ExpiresIn = refreshTokenExpirationMinutes * 60, // convert to seconds
            User = new UserInfo
            {
                Id = user.Id,
                Email = user.Email,
                Name = user.Name
            }
        };

        return CreatedAtAction(nameof(Register), response);
    }

    /// <summary>
    /// ログイン
    /// </summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        // Find user
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null)
        {
            return Unauthorized(new { message = "メールアドレスまたはパスワードが正しくありません" });
        }

        // Verify password
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "メールアドレスまたはパスワードが正しくありません" });
        }

        // Generate new refresh token
        user.RefreshToken = _jwtService.GenerateRefreshToken();
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await _context.SaveChangesAsync();

        _logger.LogInformation("User logged in: {Email}", user.Email);

        // Generate access token
        var accessToken = _jwtService.GenerateAccessToken(user);
        var refreshTokenExpirationMinutes = int.Parse(_configuration.GetSection("JwtSettings")["AccessTokenExpirationMinutes"] ?? "60");

        var response = new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = user.RefreshToken,
            ExpiresIn = refreshTokenExpirationMinutes * 60,
            User = new UserInfo
            {
                Id = user.Id,
                Email = user.Email,
                Name = user.Name
            }
        };

        return Ok(response);
    }

    /// <summary>
    /// トークンリフレッシュ
    /// </summary>
    [HttpPost("refresh")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthResponse>> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        // Find user with matching refresh token
        var user = await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == request.RefreshToken);
        if (user == null || user.RefreshTokenExpiryTime == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            return Unauthorized(new { message = "無効なリフレッシュトークンです" });
        }

        // Generate new tokens
        user.RefreshToken = _jwtService.GenerateRefreshToken();
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await _context.SaveChangesAsync();

        var accessToken = _jwtService.GenerateAccessToken(user);
        var refreshTokenExpirationMinutes = int.Parse(_configuration.GetSection("JwtSettings")["AccessTokenExpirationMinutes"] ?? "60");

        var response = new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = user.RefreshToken,
            ExpiresIn = refreshTokenExpirationMinutes * 60,
            User = new UserInfo
            {
                Id = user.Id,
                Email = user.Email,
                Name = user.Name
            }
        };

        return Ok(response);
    }

    /// <summary>
    /// ログアウト（リフレッシュトークンを無効化）
    /// </summary>
    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Logout()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var user = await _context.Users.FindAsync(userId);
        if (user != null)
        {
            user.RefreshToken = null;
            user.RefreshTokenExpiryTime = null;
            await _context.SaveChangesAsync();

            _logger.LogInformation("User logged out: {Email}", user.Email);
        }

        return Ok(new { message = "ログアウトしました" });
    }

    /// <summary>
    /// 現在のユーザー情報を取得
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(UserInfo), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<UserInfo>> GetCurrentUser()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return Unauthorized();
        }

        return Ok(new UserInfo
        {
            Id = user.Id,
            Email = user.Email,
            Name = user.Name
        });
    }
}
