using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace certificate_retrieval_be.Models.Dto
{
    public class RoleCreateDTO
    {
        [Required]
        [StringLength(50)]
        public string RoleName { get; set; }
    }
}
