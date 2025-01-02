using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace certificate_retrieval_be.Models
{
    public class Teachers
    {
        [Key]
        [StringLength(50)]
        public string TeacherID { get; set; }

        [ForeignKey("Users")]
        public int UserID { get; set; }

        public Users User { get; set; }

        public DateTime? HireDate { get; set; }

        [StringLength(100)]
        public string? Department { get; set; }
    }
}
