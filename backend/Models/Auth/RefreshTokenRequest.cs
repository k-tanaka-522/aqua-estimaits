using System.ComponentModel.DataAnnotations;

namespace AquaGrow.Api.Models.Auth;

public class RefreshTokenRequest
{
    [Required(ErrorMessage = "リフレッシュトークンは必須です")]
    public string RefreshToken { get; set; } = string.Empty;
}
