using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Atelje.Migrations
{
    /// <inheritdoc />
    public partial class AddLastSentEmailAtToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastEmailSentAt",
                table: "AspNetUsers",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastEmailSentAt",
                table: "AspNetUsers");
        }
    }
}
