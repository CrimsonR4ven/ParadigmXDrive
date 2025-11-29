namespace ParadigmXDrive.Server.Services;

public class VirtualDriveWatcherService
{
    public static List<VirtualDriveWatcher> VirtualDrives = new List<VirtualDriveWatcher>();
    
    //TODO: connect to database
    private static List<string> DiskPaths = new List<string>()
    {
        "/media/pi/Extreme SSD"
    };
    
    public static void LoadVirtualDrives()
    {
        VirtualDrives = new List<VirtualDriveWatcher>();
        foreach (var path in DiskPaths)
        {
            VirtualDrives.Add(new VirtualDriveWatcher(path));
        }

        Console.WriteLine("Drives loaded");
    }
}