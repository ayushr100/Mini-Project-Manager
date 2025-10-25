using ProjectManagerAPI.DTOs;

namespace ProjectManagerAPI.Services
{
    public interface ISchedulerService
    {
        ScheduleResponseDto ScheduleTasks(ScheduleRequestDto request);
    }
}