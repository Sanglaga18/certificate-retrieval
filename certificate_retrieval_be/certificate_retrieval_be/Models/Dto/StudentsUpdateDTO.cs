using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace certificate_retrieval_be.Models.Dto
{
    public class StudentsUpdateDTO
    {
        [Key]
        [StringLength(50)]
        public string StudentID { get; set; }

        public IFormFile? Image { get; set; }

        public IFormFile? FrontIdCard { get; set; }

        public IFormFile? BackIdCard { get; set; }
    }
}
