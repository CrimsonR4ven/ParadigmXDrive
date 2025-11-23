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
    [Route("api/[controller]")]
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
            if (!System.IO.File.Exists(filePath))
                return NotFound();

            var fileInfo = new FileInfo(filePath);
            var fileLength = fileInfo.Length;
            var rangeHeader = Request.Headers["Range"].ToString();

            if (string.IsNullOrEmpty(rangeHeader))
                return PhysicalFile(filePath, "application/octet-stream", enableRangeProcessing: true);

            // Parse range
            var range = rangeHeader.Replace("bytes=", "").Split('-');
            var start = long.Parse(range[0]);
            var end = range.Length > 1 && !string.IsNullOrEmpty(range[1]) ? long.Parse(range[1]) : fileLength - 1;
            var contentLength = end - start + 1;

            Response.StatusCode = StatusCodes.Status206PartialContent;
            Response.Headers.Add("Accept-Ranges", "bytes");
            Response.Headers.Add("Content-Range", $"bytes {start}-{end}/{fileLength}");
            Response.Headers.Add("Content-Length", contentLength.ToString());

            using var fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read);
            fs.Seek(start, SeekOrigin.Begin);
            var buffer = new byte[64 * 1024]; // 64KB buffer

            long remaining = contentLength;
            while (remaining > 0)
            {
                var count = (int)Math.Min(buffer.Length, remaining);
                var read = await fs.ReadAsync(buffer, 0, count);
                if (read == 0) break;
                await Response.Body.WriteAsync(buffer.AsMemory(0, read));
                remaining -= read;
            }

            return new EmptyResult();
        }

        [HttpPatch("UpdateFilePath")]
        public async Task<IActionResult> UpdateFileName(string filePath, string newPath)
        {
            System.IO.File.Move(filePath, newPath);
            return Ok();
        }
    }
}
