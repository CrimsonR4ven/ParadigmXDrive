using ParadigmXDrive.Server.Types;
using System.Text.Json;

namespace ParadigmXDrive.Server.Models
{
    public class Folder
    {
        public FolderDto folderData;
        public DateTime Created;
        public bool IsPublic;

        private List<String> subfolders;
        private List<FileModel> fileList;

        public string Path;

        public Folder(string name, bool isPublic, string? description, string path)
        {
            folderData = new FolderDto(name, description);
            IsPublic = isPublic;

            subfolders = new List<string>();
            fileList = new List<FileModel>();

            Path = path;

            loadFilesAsObjects(Path);
            foreach (var dir in Directory.GetDirectories(Path))
            {
                subfolders.Add(dir[dir.LastIndexOf('/')..]);
            }
        }

        private void loadFilesAsObjects(string path)
        {
            string[] files = Directory.GetFiles(path);

            foreach (string file in files)
            {
                fileList.Add(new FileModel(file[file.LastIndexOf('/')..]));
            }
        }

        public string? GetJson()
        {
            string? json;
            json = "{ \"Subfolders\": ";
            json += JsonSerializer.Serialize(subfolders);
            json += ", \"Files\": ";
            json += JsonSerializer.Serialize(fileList);
            json += "}";
            return json;
        }
    }
}
