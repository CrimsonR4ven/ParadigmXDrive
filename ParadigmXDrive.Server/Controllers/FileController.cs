using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using ParadigmXDrive.Server.Models;
using ParadigmXDrive.Server.Types;
using System.Net.WebSockets;
using System.IO;

namespace ParadigmXDrive.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FileController : ControllerBase
    {
        private FolderStructure folderstruct;
        private string[] imageExtentions = ["jpg", "jpeg", "gif", "webp", "png", "ico"];
        private readonly ILogger<FileController> _logger;

        public FileController(ILogger<FileController> logger)
        {
            _logger = logger;
            folderstruct = new FolderStructure("/media/pi/Extreme SSD");
            Console.WriteLine(folderstruct.GetFolderData("/media/pi/Extreme SSD"));
        }

        [HttpGet("GetFolderData")]
        public async Task<IActionResult> GetFolderData(string folder)
        {
            var resp =  folderstruct.GetFolderData(folder);
            if (resp == null)
            {
                return NotFound();
            }
            return Ok(resp);
        }

        [HttpGet("GetImageFile")]
        public async Task<IActionResult> GetImageFile(string fileName)
        {
            var fullPath = folderstruct.GetFilePath(fileName);
            if (!imageExtentions.Contains(fileName.Split('.').Last())) return NotFound();
            byte[] imageBytes = System.IO.File.ReadAllBytes(fullPath);
            return File(imageBytes, "Image/png");
        }

        [HttpGet("GetDownloadFile")]
        public async Task<IActionResult> GetDownloadFile(string fileName)
        {
            var fullPath = folderstruct.GetFilePath(fileName);
            byte[] fileBytes = System.IO.File.ReadAllBytes(fullPath);
            return File(fileBytes, MimeMapping.MimeUtility.GetMimeMapping(fileName), fileName);
        }

        [HttpPatch("UpdateFileName")]
        public async Task<IActionResult> UpdateFileName(string fileName, string newName)
        {
            Console.WriteLine($"org name: {fileName} new name: {newName}");
            var fullPath = folderstruct.GetFilePath(fileName);
            System.IO.File.Move(fullPath, Path.GetDirectoryName(fullPath) + "/" + newName + Path.GetExtension(fullPath));
            return Ok();
        }
    }
}
