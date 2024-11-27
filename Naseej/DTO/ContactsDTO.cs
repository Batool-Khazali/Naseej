namespace Naseej.DTO
{
    public class ContactsDTO
    {
        public string? SenderName { get; set; }

        public string SenderEmail { get; set; } = null!;

        public string? Subject { get; set; }

        public string? Message { get; set; }

        public string? Status { get; set; }
    }
}
