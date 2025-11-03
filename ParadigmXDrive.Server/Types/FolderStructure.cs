using ParadigmXDrive.Server.Models;

namespace ParadigmXDrive.Server.Types
{
    public class FolderStructure
    {
        public string BasePath;
        private Folder currFolder;

        public FolderStructure(string driveFolderPath)
        {
            var indexOfLastSeparator = driveFolderPath.LastIndexOf(Path.DirectorySeparatorChar);
            BasePath = driveFolderPath[..indexOfLastSeparator];
            currFolder = new Folder(Path.GetDirectoryName(driveFolderPath), false, null, driveFolderPath);
        }

        public string? GetFolderData(string folderPath /*, int senderID*/)
        {
            if (!Directory.Exists(folderPath)) return null;
            if (currFolder.Path != folderPath) loadFolder(folderPath);
            return currFolder.GetJson();
        }
        
        private void loadFolder(string newFolderPath /*, int senderID*/)
        {
            // if (!newFolderPath.Contains(BasePath)) return null; TODO: Handle Access rights / AFTER LOG IN IS FINISHED
            var folderName = Path.GetDirectoryName(newFolderPath);
            currFolder = new Folder(folderName, false, null, newFolderPath);
        }
        
        public string GetFilePath(string fileName)
        {
            return currFolder.Path + Path.DirectorySeparatorChar + fileName;
        }
    }
}
