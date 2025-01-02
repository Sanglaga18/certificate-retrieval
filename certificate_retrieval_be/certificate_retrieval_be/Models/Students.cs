using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace certificate_retrieval_be.Models
{
    public class Students
    {
        [Key]
        [StringLength(50)]
        public string StudentID { get; set; }

        [ForeignKey("Users")]
        public int UserID { get; set; }

        public Users User { get; set; }

        public string? Image { get; set; }

        public string? FrontIdCard { get; set; }

        public string? BackIdCard { get; set; }
    }
}
