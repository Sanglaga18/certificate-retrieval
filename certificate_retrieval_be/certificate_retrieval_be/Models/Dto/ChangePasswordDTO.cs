using System.ComponentModel.DataAnnotations;

namespace certificate_retrieval_be.Models.Dto
{
    public class ChangePasswordDTO
    {
        [Required]
        public int UserID { get; set; }

        [Required]
        [StringLength(255)]
        public string OldPassword { get; set; }

        [Required]
        [StringLength(255)]
        public string NewPassword { get; set; }
    }
}
