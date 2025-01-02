using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Data;

namespace certificate_retrieval_be.Models
{
    public class Users
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserID { get; set; }

        [Required]
        [StringLength(50)]
        public string Username { get; set; }

        [Required]
        [StringLength(255)]
        public string Password { get; set; }

        [Required]
        [StringLength(100)]
        public string FullName { get; set; }

        [Required]
        [StringLength(100)]
        [EmailAddress]
        public string Email { get; set; }

        [StringLength(15)]
        public string? Phone { get; set; }

        [Required]
        public DateTime DateOfBirth { get; set; } = DateTime.Today;

        [Required]
        [ForeignKey("Role")]
        public int RoleID { get; set; } = 1;

        public Roles Role { get; set; }

        public bool IsActive { get; set; } = true;
        
    }
}
