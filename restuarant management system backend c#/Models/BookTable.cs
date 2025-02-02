namespace restuarant_management_system.Models
{
    public class BookTable
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string TableName { get; set; }
        public string CustomerName { get; set; }

        public int TableId { get; set; }
        public int UserId { get; set; }  // Added foreign key

    }
}
