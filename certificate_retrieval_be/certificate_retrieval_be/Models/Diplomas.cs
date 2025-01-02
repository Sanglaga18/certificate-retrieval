using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace certificate_retrieval_be.Models
{
    public class Diplomas
    {
        [Key]
        [StringLength(50)]
        public string DiplomaNumber { get; set; }

        [Required]
        [StringLength(50)]
        public string RegistryNumber { get; set; }

        [ForeignKey("DiplomaRegister")]
        public int DiplomaRegisterID { get; set; }

        public DiplomaRegister DiplomaRegister { get; set; }

        [Required]
        [StringLength(255)]
        public string DiplomaName { get; set; }

        [Required]
        public DateTime IssueDate { get; set; }

        public bool IsValid { get; set; } = true;

        [Required]
        [StringLength(255)]
        public string IssuingOrganization { get; set; }

        [ForeignKey("ExamResults")]
        public int? ExamResultID { get; set; }

        public ExamResults ExamResult { get; set; }

        [Required]
        public string Image { get; set; }

        public string? Description { get; set; }
    }
}
