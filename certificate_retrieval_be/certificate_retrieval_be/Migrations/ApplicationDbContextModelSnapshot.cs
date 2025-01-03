﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using certificate_retrieval_be.Data;

#nullable disable

namespace certificate_retrieval_be.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("certificate_retrieval_be.Models.CertificateRegister", b =>
                {
                    b.Property<int>("CertificateRegisterID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CertificateRegisterID"));

                    b.Property<string>("ExamBoard")
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)");

                    b.Property<string>("IssuingInstitution")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)");

                    b.Property<string>("RegisterName")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)");

                    b.Property<string>("TrainingDuration")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("TrainingProgram")
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)");

                    b.HasKey("CertificateRegisterID");

                    b.ToTable("CertificateRegisters");
                });

            modelBuilder.Entity("certificate_retrieval_be.Models.Certificates", b =>
                {
                    b.Property<string>("CertificateID")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("CertificateName")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)");

                    b.Property<int>("CertificateRegisterID")
                        .HasColumnType("int");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("EnrollmentID")
                        .HasColumnType("int");

                    b.Property<string>("Image")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsValid")
                        .HasColumnType("bit");

                    b.Property<DateTime>("IssueDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("IssuingOrganization")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)");

                    b.Property<string>("RegistryNumber")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("CertificateID");

                    b.HasIndex("CertificateRegisterID");

                    b.HasIndex("EnrollmentID");

                    b.ToTable("Certificates");
                });

            modelBuilder.Entity("certificate_retrieval_be.Models.Courses", b =>
                {
                    b.Property<int>("CourseID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CourseID"));

                    b.Property<string>("CourseName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<DateTime>("EndDate")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("StartDate")
                        .HasColumnType("datetime2");

                    b.HasKey("CourseID");

                    b.ToTable("Courses");
                });

            modelBuilder.Entity("certificate_retrieval_be.Models.DiplomaRegister", b =>
                {
                    b.Property<int>("DiplomaRegisterID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("DiplomaRegisterID"));

                    b.Property<string>("ExamBoard")
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)");

                    b.Property<string>("IssuingInstitution")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)");

                    b.Property<string>("RegisterName")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)");

                    b.Property<string>("TrainingDuration")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("TrainingProgram")
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)");

                    b.HasKey("DiplomaRegisterID");

                    b.ToTable("DiplomaRegisters");
                });

            modelBuilder.Entity("certificate_retrieval_be.Models.Diplomas", b =>
                {
                    b.Property<string>("DiplomaNumber")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("DiplomaName")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)");

                    b.Property<int>("DiplomaRegisterID")
                        .HasColumnType("int");

                    b.Property<int?>("ExamResultID")
                        .HasColumnType("int");

                    b.Property<string>("Image")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsValid")
                        .HasColumnType("bit");

                    b.Property<DateTime>("IssueDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("IssuingOrganization")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)");

                    b.Property<string>("RegistryNumber")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("DiplomaNumber");

                    b.HasIndex("DiplomaRegisterID");

                    b.HasIndex("ExamResultID");

                    b.ToTable("Diplomas");
                });

            modelBuilder.Entity("certificate_retrieval_be.Models.Enrollments", b =>
                {
                    b.Property<int>("EnrollmentID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("EnrollmentID"));

                    b.Property<int>("CourseID")
                        .HasColumnType("int");

                    b.Property<DateTime>("EnrollmentDate")
                        .HasColumnType("datetime2");

                    b.Property<decimal>("FinalTestScore")
                        .HasColumnType("decimal(4, 2)");

                    b.Property<string>("StudentID")
                        .IsRequired()
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("EnrollmentID");

                    b.HasIndex("CourseID");

                    b.HasIndex("StudentID");

                    b.ToTable("Enrollments");
                });

            modelBuilder.Entity("certificate_retrieval_be.Models.ExamResults", b =>
                {
                    b.Property<int>("ResultID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ResultID"));

                    b.Property<int>("ExamID")
                        .HasColumnType("int");

                    b.Property<string>("ExamStatus")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<decimal>("MarksObtained")
                        .HasColumnType("decimal(4, 2)");

                    b.Property<string>("StudentID")
                        .IsRequired()
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("ResultID");

                    b.HasIndex("ExamID");

                    b.HasIndex("StudentID");

                    b.ToTable("ExamResults");
                });

            modelBuilder.Entity("certificate_retrieval_be.Models.Exams", b =>
                {
                    b.Property<int>("ExamID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ExamID"));

                    b.Property<DateTime>("ExamDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("ExamName")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)");

                    b.HasKey("ExamID");

                    b.ToTable("Exams");
                });

            modelBuilder.Entity("certificate_retrieval_be.Models.Members", b =>
                {
                    b.Property<string>("MemberID")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<DateTime?>("RegistrationDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("UserID")
                        .HasColumnType("int");

                    b.HasKey("MemberID");

                    b.HasIndex("UserID");

                    b.ToTable("Members");
                });

            modelBuilder.Entity("certificate_retrieval_be.Models.Roles", b =>
                {
                    b.Property<int>("RoleID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("RoleID"));

                    b.Property<string>("RoleName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("RoleID");

                    b.ToTable("Roles");

                    b.HasData(
                        new
                        {
                            RoleID = 1,
                            RoleName = "Member"
                        },
                        new
                        {
                            RoleID = 2,
                            RoleName = "Student"
                        },
                        new
                        {
                            RoleID = 3,
                            RoleName = "Teacher"
                        },
                        new
                        {
                            RoleID = 4,
                            RoleName = "Staff"
                        });
                });

            modelBuilder.Entity("certificate_retrieval_be.Models.Staffs", b =>
                {
                    b.Property<string>("StaffID")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<DateTime?>("StartDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("UserID")
                        .HasColumnType("int");

                    b.HasKey("StaffID");

                    b.HasIndex("UserID");

                    b.ToTable("Staffs");
                });

            modelBuilder.Entity("certificate_retrieval_be.Models.Students", b =>
                {
                    b.Property<string>("StudentID")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("BackIdCard")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FrontIdCard")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Image")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("UserID")
                        .HasColumnType("int");

                    b.HasKey("StudentID");

                    b.HasIndex("UserID");

                    b.ToTable("Students");
                });

            modelBuilder.Entity("certificate_retrieval_be.Models.Teachers", b =>
                {
                    b.Property<string>("TeacherID")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("Department")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<DateTime?>("HireDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("UserID")
                        .HasColumnType("int");

                    b.HasKey("TeacherID");

                    b.HasIndex("UserID");

                    b.ToTable("Teachers");
                });

            modelBuilder.Entity("certificate_retrieval_be.Models.Users", b =>
                {
                    b.Property<int>("UserID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("UserID"));

                    b.Property<DateTime?>("DateOfBirth")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<bool>("IsActive")
                        .HasColumnType("bit");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)");

                    b.Property<string>("Phone")
                        .HasMaxLength(15)
                        .HasColumnType("nvarchar(15)");

                    b.Property<int?>("RoleID")
                        .HasColumnType("int");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("UserID");

                    b.HasIndex("RoleID");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("certificate_retrieval_be.Models.Certificates", b =>
                {
                    b.HasOne("certificate_retrieval_be.Models.CertificateRegister", "CertificateRegister")
                        .WithMany()
                        .HasForeignKey("CertificateRegisterID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("certificate_retrieval_be.Models.Enrollments", "Enrollment")
                        .WithMany()
                        .HasForeignKey("EnrollmentID");

                    b.Navigation("CertificateRegister");

                    b.Navigation("Enrollment");
                });

            modelBuilder.Entity("certificate_retrieval_be.Models.Diplomas", b =>
                {
                    b.HasOne("certificate_retrieval_be.Models.DiplomaRegister", "DiplomaRegister")
                        .WithMany()
                        .HasForeignKey("DiplomaRegisterID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("certificate_retrieval_be.Models.ExamResults", "ExamResult")
                        .WithMany()
                        .HasForeignKey("ExamResultID");

                    b.Navigation("DiplomaRegister");

                    b.Navigation("ExamResult");
                });

            modelBuilder.Entity("certificate_retrieval_be.Models.Enrollments", b =>
                {
                    b.HasOne("certificate_retrieval_be.Models.Courses", "Course")
                        .WithMany()
                        .HasForeignKey("CourseID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("certificate_retrieval_be.Models.Students", "Student")
                        .WithMany()
                        .HasForeignKey("StudentID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Course");

                    b.Navigation("Student");
                });

            modelBuilder.Entity("certificate_retrieval_be.Models.ExamResults", b =>
                {
                    b.HasOne("certificate_retrieval_be.Models.Exams", "Exam")
                        .WithMany()
                        .HasForeignKey("ExamID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("certificate_retrieval_be.Models.Students", "Student")
                        .WithMany()
                        .HasForeignKey("StudentID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Exam");

                    b.Navigation("Student");
                });

            modelBuilder.Entity("certificate_retrieval_be.Models.Members", b =>
                {
                    b.HasOne("certificate_retrieval_be.Models.Users", "User")
                        .WithMany()
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("certificate_retrieval_be.Models.Staffs", b =>
                {
                    b.HasOne("certificate_retrieval_be.Models.Users", "User")
                        .WithMany()
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("certificate_retrieval_be.Models.Students", b =>
                {
                    b.HasOne("certificate_retrieval_be.Models.Users", "User")
                        .WithMany()
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("certificate_retrieval_be.Models.Teachers", b =>
                {
                    b.HasOne("certificate_retrieval_be.Models.Users", "User")
                        .WithMany()
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("certificate_retrieval_be.Models.Users", b =>
                {
                    b.HasOne("certificate_retrieval_be.Models.Roles", "Role")
                        .WithMany()
                        .HasForeignKey("RoleID");

                    b.Navigation("Role");
                });
#pragma warning restore 612, 618
        }
    }
}
