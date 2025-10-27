using AquaGrow.Api.Data.Entities;
using System.Security.Claims;

namespace AquaGrow.Api.Services;

public interface IJwtService
{
    /// <summary>
    /// ユーザー情報からJWTアクセストークンを生成
    /// </summary>
    string GenerateAccessToken(User user);

    /// <summary>
    /// リフレッシュトークンを生成
    /// </summary>
    string GenerateRefreshToken();

    /// <summary>
    /// JWTトークンからClaimsPrincipalを取得（検証あり）
    /// </summary>
    ClaimsPrincipal? GetPrincipalFromToken(string token, bool validateLifetime = true);

    /// <summary>
    /// トークンからユーザーIDを取得
    /// </summary>
    string? GetUserIdFromToken(string token);
}
