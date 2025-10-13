using ParadigmXDrive.Server.Models;

namespace ParadigmXDrive.Server.Types
{
    public class FolderStructure
    {
        public string BasePath;
        public Folder CurrFolder;

        public FolderStructure(string driveFolderPath)
        {
            var indexOfLastSeparator = driveFolderPath.LastIndexOf('/');
            BasePath = driveFolderPath[..indexOfLastSeparator];
            CurrFolder = new Folder(driveFolderPath[indexOfLastSeparator..], false, null, null);
        }

        public string? GetFolder(string folderPath)
        {
            if (!folderPath.Contains(BasePath)) return null;
            var folderPathTab = folderPath[1..].Split('/').Select(s => '/' + s).ToList();
            if (folderPathTab[0] != CurrFolder.folderData.Name) return null;
            return CurrFolder.GetJson(folderPathTab);
        }

        public string GetImageFile(string folderPath)
        {
            var filePath = BasePath + folderPath;
            return filePath;
        }

        public void TryLoadSubfolder(string subFolderName)
        {
            
        }
    }
}
