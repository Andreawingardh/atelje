# xUnit Testing Guide for Backend (.NET 9)

## Setup Overview

This project uses xUnit with Moq for unit testing C# Web API controllers and services, with Entity Framework Core in-memory databases for data access testing.

**Key Technologies:**
- xUnit 2.4.2+
- Moq 4.20.70+
- Microsoft.EntityFrameworkCore.InMemoryDatabase
- ASP.NET Core Identity (for authentication testing)
- .NET 9
- GitHub Actions (CI/CD)

---

## Configuration Files

### Project Structure
```
backend/
├── Atelje.Api/              # Your main API project
├── Atelje.Tests/            # Your test project
│   ├── Services/
│   │   └── UserServiceTests.cs
│   ├── Controllers/
│   │   └── AuthControllerTests.cs
│   └── Atelje.Tests.csproj
└── backend.sln
```

### Atelje.Tests.csproj
```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net9.0</TargetFramework>
    <IsPackable>false</IsPackable>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="xunit" Version="2.4.2" />
    <PackageReference Include="xunit.runner.visualstudio" Version="2.4.5" />
    <PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.6.0" />
    <PackageReference Include="Moq" Version="4.20.70" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.InMemory" Version="9.0.0" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\Atelje.Api\Atelje.Api.csproj" />
  </ItemGroup>
</Project>
```

---

## Important Notes

### Node.js Version (if applicable)
- If you see `EBADENGINE` warnings, they're safe to ignore
- Tests work fine on current Node versions

### Creating the Test Project
```bash
# From backend directory
dotnet new xunit -n Atelje.Tests
dotnet add Atelje.Tests reference Atelje.Api
dotnet add Atelje.Tests package Moq
dotnet add Atelje.Tests package Microsoft.EntityFrameworkCore.InMemory
```

---

## Test File Structure

### Location
Place tests in folders mirroring the code structure:
```
Atelje.Tests/
  Services/
    UserServiceTests.cs
  Controllers/
    AuthControllerTests.cs
```

### Basic Test Structure
```csharp
using Xunit;
using Moq;
using Microsoft.EntityFrameworkCore;
using Atelje.Data;
using Atelje.Services;
using Atelje.Models;

namespace Atelje.Tests.Services;

public class UserServiceTests
{
    [Fact]
    public async Task MethodName_Condition_ExpectedResult()
    {
        // Arrange - set up test data and dependencies
        
        // Act - perform the action being tested
        
        // Assert - verify the results
    }
}
```

---

## Key Concepts

### 1. Testing Services with In-Memory Database

When testing services that use Entity Framework, use in-memory databases:

```csharp
[Fact]
public async Task GetAllUsersAsync_ReturnsAllUsers()
{
    // Arrange - Create in-memory database
    var options = new DbContextOptionsBuilder<AppDbContext>()
        .UseInMemoryDatabase(databaseName: "TestDb_GetAllUsers") // Unique name per test!
        .Options;

    await using var context = new AppDbContext(options);
    
    // Seed test data
    var users = new List<User>
    {
        new User { Id = "1", Email = "user1@test.com", UserName = "user1" },
        new User { Id = "2", Email = "user2@test.com", UserName = "user2" }
    };
    
    context.Users.AddRange(users);
    await context.SaveChangesAsync();

    // Create mock UserManager (required by service but not used in this test)
    var mockUserManager = MockUserManager<User>();
    var userService = new UserService(context, mockUserManager.Object);

    // Act
    var result = await userService.GetAllUsersAsync();

    // Assert
    Assert.NotNull(result);
    Assert.Equal(2, result.Count);
    Assert.Contains(result, u => u.Email == "user1@test.com");
}

// Helper method for mocking UserManager
private static Mock<UserManager<TUser>> MockUserManager<TUser>() where TUser : class
{
    var store = new Mock<IUserStore<TUser>>();
    return new Mock<UserManager<TUser>>(
        store.Object, null, null, null, null, null, null, null, null);
}
```

**Why unique database names?** Each test needs its own isolated data. Using the same database name means tests share data and interfere with each other.

### 2. Mocking Dependencies with Moq

**Creating a mock:**
```csharp
var mockTokenService = new Mock<ITokenService>();
```

**Setting up mock behavior:**
```csharp
mockTokenService
    .Setup(x => x.GenerateToken(It.IsAny<string>(), It.IsAny<string>()))
    .Returns("fake-jwt-token");
```

**Using `It.IsAny<T>()`:**
- In `.Setup()`: Matches any value of that type (used for matching method calls)
- **Never use in `.Returns()` or `.ReturnsAsync()`**: Create actual objects instead

```csharp
// ❌ WRONG - Don't use It.IsAny in Returns
mockUserManager.Setup(x => x.FindByEmailAsync(It.IsAny<string>()))
    .ReturnsAsync(It.IsAny<User>()); // This doesn't work!

// ✅ CORRECT - Return an actual object
var testUser = new User { Id = "1", Email = "test@test.com" };
mockUserManager.Setup(x => x.FindByEmailAsync(It.IsAny<string>()))
    .ReturnsAsync(testUser);
```

**Mocking UserManager (ASP.NET Core Identity):**
```csharp
var mockUserManager = MockUserManager<User>();
mockUserManager
    .Setup(x => x.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
    .ReturnsAsync(IdentityResult.Success);

// For failures with error messages:
mockUserManager
    .Setup(x => x.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
    .ReturnsAsync(IdentityResult.Failed(new IdentityError 
    { 
        Description = "Email is already taken" 
    }));
```

### 3. Testing Controllers

Controllers return `ActionResult<T>` which wraps both the data and HTTP response information.

```csharp
[Fact]
public async Task Register_ValidData_ReturnsOkWithToken()
{
    // Arrange
    var registerDto = new RegisterDto
    {
        Email = "test@test.com",
        UserName = "testuser",
        Password = "P@ssword1"
    };

    var mockUserManager = MockUserManager<User>();
    mockUserManager
        .Setup(x => x.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
        .ReturnsAsync(IdentityResult.Success);

    var mockTokenService = new Mock<ITokenService>();
    mockTokenService
        .Setup(x => x.GenerateToken(It.IsAny<string>(), It.IsAny<string>()))
        .Returns("fake-jwt-token");

    var controller = new AuthController(mockUserManager.Object, mockTokenService.Object);

    // Act
    var result = await controller.Register(registerDto);

    // Assert - Check the ActionResult type
    var okResult = Assert.IsType<OkObjectResult>(result.Result);
    
    // Assert - Check the response data
    var response = Assert.IsType<AuthResponseDto>(okResult.Value);
    Assert.Equal("fake-jwt-token", response.Token);
    Assert.Equal("test@test.com", response.Email);
}
```

**Key points:**
- Controllers return `ActionResult<T>`, so access the actual result via `result.Result`
- Check status code type: `OkObjectResult`, `BadRequestObjectResult`, `UnauthorizedResult`
- Extract and verify the response data from `okResult.Value`

### 4. Testing Both Success and Failure Paths

Always test both success and failure scenarios:

```csharp
[Fact]
public async Task Login_ValidCredentials_ReturnsOkWithToken()
{
    // Arrange
    var testUser = new User 
    { 
        Id = "1", 
        Email = "test@test.com",
        UserName = "testuser"
    };
    
    mockUserManager.Setup(x => x.FindByEmailAsync(It.IsAny<string>()))
        .ReturnsAsync(testUser);
    mockUserManager.Setup(x => x.CheckPasswordAsync(It.IsAny<User>(), It.IsAny<string>()))
        .ReturnsAsync(true);
    
    // Act & Assert...
}

[Fact]
public async Task Login_InvalidCredentials_ReturnsUnauthorized()
{
    // Arrange - Return null to simulate user not found
    mockUserManager.Setup(x => x.FindByEmailAsync(It.IsAny<string>()))
        .ReturnsAsync((User)null);
    
    // Act
    var result = await controller.Login(loginDto);
    
    // Assert - Check for Unauthorized response
    Assert.IsType<UnauthorizedResult>(result.Result);
}
```

---

## Common xUnit Assertions

```csharp
// Equality
Assert.Equal(expected, actual);
Assert.NotEqual(expected, actual);

// Nullability
Assert.Null(value);
Assert.NotNull(value);

// Boolean
Assert.True(condition);
Assert.False(condition);

// Collections
Assert.Empty(collection);
Assert.NotEmpty(collection);
Assert.Contains(expectedItem, collection);
Assert.DoesNotContain(unexpectedItem, collection);
Assert.Single(collection); // Exactly one item

// Type checking
Assert.IsType<ExpectedType>(object);
Assert.IsAssignableFrom<ExpectedType>(object);

// Exceptions
Assert.Throws<ExceptionType>(() => methodThatThrows());
await Assert.ThrowsAsync<ExceptionType>(() => asyncMethodThatThrows());
```

---

## Example: Complete CRUD Test Suite

```csharp
public class UserServiceTests
{
    // CREATE
    [Fact]
    public async Task CreateUserAsync_WithValidData_CreatesAndReturnsUser()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_CreateUser")
            .Options;

        await using var context = new AppDbContext(options);
        var mockUserManager = MockUserManager<User>();
        
        mockUserManager
            .Setup(x => x.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
            .ReturnsAsync(IdentityResult.Success);

        var userService = new UserService(context, mockUserManager.Object);
        var createDto = new CreateUserDto
        {
            Email = "new@test.com",
            UserName = "newuser",
            DisplayName = "New User",
            Password = "P@ssword1"
        };

        var result = await userService.CreateUserAsync(createDto);

        Assert.NotNull(result);
        Assert.Equal("new@test.com", result.Email);
    }

    // READ - All
    [Fact]
    public async Task GetAllUsersAsync_ReturnsAllUsers()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_GetAllUsers")
            .Options;

        await using var context = new AppDbContext(options);
        
        context.Users.AddRange(
            new User { Id = "1", Email = "user1@test.com", UserName = "user1" },
            new User { Id = "2", Email = "user2@test.com", UserName = "user2" }
        );
        await context.SaveChangesAsync();

        var mockUserManager = MockUserManager<User>();
        var userService = new UserService(context, mockUserManager.Object);

        var result = await userService.GetAllUsersAsync();

        Assert.Equal(2, result.Count);
        Assert.Contains(result, u => u.Email == "user1@test.com");
    }

    // READ - By ID
    [Fact]
    public async Task GetUserByIdAsync_WhenUserExists_ReturnsUser()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_GetUserById")
            .Options;

        await using var context = new AppDbContext(options);
        var user = new User { Id = "1", Email = "user@test.com", UserName = "user" };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var mockUserManager = MockUserManager<User>();
        var userService = new UserService(context, mockUserManager.Object);

        var result = await userService.GetUserByIdAsync("1");

        Assert.NotNull(result);
        Assert.Equal("user@test.com", result.Email);
    }

    [Fact]
    public async Task GetUserByIdAsync_WhenUserDoesNotExist_ReturnsNull()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_GetUserById_NotFound")
            .Options;

        await using var context = new AppDbContext(options);
        var mockUserManager = MockUserManager<User>();
        var userService = new UserService(context, mockUserManager.Object);

        var result = await userService.GetUserByIdAsync("nonexistent");

        Assert.Null(result);
    }

    // UPDATE
    [Fact]
    public async Task UpdateUserAsync_WhenUserExists_UpdatesAndReturnsUser()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_UpdateUser")
            .Options;

        await using var context = new AppDbContext(options);
        var user = new User 
        { 
            Id = "1", 
            Email = "user@test.com",
            UserName = "user",
            DisplayName = "Original Name"
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var mockUserManager = MockUserManager<User>();
        var userService = new UserService(context, mockUserManager.Object);
        var updateDto = new UpdateUserDto { DisplayName = "Updated Name" };

        var result = await userService.UpdateUserAsync("1", updateDto);

        Assert.NotNull(result);
        Assert.Equal("Updated Name", result.DisplayName);
        Assert.Equal("user@test.com", result.Email); // Unchanged
    }

    // DELETE
    [Fact]
    public async Task DeleteUserAsync_WhenUserExists_ReturnsTrue()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_DeleteUser")
            .Options;

        await using var context = new AppDbContext(options);
        var user = new User { Id = "1", Email = "user@test.com", UserName = "user" };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var mockUserManager = MockUserManager<User>();
        mockUserManager
            .Setup(x => x.DeleteAsync(It.IsAny<User>()))
            .ReturnsAsync(IdentityResult.Success);

        var userService = new UserService(context, mockUserManager.Object);

        var result = await userService.DeleteUserAsync("1");

        Assert.True(result);
    }

    private static Mock<UserManager<TUser>> MockUserManager<TUser>() where TUser : class
    {
        var store = new Mock<IUserStore<TUser>>();
        return new Mock<UserManager<TUser>>(
            store.Object, null, null, null, null, null, null, null, null);
    }
}
```

---

## Running Tests

### In Rider
1. **Click the green play icon** next to test method or class
2. **Right-click** test file → **Run Tests**
3. **Unit Tests window**: View → Tool Windows → Unit Tests → Run All
4. **Keyboard**: `⌘T, R` (Mac) or `Ctrl+T, R` (Windows)

### Command Line
```bash
# Run all tests
dotnet test

# Run tests with detailed output
dotnet test --verbosity detailed

# Run specific test project
dotnet test ./backend/Atelje.Tests

# Run tests and generate coverage
dotnet test --collect:"XPlat Code Coverage"

# Exclude database connection tests from CI
dotnet test --filter "Category!=LocalOnly"
```

### If Rider Doesn't Show Tests
1. Build solution: `Build → Build Solution`
2. Restore NuGet: Right-click solution → Restore NuGet Packages
3. Refresh Unit Tests window (circular arrow icon)
4. Invalidate caches: `File → Invalidate Caches → Invalidate and Restart`

---

## GitHub Actions CI/CD

### .github/workflows/backend-tests.yml
```yaml
name: Run Tests
on:
  push:
    branches: [ main, dev ]
  pull_request:
    branches: [ main, dev ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup .NET
      uses: actions/setup-dotnet@v4
      with:
        dotnet-version: '9.0.x'
    
    - name: Restore dependencies
      run: dotnet restore ./backend/backend.sln 
    
    - name: Build
      run: dotnet build ./backend/backend.sln --no-restore
    
    - name: Run tests
      run: dotnet test ./backend/backend.sln --no-build --verbosity normal --logger "trx;LogFileName=test-results.trx" --filter "Category!=LocalOnly"
    
    - name: Test Report
      uses: dorny/test-reporter@v1
      if: always()
      with:
        name: .NET Test Results
        path: '**/test-results.trx'
        reporter: dotnet-trx
```

**Key features:**
- `--logger "trx"`: Outputs test results in TRX format for the reporter
- `if: always()`: Generates report even if tests fail
- `--filter "Category!=LocalOnly"`: Excludes tests marked with `[Trait("Category", "LocalOnly")]`
- Test reporter creates visual summaries in PR checks

---

## Common Testing Patterns

### Testing Database Connection (Local Only)
```csharp
[Fact]
[Trait("Category", "LocalOnly")] // Excluded from CI
public async Task CanConnectToLocalDatabase()
{
    var config = new ConfigurationBuilder()
        .SetBasePath(Directory.GetCurrentDirectory())
        .AddJsonFile("appsettings.json")
        .Build();
    
    using var db = new AppDbContext(config);
    var canConnect = await db.Database.CanConnectAsync();
    
    Assert.True(canConnect);
}
```

### Testing Error Responses
```csharp
[Fact]
public async Task Register_DuplicateEmail_ReturnsBadRequest()
{
    // Arrange
    mockUserManager
        .Setup(x => x.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
        .ReturnsAsync(IdentityResult.Failed(
            new IdentityError { Description = "Email is already taken" }
        ));

    // Act
    var result = await controller.Register(registerDto);

    // Assert
    var badResult = Assert.IsType<BadRequestObjectResult>(result.Result);
    var errorResponse = Assert.IsType<ErrorResponseDto>(badResult.Value);
    Assert.NotEmpty(errorResponse.Errors);
    Assert.Contains("Email is already taken", errorResponse.Errors);
}
```

---

## Common Issues and Solutions

### Issue: "Property 'mockResolvedValue' does not exist"
**Cause:** You're not casting to the mocked type  
**Solution:** Use `.Object` property
```csharp
// ❌ Wrong
var service = new MyService(mockDependency);

// ✅ Correct
var service = new MyService(mockDependency.Object);
```

### Issue: Mock returns null unexpectedly
**Cause:** Mock not set up, or setup doesn't match the actual method call  
**Solution:** Ensure setup parameters match
```csharp
// If service calls CreateAsync(user, password)
mockUserManager
    .Setup(x => x.CreateAsync(It.IsAny<User>(), It.IsAny<string>())) // Two parameters!
    .ReturnsAsync(IdentityResult.Success);
```

### Issue: Tests pass individually but fail when run together
**Cause:** Shared database name between tests  
**Solution:** Use unique database names
```csharp
// Give each test its own database
.UseInMemoryDatabase(databaseName: "TestDb_MethodName_Scenario")
```

### Issue: "Object reference not set to an instance"
**Cause:** Mock setup returning `It.IsAny<T>()` instead of actual object  
**Solution:** Create and return actual test objects
```csharp
// ❌ Wrong
.ReturnsAsync(It.IsAny<User>());

// ✅ Correct
var testUser = new User { Id = "1", Email = "test@test.com" };
.ReturnsAsync(testUser);
```

### Issue: IdentityResult errors collection is empty
**Cause:** Called `IdentityResult.Failed()` without error parameters  
**Solution:** Provide error descriptions
```csharp
IdentityResult.Failed(new IdentityError { Description = "Error message" })
```

---

## What We've Tested

✅ **UserService** - Complete CRUD operations  
✅ **AuthController** - Registration and login endpoints  
✅ **Success paths** - Valid data produces expected results  
✅ **Failure paths** - Invalid data produces appropriate errors  
✅ **Database operations** - Using in-memory database  
✅ **Mocked dependencies** - UserManager, TokenService  
✅ **CI/CD** - Automated testing on every push/PR

---

## Best Practices

1. **One assertion concept per test**: Test one thing at a time
2. **Descriptive test names**: `MethodName_Condition_ExpectedResult`
3. **Arrange-Act-Assert**: Clear test structure
4. **Unique database names**: Prevent test interference
5. **Test both paths**: Success and failure scenarios
6. **Mock external dependencies**: Database, APIs, UserManager
7. **Use meaningful test data**: "test@test.com" is better than "a@b.c"
8. **Keep tests independent**: No shared state between tests
9. **Fast tests**: Use in-memory databases, not real databases
10. **Consistent error handling**: Use DTOs for API error responses

---

## Testing Philosophy

**What to test:**
- Business logic in services
- Controller routing and response types
- Status codes (200, 400, 401, etc.)
- Error handling
- Data transformation (DTOs)

**What NOT to test:**
- Framework code (EF Core, ASP.NET Core Identity)
- Third-party libraries
- Database connectivity (except as integration test)
- Trivial getters/setters

**Remember:** Tests should give you confidence in your code. If a test is hard to write, your code might be too complex. If changing implementation breaks tests (but behavior is correct), you're testing implementation details instead of behavior.

---

## Future Testing Considerations

As your project grows, consider:
- **Integration tests**: Test full request/response pipeline
- **Test coverage tools**: Measure code coverage percentage
- **Database seeding helpers**: Reusable test data creation
- **Custom assertions**: Project-specific assertion helpers
- **Performance tests**: Ensure queries are efficient
- **Load tests**: Verify system handles expected traffic

---

## Resources

- [xUnit Documentation](https://xunit.net/)
- [Moq Documentation](https://github.com/moq/moq4)
- [EF Core Testing](https://learn.microsoft.com/en-us/ef/core/testing/)
- [ASP.NET Core Testing](https://learn.microsoft.com/en-us/aspnet/core/test/)