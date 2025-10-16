# ----------------------------
# 1. Build stage
# ----------------------------
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy everything (so restore can resolve project references)
COPY backend/backend.sln ./
COPY backend/ ./backend/

# Restore and publish in release mode
RUN dotnet restore ./backend/backend.sln
RUN dotnet publish ./backend/Atelje/Atelje.csproj -c Release -o /app/publish

# ----------------------------
# 2. Runtime stage
# ----------------------------
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .

# Replace MyProject.dll with your real entry DLL name
ENTRYPOINT ["dotnet", "Atelje.dll"]
