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

        public string FolderPath;

        public Folder(string name, bool isPublic, string? description, string folderPath)
        {
            folderData = new FolderDto(name, description);
            IsPublic = isPublic;

            subfolders = new List<string>();
            fileList = new List<FileModel>();

            FolderPath = folderPath;

            loadFilesAsObjects(FolderPath);
            foreach (var dir in Directory.GetDirectories(FolderPath))
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

        public string GetJson()
        {
            string json;
            json = "{ \"Subfolders\": ";
            json += JsonSerializer.Serialize(subfolders);
            json += ", \"Files\": ";
            json += JsonSerializer.Serialize(fileList);
            json += "}";
            return json;
        }

        public string GetSubfolders()
        {
            string json;
            json = "{ \"Name\": \"" + folderData.Name + "\", \"Subfolders\": [";
            for (int i = 0; i < subfolders.Count(); i++)
            {
                if (i > 0) json += ",";
                json += new Folder(subfolders[i], false, null, FolderPath + Path.DirectorySeparatorChar + subfolders[i]).GetSubfolders();
            }
            json += "]}";
            return json;
        }
    }
}
