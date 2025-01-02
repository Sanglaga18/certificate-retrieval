using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace certificate_retrieval_be.Models.Dto
{
    public class DiplomaUpdateDTO
    {
        [Required]
        public string DiplomaNumber { get; set; }

        [Required]
        [StringLength(50)]
        public string RegistryNumber { get; set; }

        [Required]
        public int DiplomaRegisterID { get; set; }

        [Required]
        [StringLength(255)]
        public string DiplomaName { get; set; }

        [Required]
        public DateTime IssueDate { get; set; }

        [Required]
        public bool IsValid { get; set; }

        [Required]
        public string IssuingOrganization { get; set; }

        [Required]
        public int ExamResultID { get; set; }

        public IFormFile? File { get; set; }

        public string? Description { get; set; }
    }
}
