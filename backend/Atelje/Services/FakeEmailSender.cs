namespace Atelje.Services;

public class FakeEmailSender : IEmailSender
{
    private readonly ILogger<FakeEmailSender> _logger;

    public FakeEmailSender(ILogger<FakeEmailSender> logger)
    {
        _logger = logger;
    }

    public Task SendEmailAsync(string email, string subject, string htmlMessage)
    {
        var message = $"""
                       --------FAKE EMAIL SENDER-----
                       Email sent to: {email}
                       Subject: {subject}
                       Message: {htmlMessage}
                       """;
        _logger.LogInformation(message);
        return Task.CompletedTask;
    }
}