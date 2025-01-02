using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace certificate_retrieval_be.Models.Dto
{
    public class EnrollmentsCreateDTO
    {
        [Required] 
        public string StudentID { get; set; }

        [Required] 
        public int CourseID { get; set; }

        [Required]
        public DateTime EnrollmentDate { get; set; }

        [Required]
        [Column(TypeName = "decimal(4, 2)")]
        public decimal FinalTestScore { get; set; }
    }
}
