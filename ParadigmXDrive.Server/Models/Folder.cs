using ParadigmXDrive.Server.Types;
using System.Text.Json;

namespace ParadigmXDrive.Server.Models
{
    public class Folder
    {
        public FolderDto folderData;
        public DateTime Created;
        public bool IsPublic;

        public List<Folder> Next;
        public List<FileDto> FileList;

        public Folder? Prev;

        public string Path => Prev != null ? Prev.Path + folderData.Name : folderData.Name;

        public Folder(string name, bool isPublic, string? description, Folder? prev)
        {
            folderData = new FolderDto(name, description);
            IsPublic = isPublic;

            Next = new List<Folder>();
            FileList = new List<FileDto>();

            Prev = prev;

            Populate(FolderStructure.BasePath + Path);
            foreach (var dir in Directory.GetDirectories(FolderStructure.BasePath + Path))
            {
                Next.Add(new Folder(dir[dir.LastIndexOf('\\')..], false, null, this));
            }
        }

        private void Populate(string path)
        {
            string[] files = Directory.GetFiles(path);

            foreach (string file in files)
            {
                FileList.Add(new FileDto(file[file.LastIndexOf('\\')..]));
            }
        }

        public void Show(int indent)
        {
            for (int i = 0; i < indent; i++)
            {
                Console.Write(" ");
            }
            Console.Write($"{folderData.Name}\n");
            foreach (var folder in Next)
            {
                folder.Show(indent + 1);
            }
            foreach (var file in FileList)
            {
                for (int i = 0; i < indent + 1; i++)
                {
                    Console.Write(" ");
                }
                Console.Write($"{file.Name[1..]}\n");
            }
        }

        public string? GetJson(List<string> folderPath)
        {
            string? json;
            if (folderPath.Count == 1)
            {
                json = "{ \"Subfolders\": ";
                var subfolderList = new List<FolderDto>();
                foreach (var subfolder in Next)
                {
                    subfolderList.Add(subfolder.folderData);
                }
                json += JsonSerializer.Serialize(subfolderList);
                json += ", \"Files\": ";
                json += JsonSerializer.Serialize(FileList);
                json += "}";
                return json;
            }
            else
            {
                folderPath.RemoveAt(0);
                foreach (var folder in Next)
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
