using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace certificate_retrieval_be.Models.Dto
{
    public class ExamResultsUpdateDTO
    {
        [Required]
        public int ResultID { get; set; }

        [Required]
        public string StudentID { get; set; }

        [Required]
        public int ExamID { get; set; }

        [Required]
        [Column(TypeName = "decimal(4, 2)")]
        public decimal MarksObtained { get; set; }

        [Required]
        [StringLength(50)]
        public string ExamStatus { get; set; }
    }
}
