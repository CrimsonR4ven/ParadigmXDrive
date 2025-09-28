namespace ParadigmXDrive.Server.Models
{
    public class FolderDto
    {
        public string Name { get; set; }
        public string Description { get; set; }

        public FolderDto(string name, string? description)
        {
            Name = name;
            Description = description != null ? description : String.Empty;
        }
    }
}
