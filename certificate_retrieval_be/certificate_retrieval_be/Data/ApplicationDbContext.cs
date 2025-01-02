
using certificate_retrieval_be.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace certificate_retrieval_be.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options)
            : base(options)
        {
        }

        public DbSet<Users> Users { get; set; }
        public DbSet<Roles> Roles { get; set; }
        public DbSet<Staffs> Staffs { get; set; }
        public DbSet<Members> Members { get; set; }
        public DbSet<Teachers> Teachers { get; set; }
        public DbSet<Students> Students { get; set; }
        public DbSet<Courses> Courses { get; set; }
        public DbSet<Enrollments> Enrollments { get; set; }
        public DbSet<Exams> Exams { get; set; }
        public DbSet<ExamResults> ExamResults { get; set; }
        public DbSet<CertificateRegister> CertificateRegisters { get; set; }
        public DbSet<Certificates> Certificates { get; set; }
        public DbSet<DiplomaRegister> DiplomaRegisters { get; set; }
        public DbSet<Diplomas> Diplomas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Roles>().HasData(
                new Roles { RoleID = 1, RoleName = "Member" },
                new Roles { RoleID = 2, RoleName = "Student" },
                new Roles { RoleID = 3, RoleName = "Teacher" },
                new Roles { RoleID = 4, RoleName = "Staff" }
            );
        }
    }
}
