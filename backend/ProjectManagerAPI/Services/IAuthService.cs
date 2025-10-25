using ProjectManagerAPI.DTOs;

namespace ProjectManagerAPI.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto);
        Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
        string GenerateJwtToken(string username, string email, int userId);
    }
}