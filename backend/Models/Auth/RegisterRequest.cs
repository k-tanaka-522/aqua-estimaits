using System.ComponentModel.DataAnnotations;

namespace AquaGrow.Api.Models.Auth;

public class RegisterRequest
{
    [Required(ErrorMessage = "メールアドレスは必須です")]
    [EmailAddress(ErrorMessage = "有効なメールアドレスを入力してください")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "パスワードは必須です")]
    [MinLength(8, ErrorMessage = "パスワードは8文字以上である必要があります")]
    public string Password { get; set; } = string.Empty;

    [MaxLength(100, ErrorMessage = "名前は100文字以内である必要があります")]
    public string? Name { get; set; }
}
