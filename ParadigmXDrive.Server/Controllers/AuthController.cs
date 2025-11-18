using Microsoft.AspNetCore.Mvc;

namespace ParadigmXDrive.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        [HttpGet("Login")]
        public async Task<IActionResult> Login()
        {
            return Ok();
        }
    }
}