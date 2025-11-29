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
        
    }
}