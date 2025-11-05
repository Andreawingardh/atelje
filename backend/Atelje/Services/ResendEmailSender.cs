namespace Atelje.Services;

using Resend;

public class ResendEmailSender(
    ILogger<ResendEmailSender> logger,
    IConfiguration configuration,
    IResend resend)
    : IEmailSender
{
    private readonly string? _senderEmail = configuration["Email:SenderEmail"] ?? "onboarding@resend.dev";
    private readonly string? _senderName = configuration["Email:SenderName"] ?? "Atelje";


    public async Task SendEmailAsync(string email, string subject, string htmlMessage)
    {
        var message = new EmailMessage();
        message.From = $"{_senderName} <{_senderEmail}>";
        message.To.Add(email);
        message.Subject = subject;
        message.HtmlBody = htmlMessage;

        try
        {
            var response = await resend.EmailSendAsync(message);
            logger.LogInformation("Response from Resend: {Response}", response);
            logger.LogInformation("Email message: {Message}", message);
            logger.LogInformation("Email sent successfully to {Email}", email);
        }
        catch (Exception exception)
        {
            logger.LogError(exception, "Failed to send email to {Email}", email);
            throw;
        }
    }
}