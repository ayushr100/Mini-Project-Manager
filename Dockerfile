# Railway Dockerfile for .NET 8 Project Manager API
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files
COPY ["backend/ProjectManagerAPI/ProjectManagerAPI.csproj", "backend/ProjectManagerAPI/"]
RUN dotnet restore "backend/ProjectManagerAPI/ProjectManagerAPI.csproj"

# Copy all source code
COPY . .
WORKDIR "/src/backend/ProjectManagerAPI"

# Build the application
RUN dotnet build "ProjectManagerAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ProjectManagerAPI.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create directory for SQLite database
RUN mkdir -p /app/Data

# Set environment variables
ENV ASPNETCORE_ENVIRONMENT=Production

# Railway will set PORT environment variable automatically
ENTRYPOINT ["dotnet", "ProjectManagerAPI.dll"]