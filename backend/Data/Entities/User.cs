namespace AquaGrow.Api.Data.Entities;

/// <summary>
/// ユーザー情報
/// </summary>
public class User
{
    /// <summary>
    /// ユーザーID
    /// </summary>
    public string Id { get; set; } = Guid.NewGuid().ToString();

    /// <summary>
    /// メールアドレス（ログインID）
    /// </summary>
    public required string Email { get; set; }

    /// <summary>
    /// パスワードハッシュ（BCrypt）
    /// </summary>
    public required string PasswordHash { get; set; }

    /// <summary>
    /// ユーザー名（表示名）
    /// </summary>
    public string? Name { get; set; }

    /// <summary>
    /// リフレッシュトークン（7日間有効）
    /// </summary>
    public string? RefreshToken { get; set; }

    /// <summary>
    /// リフレッシュトークンの有効期限
    /// </summary>
    public DateTime? RefreshTokenExpiryTime { get; set; }

    /// <summary>
    /// アカウント作成日時
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// 最終更新日時
    /// </summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// このユーザーが所有する土地（ナビゲーションプロパティ）
    /// </summary>
    public ICollection<Land> Lands { get; set; } = new List<Land>();

    /// <summary>
    /// このユーザーが作成したシミュレーション（ナビゲーションプロパティ）
    /// </summary>
    public ICollection<Simulation> Simulations { get; set; } = new List<Simulation>();
}
