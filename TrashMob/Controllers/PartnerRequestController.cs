﻿namespace TrashMob.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using System;
    using System.Collections.Generic;
    using System.Security.Claims;
    using System.Threading;
    using System.Threading.Tasks;
    using TrashMob.Shared;
    using TrashMob.Shared.Engine;
    using TrashMob.Shared.Managers;
    using TrashMob.Shared.Models;
    using TrashMob.Shared.Persistence;

    [ApiController]
    [Authorize]
    [Route("api/partnerrequests")]
    public class PartnerRequestsController : ControllerBase
    {
        private readonly IPartnerRequestRepository partnerRequestRepository;
        private readonly IPartnerManager partnerManager;
        private readonly IUserRepository userRepository;
        private readonly IEmailManager emailManager;

        public PartnerRequestsController(IPartnerRequestRepository partnerRequestRepository, 
                                         IPartnerManager partnerManager,
                                         IEmailManager emailManager, 
                                         IUserRepository userRepository)
        {
            this.partnerRequestRepository = partnerRequestRepository;
            this.partnerManager = partnerManager;
            this.emailManager = emailManager;
            this.userRepository = userRepository;
        }

        [HttpPost]
        public async Task<IActionResult> AddPartnerRequest(PartnerRequest partnerRequest)
        {
            var user = await userRepository.GetUserByInternalId(partnerRequest.CreatedByUserId).ConfigureAwait(false);

            if (user == null || !ValidateUser(user.NameIdentifier))
            {
                return Forbid();
            }

            await partnerRequestRepository.AddPartnerRequest(partnerRequest).ConfigureAwait(false);

            var message = $"From Email: {partnerRequest.PrimaryEmail}\nFrom Name:{partnerRequest.Name}\nMessage:\n{partnerRequest.Notes}";
            var htmlMessage = $"From Email: {partnerRequest.PrimaryEmail}\nFrom Name:{partnerRequest.Name}\nMessage:\n{partnerRequest.Notes}";
            var subject = "Partner Request";

            var recipients = new List<EmailAddress>
            {
                new EmailAddress { Name = Constants.TrashMobEmailName, Email = Constants.TrashMobEmailAddress }
            };

            await emailManager.SendGenericSystemEmail(subject, message, htmlMessage, recipients, CancellationToken.None).ConfigureAwait(false);
            
            return Ok();
        }

        [HttpPut("approve/{partnerRequestId}")]
        public async Task<IActionResult> ApprovePartnerRequest(Guid partnerRequestId)
        {
            var user = await userRepository.GetUserByNameIdentifier(User.FindFirst(ClaimTypes.NameIdentifier).Value).ConfigureAwait(false);

            if (!user.IsSiteAdmin)
            {
                return Forbid();
            }

            var partnerRequest = await partnerRequestRepository.GetPartnerRequest(partnerRequestId).ConfigureAwait(false);
            partnerRequest.PartnerRequestStatusId = (int)PartnerRequestStatusEnum.Approved;

            await partnerRequestRepository.UpdatePartnerRequest(partnerRequest).ConfigureAwait(false);

            await partnerManager.CreatePartner(partnerRequest).ConfigureAwait(false);

            var partnerMessage = emailManager.GetEmailTemplate(NotificationTypeEnum.PartnerRequestAccepted.ToString());
            partnerMessage = partnerMessage.Replace("{PartnerName}", partnerRequest.Name);
            var partnerHtmlMessage = emailManager.GetHtmlEmailTemplate(NotificationTypeEnum.PartnerRequestAccepted.ToString());
            partnerHtmlMessage = partnerHtmlMessage.Replace("{PartnerName}", partnerRequest.Name);
            var partnerSubject = "Your request to become a TrashMob.eco Partner has been accepted!";

            var partnerRecipients = new List<EmailAddress>
            {
                new EmailAddress { Name = partnerRequest.Name, Email = partnerRequest.PrimaryEmail },
                new EmailAddress { Name = partnerRequest.Name, Email = partnerRequest.SecondaryEmail },
            };
            
            await emailManager.SendSystemEmail(partnerSubject, partnerMessage, partnerHtmlMessage, partnerRecipients, CancellationToken.None).ConfigureAwait(false);

            return Ok();
        }

        [HttpPut("deny/{partnerRequestId}")]
        public async Task<IActionResult> DenyPartnerRequest(Guid partnerRequestId)
        {
            var user = await userRepository.GetUserByNameIdentifier(User.FindFirst(ClaimTypes.NameIdentifier).Value).ConfigureAwait(false);

            if (!user.IsSiteAdmin)
            {
                return Forbid();
            }

            var partnerRequest = await partnerRequestRepository.GetPartnerRequest(partnerRequestId).ConfigureAwait(false);
            
            partnerRequest.PartnerRequestStatusId = (int)PartnerRequestStatusEnum.Denied;

            await partnerRequestRepository.UpdatePartnerRequest(partnerRequest).ConfigureAwait(false);

            var partnerMessage = emailManager.GetEmailTemplate(NotificationTypeEnum.PartnerRequestDeclined.ToString());
            partnerMessage = partnerMessage.Replace("{PartnerName}", partnerRequest.Name);
            var partnerHtmlMessage = emailManager.GetHtmlEmailTemplate(NotificationTypeEnum.PartnerRequestDeclined.ToString());
            partnerHtmlMessage = partnerHtmlMessage.Replace("{PartnerName}", partnerRequest.Name);
            var partnerSubject = "Your request to become a TrashMob.eco Partner has been declined";

            var partnerRecipients = new List<EmailAddress>
            {
                new EmailAddress { Name = partnerRequest.Name, Email = partnerRequest.PrimaryEmail },
                new EmailAddress { Name = partnerRequest.Name, Email = partnerRequest.SecondaryEmail },
            };

            await emailManager.SendSystemEmail(partnerSubject, partnerMessage, partnerHtmlMessage, partnerRecipients, CancellationToken.None).ConfigureAwait(false);

            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetPartnerRequests(CancellationToken cancellationToken)
        {
            var user = await userRepository.GetUserByNameIdentifier(User.FindFirst(ClaimTypes.NameIdentifier).Value, cancellationToken).ConfigureAwait(false);

            if (!user.IsSiteAdmin)
            {
                return Forbid();
            }

            return Ok(await partnerRequestRepository.GetPartnerRequests(cancellationToken).ConfigureAwait(false));
        }

        private bool ValidateUser(string userId)
        {
            var nameIdentifier = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            return userId == nameIdentifier;
        }
    }
}
