namespace TrashMob.Shared
{
    using SendGrid;
    using SendGrid.Helpers.Mail;
    using System;
    using System.Collections.Generic;
    using System.Threading;
    using System.Threading.Tasks;
    using TrashMob.Shared.Engine;

    public class EmailSender : IEmailSender
    {
        public string ApiKey { get; set; }

        public async Task SendEmailAsync(Email email, CancellationToken cancellationToken = default)
        {
            // To not send emails from dev environments, don't store an apikey password in the local secrets
            if (string.IsNullOrWhiteSpace(ApiKey) || ApiKey == "x")
            {
                return;
            }

            var from = new SendGrid.Helpers.Mail.EmailAddress(Constants.TrashMobEmailAddress, Constants.TrashMobEmailName);

            var tos = new List<SendGrid.Helpers.Mail.EmailAddress>();
            foreach (var address in email.Addresses)
            {
                tos.Add(new SendGrid.Helpers.Mail.EmailAddress(address.Email, address.Name));
            }

            try
            {
                var client = new SendGridClient(ApiKey);
                var message = MailHelper.CreateSingleEmailToMultipleRecipients(from, tos, email.Subject, email.Message, email.HtmlMessage);
                var response = await client.SendEmailAsync(message, cancellationToken).ConfigureAwait(false);
                Console.WriteLine(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

        public async Task SendTemplatedEmailAsync(Email email, CancellationToken cancellationToken = default)
        {
            // To not send emails from dev environments, don't store an apikey password in the local secrets
            if (string.IsNullOrWhiteSpace(ApiKey) || ApiKey == "x")
            {
                return;
            }

            var from = new SendGrid.Helpers.Mail.EmailAddress(Constants.TrashMobEmailAddress, Constants.TrashMobEmailName);

            var tos = new List<SendGrid.Helpers.Mail.EmailAddress>();
            foreach (var address in email.Addresses)
            {
                tos.Add(new SendGrid.Helpers.Mail.EmailAddress(address.Email, address.Name));
            }

            try
            {
                var client = new SendGridClient(ApiKey);
                var message = MailHelper.CreateSingleTemplateEmailToMultipleRecipients(from, tos, email.TemplateId, email.DynamicTemplateData);
                
                message.Asm = new ASM
                {
                    GroupId = email.GroupId,
                    GroupsToDisplay = new List<int>()
                    {
                        SendGridEmailGroupId.EventRelated,
                        SendGridEmailGroupId.General
                    }
                };

                var response = await client.SendEmailAsync(message, cancellationToken).ConfigureAwait(false);
                Console.WriteLine(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }
    }
}
