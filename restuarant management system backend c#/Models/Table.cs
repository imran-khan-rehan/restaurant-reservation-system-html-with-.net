namespace restuarant_management_system.Models
{
    public class Table
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public DateTime DateOfAvailability { get; set; }

        public int RestaurantId { get; set; }
    }
}
