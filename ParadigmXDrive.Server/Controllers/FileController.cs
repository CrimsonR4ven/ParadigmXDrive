using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
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
        private string[] imageExtentions = { "jpg", "jpeg", "gif", "webp", "png", "ico" };
        private readonly ILogger<FileController> _logger;

        public FileController(ILogger<FileController> logger)
        {
            _logger = logger;
            folderstruct = new FolderStructure("\\media\\pi\\Extreme SSD");
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
            if (!imageExtentions.Contains(path.Split('.').Last())) return NotFound();
            byte[] imageBytes = System.IO.File.ReadAllBytes(fullPath);
            return File(imageBytes, "Image/png");
        }

        [HttpGet("GetDownloadFile")]
        public async Task<IActionResult> GetDownloadFile(string path)
        {
            var fullPath = folderstruct.GetImageFile(path);
            var name = Path.GetFileName(fullPath);
            byte[] fileBytes = System.IO.File.ReadAllBytes(fullPath);
            return File(fileBytes, "Image/png", name);
        }

        [HttpPatch("UpdateFileName")]
        public async Task<IActionResult> UpdateFileName(string path, string newName)
        {
            Console.WriteLine($"org path: {path} new name: {newName}");
            var fullPath = folderstruct.GetImageFile(path);
            System.IO.File.Move(fullPath, Path.GetDirectoryName(fullPath) + "\\" + newName + Path.GetExtension(fullPath));
            return Ok();
        }
    }
}
