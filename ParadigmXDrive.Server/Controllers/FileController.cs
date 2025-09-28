using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ParadigmXDrive.Server.Models;
using ParadigmXDrive.Server.Types;
using System.Net.WebSockets;

namespace ParadigmXDrive.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FileController : ControllerBase
    {
        private FolderStructure folderstruct;
        private string[] imageExtentions = { "jpg", "jpeg", "gif", "webp", "png"};
        private readonly ILogger<FileController> _logger;

        public FileController(ILogger<FileController> logger)
        {
            _logger = logger;
            folderstruct = new FolderStructure("E:\\Cool Art");
            Console.WriteLine(folderstruct.GetFolder("\\Cool Art"));
        }

        [HttpGet("GetFolderData")]
        public async Task<IActionResult> GetFolderData(string folder)
        {
            var resp = folderstruct.GetFolder(folder);
            if (resp == null)
            {
                return NotFound();
            }
            return Ok(resp);
        }

        [HttpGet("GetImageFile")]
        public async Task<IActionResult> GetImageFile(string path)
        {
            var fullPath = folderstruct.GetImageFile(path);
            if (!imageExtentions.Contains(path.Split('\\').Last().Split('.')[1])) return NotFound();
            byte[] imageBytes = System.IO.File.ReadAllBytes(fullPath);
            return File(imageBytes, "Image/png");
        }
    }
}