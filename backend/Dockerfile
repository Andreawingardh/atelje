# ----------------------------
# 1. Build stage
# ----------------------------
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy solution file and all backend files into the container
COPY backend.sln ./
COPY ./ ./ 

# Restore dependencies
RUN dotnet restore ./backend.sln

# Publish the main project (no restore since already done)
RUN dotnet publish ./Atelje/Atelje.csproj -c Release -o /app/publish --no-restore

# ----------------------------
# 2. Runtime stage
# ----------------------------
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

# Copy the published app from the build stage
COPY --from=build /app/publish .

# Expose port (adjust if your app listens on a different port)
EXPOSE 8080

# Start the app
ENTRYPOINT ["dotnet", "Atelje.dll"]
