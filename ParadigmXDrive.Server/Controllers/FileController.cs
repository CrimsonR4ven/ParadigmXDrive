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
        }

        [HttpGet("GetFolderData")]
        public async Task<IActionResult> GetFolderData(string folderPath)
        {
            if (!Directory.Exists(folderPath)) return NotFound();
            var folderName = Path.GetDirectoryName(folderPath); 
            var resp = new Folder(folderName, false, null, folderPath).GetJson();
            return Ok(resp);
        }

        [HttpGet("GetFileBlob")]
        public async Task<IActionResult> GetDownloadFile(string filePath)
        {
            byte[] fileBytes = System.IO.File.ReadAllBytes(filePath);
            return File(fileBytes, MimeMapping.MimeUtility.GetMimeMapping(filePath), Path.GetFileName(filePath));
        }

        [HttpPatch("UpdateFilePath")]
        public async Task<IActionResult> UpdateFileName(string filePath, string newPath)
        {
            System.IO.File.Move(filePath, newPath);
            return Ok();
        }
    }
}
