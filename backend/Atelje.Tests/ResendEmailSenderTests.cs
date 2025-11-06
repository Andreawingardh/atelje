using System.Net;
using Atelje.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using Moq;
using Resend;

namespace Atelje.Tests;

public class ResendEmailSenderTests
{
    private readonly Mock<IResend> _mockResend = new Mock<IResend>();
    private readonly Mock<ILogger<ResendEmailSender>> _mockLogger = new Mock<ILogger<ResendEmailSender>>();
    private readonly Mock<IWebHostEnvironment> _mockEnv = new Mock<IWebHostEnvironment>();
    private readonly Mock<IConfiguration> _mockConfiguration = new Mock<IConfiguration>();
    private readonly IEmailSender _resendEmailSender;


    public ResendEmailSenderTests()
    {
        _resendEmailSender = new ResendEmailSender(
            _mockLogger.Object,
            _mockConfiguration.Object,
            _mockResend.Object,
            _mockEnv.Object
        );
    }

    [Fact]
    public async Task SendEmailAsync_ValidData_EmailSent()
    {
        //Arrange
        _mockResend.Setup(x => x.EmailSendAsync(It.IsAny<EmailMessage>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ResendResponse<Guid>(Guid.NewGuid(), null));

        //Act
        var ex = await Record.ExceptionAsync(() =>
            _resendEmailSender.SendEmailAsync("test@test.test", "test-subject", "<p>test HTML</p>")
        );
        //Assert
        _mockResend.Verify(x => x.EmailSendAsync(It.IsAny<EmailMessage>(), It.IsAny<CancellationToken>()),
            Times.Once());
        Assert.Null(ex);
    }

    [Fact]
    public async Task SendEmailAsync_InvalidData_ThrowsException()
    {
        //Arrange
        _mockResend.Setup(x => x.EmailSendAsync(It.IsAny<EmailMessage>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(new ResendException(
                HttpStatusCode.Unauthorized,
                ErrorType.InvalidApiKey,
                "Simulated failure",
                null,
                null
            ));

        //Act
        var ex = await Record.ExceptionAsync(() =>
            _resendEmailSender.SendEmailAsync("test@test.test", "test-subject", "<p>test HTML</p>")
        );
        
        //Assert
        Assert.NotNull(ex);
        Assert.IsType<ResendException>(ex);
    }
}