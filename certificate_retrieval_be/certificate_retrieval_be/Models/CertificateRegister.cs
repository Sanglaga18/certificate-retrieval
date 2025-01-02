using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace certificate_retrieval_be.Models
{
    public class CertificateRegister
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CertificateRegisterID { get; set; }

        [Required]
        [StringLength(255)]
        public string RegisterName { get; set; }

        [Required]
        [StringLength(255)]
        public string IssuingInstitution { get; set; }

        [StringLength(255)]
        public string? TrainingProgram { get; set; }

        [StringLength(100)]
        public string? TrainingDuration { get; set; }

        [StringLength(255)]
        public string? ExamBoard { get; set; }
    }
}
