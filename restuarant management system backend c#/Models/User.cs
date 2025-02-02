namespace restuarant_management_system.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; } // "User" or "Admin"
        public DateTime CreatedAt { get; set; }
    }
}
