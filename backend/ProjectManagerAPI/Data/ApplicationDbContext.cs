using Microsoft.EntityFrameworkCore;
using ProjectManagerAPI.Models;

namespace ProjectManagerAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectTask> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Username).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();
            });

            // Configure Project entity
            modelBuilder.Entity<Project>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(p => p.User)
                      .WithMany(u => u.Projects)
                      .HasForeignKey(p => p.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure ProjectTask entity
            modelBuilder.Entity<ProjectTask>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(t => t.Project)
                      .WithMany(p => p.Tasks)
                      .HasForeignKey(t => t.ProjectId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}