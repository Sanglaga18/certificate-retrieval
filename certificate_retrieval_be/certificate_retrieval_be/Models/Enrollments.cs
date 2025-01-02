using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace certificate_retrieval_be.Models
{
    public class Enrollments
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int EnrollmentID { get; set; }

        [ForeignKey("Students")]
        public string StudentID { get; set; }

        public Students Student { get; set; }

        [ForeignKey("Courses")]
        public int CourseID { get; set; }

        public Courses Course { get; set; }

        [Required]
        public DateTime EnrollmentDate { get; set; }

        [Required]
        [Column(TypeName = "decimal(4, 2)")]
        public decimal FinalTestScore { get; set; }
    }
}
