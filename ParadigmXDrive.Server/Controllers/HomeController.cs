using Microsoft.AspNetCore.Mvc;
using ParadigmXDrive.Server.Types;

namespace ParadigmXDrive.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HomeController : Controller
    {
        private FolderStructure folderstruct;

        private readonly ILogger<FileController> _logger;

        public HomeController(ILogger<FileController> logger)
        {
            _logger = logger;
            folderstruct = new FolderStructure("C:\\nice");
            Console.WriteLine(folderstruct.GetFolder("nice"));
        }

        [HttpGet("GetFolderData/{folderName}")]
        public async Task<IActionResult> GetFolderData(string folderName)
        {
            var resp = folderstruct.GetFolder(folderName);
            if (resp == null)
            {
                return NotFound();
            }
            return Ok(resp);
        }
    }
}
