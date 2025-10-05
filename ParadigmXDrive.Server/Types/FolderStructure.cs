using ParadigmXDrive.Server.Models;

namespace ParadigmXDrive.Server.Types
{
    public class FolderStructure
    {
        public static string BasePath;

        public Folder BaseFolder;

        public FolderStructure(string driveFolderPath)
        {
            var indexOfLastSeparator = driveFolderPath.LastIndexOf('/');
            BasePath = driveFolderPath[..indexOfLastSeparator];
            BaseFolder = new Folder(driveFolderPath[indexOfLastSeparator..], false, null, null);
        }

        public string? GetFolder(string folderPath)
        {
            var folderPathTab = folderPath[1..].Split('/').Select(s => '/' + s).ToList();
            if (folderPathTab[0] != BaseFolder.folderData.Name) return null;
            return BaseFolder.GetJson(folderPathTab);
        }

        public string GetImageFile(string folderPath)
        {
            var filePath = BasePath + folderPath;
            return filePath;
        }

        public void ShowStructure()
        {
            BaseFolder?.Show(0);
        }
    }
}
