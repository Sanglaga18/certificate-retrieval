﻿using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace certificate_retrieval_be.Models.Dto
{
    public class UserUpdateDTO
    {
        [Required]
        public int UserID { get; set; }

        [StringLength(100)]
        public string FullName { get; set; }

        [StringLength(100)]
        [EmailAddress]
        public string Email { get; set; }

        [StringLength(15)]
        public string? Phone { get; set; }

        public DateTime DateOfBirth { get; set; }

        public bool IsActive { get; set; } = true;
    }
}