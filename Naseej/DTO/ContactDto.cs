namespace Naseej.DTO
{
    public class ContactDto
    {
        public long Id { get; set; }
        public string? SenderName { get; set; }
        public string SenderEmail { get; set; }
        public string? Subject { get; set; }
        public string? Message { get; set; }
        public string? Status { get; set; }
        public AdminReplyDto ar { get; set; }
    }

    public class AdminReplyDto
    {
        public long Id { get; set; }
        public string? Subject { get; set; }
        public string? Message { get; set; }
        public string? Status { get; set; }
    }

}
