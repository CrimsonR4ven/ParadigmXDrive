using ParadigmXDrive.Server.Types;
using System.Text.Json;

namespace ParadigmXDrive.Server.Models
{
    public class Folder
    {
        public FolderDto folderData;
        public DateTime Created;
        public bool IsPublic;

        public List<String> Subfolders;
        public List<FileDto> FileList;

        public string Path;

        public Folder(string name, bool isPublic, string? description, string path)
        {
            folderData = new FolderDto(name, description);
            IsPublic = isPublic;

            Subfolders = new List<string>();
            FileList = new List<FileDto>();

            Path = path;

            Populate(Path);
            foreach (var dir in Directory.GetDirectories(Path))
            {
                Subfolders.Add(dir[dir.LastIndexOf('/')..]);
            }
        }

        private void Populate(string path)
        {
            string[] files = Directory.GetFiles(path);

            foreach (string file in files)
            {
                FileList.Add(new FileDto(file[file.LastIndexOf('/')..]));
            }
        }

        public string? GetJson(List<string> folderPath)
        {
            string? json;
            if (folderPath.Count == 1)
            {
                json = "{ \"Subfolders\": ";
                json += JsonSerializer.Serialize(Subfolders);
                json += ", \"Files\": ";
                json += JsonSerializer.Serialize(FileList);
                json += "}";
                return json;
            }
            else
            {
                folderPath.RemoveAt(0);
                foreach (var folder in Subfolders)
                {
                    if (folder.folderData.Name == folderPath[0])
                    {
                        return folder.GetJson(folderPath);
                    }

                }
                return null;
            }
        }
    }
}
