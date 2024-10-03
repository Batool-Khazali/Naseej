namespace Naseej.DTO
{
    public class ResetPasswordDTO
    {
        public long Id { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
