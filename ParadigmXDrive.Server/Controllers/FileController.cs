using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using ParadigmXDrive.Server.Models;
using ParadigmXDrive.Server.Types;
using System.Net.WebSockets;
using System.IO;
using ParadigmXDrive.Server.Services;

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
        
        [HttpGet("GetFolderPaths")]
        public async Task<IActionResult> GetFolderPaths(string folderPath)
        {
            var driveWatcher = VirtualDriveWatcherService.VirtualDrives.FirstOrDefault(x => x.BasePath == folderPath.Replace("%20", " "));
            if (driveWatcher == null) return NotFound();
            var resp = driveWatcher.FolderStructure.GetSubfolders();
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
            
            Response.Headers.Add("Content-Disposition", $"attachment; filename=\"{fileInfo.Name}\"");

            if (string.IsNullOrEmpty(rangeHeader))
                return PhysicalFile(filePath, "application/octet-stream", enableRangeProcessing: true);
            
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
            var buffer = new byte[64 * 1024]; 

            long remaining = contentLength;
            while (remaining > 0)
            {
                var count = (int)Math.Min(buffer.Length, remaining);
                var read = await fs.ReadAsync(buffer, 0, count);
                if (read == 0) break;
                await Response.Body.WriteAsync(buffer.AsMemory(0, read));
                remaining -= read;
            }

            await Response.Body.FlushAsync();

            return new EmptyResult();
        }

        [HttpPatch("UpdateFilePath")]
        public async Task<IActionResult> UpdateFileName(string filePath, string newPath)
        {
            System.IO.File.Move(filePath, newPath);
            return Ok();
        }
        
        [HttpPost("UploadFile")]
        [RequestSizeLimit(long.MaxValue)]
        public async Task<IActionResult> UploadFile(IFormFile file, string path)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest("No file received.");

                if (string.IsNullOrEmpty(path))
                    return BadRequest("Upload path missing.");

                string savePath = Path.Combine(path, file.FileName);
                int i = 0;
                while (System.IO.File.Exists(Path.Combine(path, Path.GetFileNameWithoutExtension(savePath), i == 0 ? "" : i.ToString(), Path.GetExtension(savePath))))
                {
                    i++;
                }
                
                savePath = Path.Combine(path, Path.GetFileNameWithoutExtension(savePath), i == 0 ? "" : i.ToString(), Path.GetExtension(savePath));
                    
                using (var stream = new FileStream(savePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Upload failed.");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
