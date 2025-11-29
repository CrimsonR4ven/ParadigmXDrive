using ParadigmXDrive.Server.Models;

namespace ParadigmXDrive.Server.Services;

public class VirtualDriveWatcher
{
    public string BasePath;
    public VirtualDriveFolderNode FolderStructure;
    public FileSystemWatcher Watcher;

    public VirtualDriveWatcher(string basePath)
    {
        BasePath = basePath;
        FolderStructure = new VirtualDriveFolderNode(BasePath);

        Watcher = new FileSystemWatcher(BasePath)
        {
            IncludeSubdirectories = true,
            NotifyFilter = NotifyFilters.DirectoryName | NotifyFilters.FileName
        };

        Watcher.Created += OnCreated;
        Watcher.Deleted += OnDeleted;
        Watcher.Renamed += OnRenamed;

        Watcher.EnableRaisingEvents = true;
    }

    private void OnCreated(object sender, FileSystemEventArgs e)
    {
        if (Directory.Exists(e.FullPath))
        {
            FolderStructure.AddFolder(e.FullPath);
        }
    }

    private void OnDeleted(object sender, FileSystemEventArgs e)
    {
        FolderStructure.RemoveFolder(e.FullPath);
    }

    private void OnRenamed(object sender, RenamedEventArgs e)
    {
        FolderStructure.RenameFolder(e.OldFullPath, e.FullPath);
    }
    
}