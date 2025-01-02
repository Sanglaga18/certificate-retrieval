using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace certificate_retrieval_be.Models
{
    public class Staffs
    {
        [Key]
        [StringLength(50)]
        public string StaffID { get; set; }

        [ForeignKey("Users")]
        public int UserID { get; set; }

        public Users User { get; set; }

        public DateTime? StartDate { get; set; }
    }
}
