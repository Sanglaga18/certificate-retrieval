using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace certificate_retrieval_be.Models
{
    public class Certificates
    {
        [Key]
        [StringLength(50)]
        public string CertificateID { get; set; }

        [Required]
        [StringLength(50)]
        public string RegistryNumber { get; set; }

        [ForeignKey("CertificateRegister")]
        public int CertificateRegisterID { get; set; }

        public CertificateRegister CertificateRegister { get; set; }

        [Required]
        [StringLength(255)]
        public string CertificateName { get; set; }

        [Required]
        public DateTime IssueDate { get; set; }

        public bool IsValid { get; set; } = true;

        [Required]
        [StringLength(255)]
        public string IssuingOrganization { get; set; }

        [ForeignKey("Enrollments")]
        public int? EnrollmentID { get; set; }

        public Enrollments Enrollment { get; set; }

        [Required]
        public string Image { get; set; }

        public string? Description { get; set; }
    }
}
