using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace certificate_retrieval_be.Models
{
    public class ExamResults
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ResultID { get; set; }

        [ForeignKey("Exams")]
        public int ExamID { get; set; }

        public Exams Exam { get; set; }

        [ForeignKey("Students")]
        public string StudentID { get; set; }

        public Students Student { get; set; }

        [Required]
        [Column(TypeName = "decimal(4, 2)")]
        public decimal MarksObtained { get; set; }

        [Required]
        [StringLength(50)]
        public string ExamStatus { get; set; }
    }
}
