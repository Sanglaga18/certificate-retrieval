using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace certificate_retrieval_be.Models.Dto
{
    public class CertificatesDTO
    {
        [Required]
        public string CertificateID { get; set; }

        [Required]
        [StringLength(50)]
        public string RegistryNumber { get; set; }

        [Required]
        public int CertificateRegisterID { get; set; }

        [Required]
        [StringLength(255)]
        public string CertificateName { get; set; }

        [Required]
        public DateTime IssueDate { get; set; }

        [Required]
        public bool IsValid { get; set; } = true;

        [Required]
        [StringLength(255)]
        public string IssuingOrganization { get; set; }

        public int? EnrollmentID { get; set; }

        public IFormFile? File { get; set; }

        public string? Description { get; set; }
    }
}
