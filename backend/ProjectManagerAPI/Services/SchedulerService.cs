using ProjectManagerAPI.DTOs;

namespace ProjectManagerAPI.Services
{
    public class SchedulerService : ISchedulerService
    {
        public ScheduleResponseDto ScheduleTasks(ScheduleRequestDto request)
        {
            try
            {
                if (request.Tasks == null || !request.Tasks.Any())
                {
                    return new ScheduleResponseDto
                    {
                        IsValid = false,
                        Message = "No tasks provided for scheduling."
                    };
                }

                // Validate task dependencies exist
                var taskTitles = request.Tasks.Select(t => t.Title).ToHashSet();
                foreach (var task in request.Tasks)
                {
                    foreach (var dependency in task.Dependencies)
                    {
                        if (!taskTitles.Contains(dependency))
                        {
                            return new ScheduleResponseDto
                            {
                                IsValid = false,
                                Message = $"Dependency '{dependency}' not found in task list for task '{task.Title}'."
                            };
                        }
                    }
                }

                // Perform topological sort with deadline consideration
                var scheduledOrder = TopologicalSortWithDeadlines(request.Tasks);

                if (scheduledOrder == null)
                {
                    return new ScheduleResponseDto
                    {
                        IsValid = false,
                        Message = "Circular dependency detected. Cannot schedule tasks."
                    };
                }

                return new ScheduleResponseDto
                {
                    RecommendedOrder = scheduledOrder,
                    IsValid = true,
                    Message = "Tasks scheduled successfully."
                };
            }
            catch (Exception ex)
            {
                return new ScheduleResponseDto
                {
                    IsValid = false,
                    Message = $"Error scheduling tasks: {ex.Message}"
                };
            }
        }

        private List<string>? TopologicalSortWithDeadlines(List<TaskScheduleDto> tasks)
        {
            // Create adjacency list and in-degree count
            var graph = new Dictionary<string, List<string>>();
            var inDegree = new Dictionary<string, int>();
            var taskMap = new Dictionary<string, TaskScheduleDto>();

            // Initialize graph
            foreach (var task in tasks)
            {
                graph[task.Title] = new List<string>();
                inDegree[task.Title] = 0;
                taskMap[task.Title] = task;
            }

            // Build graph based on dependencies
            foreach (var task in tasks)
            {
                foreach (var dependency in task.Dependencies)
                {
                    graph[dependency].Add(task.Title);
                    inDegree[task.Title]++;
                }
            }

            // Use priority queue to handle tasks with earliest deadlines first
            var queue = new PriorityQueue<string, DateTime>();
            
            // Add all tasks with no dependencies (in-degree 0) to queue
            foreach (var task in tasks)
            {
                if (inDegree[task.Title] == 0)
                {
                    queue.Enqueue(task.Title, task.DueDate);
                }
            }

            var result = new List<string>();
            var processedCount = 0;

            while (queue.Count > 0)
            {
                var currentTask = queue.Dequeue();
                result.Add(currentTask);
                processedCount++;

                // Process all tasks that depend on the current task
                foreach (var dependentTask in graph[currentTask])
                {
                    inDegree[dependentTask]--;
                    
                    // If all dependencies are satisfied, add to queue
                    if (inDegree[dependentTask] == 0)
                    {
                        queue.Enqueue(dependentTask, taskMap[dependentTask].DueDate);
                    }
                }
            }

            // Check for circular dependencies
            if (processedCount != tasks.Count)
            {
                return null; // Circular dependency detected
            }

            return result;
        }

        private bool ValidateScheduleFeasibility(List<string> schedule, Dictionary<string, TaskScheduleDto> taskMap)
        {
            var currentDate = DateTime.Now;
            var workingHoursPerDay = 8.0; // Assume 8 working hours per day

            foreach (var taskTitle in schedule)
            {
                var task = taskMap[taskTitle];
                var requiredDays = Math.Ceiling(task.EstimatedHours / workingHoursPerDay);
                var expectedCompletionDate = currentDate.AddDays(requiredDays);

                if (expectedCompletionDate > task.DueDate)
                {
                    // Task might not be completable by due date
                    // For now, we'll just log this but still return the order
                    // In a more sophisticated version, we could reorganize or warn
                }

                currentDate = expectedCompletionDate;
            }

            return true;
        }
    }
}