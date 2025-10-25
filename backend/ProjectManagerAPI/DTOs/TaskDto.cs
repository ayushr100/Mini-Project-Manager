using System.ComponentModel.DataAnnotations;

namespace ProjectManagerAPI.DTOs
{
    public class CreateTaskDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public DateTime? DueDate { get; set; }

        [Range(0.1, 1000, ErrorMessage = "Estimated hours must be between 0.1 and 1000")]
        public double? EstimatedHours { get; set; }

        public string? Dependencies { get; set; } // JSON string of task titles
    }

    public class UpdateTaskDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public DateTime? DueDate { get; set; }

        public bool IsCompleted { get; set; }

        [Range(0.1, 1000, ErrorMessage = "Estimated hours must be between 0.1 and 1000")]
        public double? EstimatedHours { get; set; }

        public string? Dependencies { get; set; } // JSON string of task titles
    }

    public class TaskDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public int ProjectId { get; set; }
        public double? EstimatedHours { get; set; }
        public string? Dependencies { get; set; }
    }

    // Smart Scheduler DTOs
    public class TaskScheduleDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [Range(0.1, 1000, ErrorMessage = "Estimated hours must be between 0.1 and 1000")]
        public double EstimatedHours { get; set; }

        [Required]
        public DateTime DueDate { get; set; }

        public List<string> Dependencies { get; set; } = new List<string>();
    }

    public class ScheduleRequestDto
    {
        [Required]
        public List<TaskScheduleDto> Tasks { get; set; } = new List<TaskScheduleDto>();
    }

    public class ScheduleResponseDto
    {
        public List<string> RecommendedOrder { get; set; } = new List<string>();
        public string? Message { get; set; }
        public bool IsValid { get; set; } = true;
    }
}