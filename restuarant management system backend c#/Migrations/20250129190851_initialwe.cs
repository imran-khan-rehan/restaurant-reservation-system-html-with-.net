using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace restuarant_management_system.Migrations
{
    /// <inheritdoc />
    public partial class initialwe : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "BookTables",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserId",
                table: "BookTables");
        }
    }
}
