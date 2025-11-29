namespace ParadigmXDrive.Server.Models;

public class VirtualDriveFolderNode
{
    private string name;
    private string path;
    private List<VirtualDriveFolderNode> subfolders;

    public VirtualDriveFolderNode(string path)
    {
        this.name = Path.GetDirectoryName(path);
        this.path = path;
        foreach (var dir in Directory.GetDirectories(path))
        {
            subfolders.Add(new VirtualDriveFolderNode(dir));
        }
    } 
    
    public VirtualDriveFolderNode? Find(string fullPath)
    {
        if (path == fullPath)
            return this;

        foreach (var sub in subfolders)
        {
            var result = sub.Find(fullPath);
            if (result != null)
                return result;
        }

        return null;
    }
    
    public void AddFolder(string folderPath)
    {
        string? parent = Directory.GetParent(folderPath)?.FullName;
        if (parent == null) return;

        var parentNode = Find(parent);
        if (parentNode == null) return;

        parentNode.subfolders.Add(new VirtualDriveFolderNode(folderPath));
    }
    
    public void RemoveFolder(string folderPath)
    {
        var parent = Directory.GetParent(folderPath)?.FullName;
        if (parent == null) return;

        var parentNode = Find(parent);
        if (parentNode == null) return;

        var toRemove = parentNode.subfolders
            .FirstOrDefault(x => x.path == folderPath);

        if (toRemove != null)
            parentNode.subfolders.Remove(toRemove);
    }
    
    public void RenameFolder(string oldPath, string newPath)
    {
        var node = Find(oldPath);
        if (node == null) return;

        node.path = newPath;
        node.name = Path.GetFileName(newPath);
    }
    
    public string GetSubfolders()
    {
        string json;
        json = "{ \"Name\": \"" + name + "\", \"Subfolders\": [";
        for (int i = 0; i < subfolders.Count(); i++)
        {
            if (i > 0) json += ",";
            json += subfolders[i].GetSubfolders();
        }
        json += "]}";
        return json;
    }
}