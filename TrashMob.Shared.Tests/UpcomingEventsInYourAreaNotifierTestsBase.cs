namespace TrashMob.Shared.Tests
{
    using Moq;
    using System;
    using System.Collections.Generic;
    using System.Threading;
    using System.Threading.Tasks;
    using TrashMob.Shared.Engine;
    using TrashMob.Shared.Models;
    using Xunit;

    public abstract class UpcomingEventsInYourAreaNotifierTestsBase : NotifierTestsBase
    {
        protected abstract INotificationEngine Engine { get; }
        protected abstract int NumberOfDaysToAddForEventOutOfWindow { get; }

        [Fact]
        public async Task GenerateNotificationsAsync_WithNoDataAvailable_Succeeds()
        {
            // Arrange

            // Act
            await Engine.GenerateNotificationsAsync().ConfigureAwait(false);

            // Assert
            UserNotificationRepository.Verify(_ => _.AddUserNotification(It.IsAny<UserNotification>()), Times.Never);
            EmailSender.Verify(_ => _.SendEmailAsync(It.IsAny<Email>(), It.IsAny<CancellationToken>()), Times.Never);
        }

        [Fact]
        public async Task GenerateNotificationsAsync_With1EventForUser_Sends1Email()
        {
            // Arrange
            List<Event> events = GetEventList1();
            List<User> users = GetUserList1();

            EventRepository.Setup(e => e.GetActiveEvents(It.IsAny<CancellationToken>())).ReturnsAsync(events);
            UserRepository.Setup(u => u.GetAllUsers(It.IsAny<CancellationToken>())).ReturnsAsync(users);

            // Act
            await Engine.GenerateNotificationsAsync().ConfigureAwait(false);

            // Assert
            EventRepository.Verify(_ => _.GetActiveEvents(It.IsAny<CancellationToken>()), Times.Once);
            UserNotificationPreferenceRepository.Verify(_ => _.GetUserNotificationPreferences(It.IsAny<Guid>(), It.IsAny<CancellationToken>()), Times.Once);
            UserRepository.Verify(_ => _.GetAllUsers(It.IsAny<CancellationToken>()), Times.Once);
            EventAttendeeRepository.Verify(_ => _.GetEventsUserIsAttending(It.IsAny<Guid>(), It.IsAny<bool>(), It.IsAny<CancellationToken>()), Times.Once);
            UserNotificationRepository.Verify(_ => _.AddUserNotification(It.IsAny<UserNotification>()), Times.Once);
            EmailSender.Verify(_ => _.SendEmailAsync(It.IsAny<Email>(), It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task GenerateNotificationsAsync_With2EventForUser_Sends1Email()
        {
            // Arrange
            List<Event> events = GetEventList2();
            List<User> users = GetUserList1();

            EventRepository.Setup(e => e.GetActiveEvents(It.IsAny<CancellationToken>())).ReturnsAsync(events);
            UserRepository.Setup(u => u.GetAllUsers(It.IsAny<CancellationToken>())).ReturnsAsync(users);

            // Act
            await Engine.GenerateNotificationsAsync().ConfigureAwait(false);

            // Assert
            EventRepository.Verify(_ => _.GetActiveEvents(It.IsAny<CancellationToken>()), Times.Once);
            UserNotificationPreferenceRepository.Verify(_ => _.GetUserNotificationPreferences(It.IsAny<Guid>(), It.IsAny<CancellationToken>()), Times.Once);
            UserRepository.Verify(_ => _.GetAllUsers(It.IsAny<CancellationToken>()), Times.Once);
            EventAttendeeRepository.Verify(_ => _.GetEventsUserIsAttending(It.IsAny<Guid>(), It.IsAny<bool>(), It.IsAny<CancellationToken>()), Times.Once);
            UserNotificationRepository.Verify(_ => _.AddUserNotification(It.IsAny<UserNotification>()), Times.Exactly(2));
            EmailSender.Verify(_ => _.SendEmailAsync(It.IsAny<Email>(), It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task GenerateNotificationsAsync_With1EventFor2Users_Sends2Email()
        {
            // Arrange
            List<Event> events = GetEventList1();
            List<User> users = GetUserList2();

            EventRepository.Setup(e => e.GetActiveEvents(It.IsAny<CancellationToken>())).ReturnsAsync(events);
            UserRepository.Setup(u => u.GetAllUsers(It.IsAny<CancellationToken>())).ReturnsAsync(users);

            // Act
            await Engine.GenerateNotificationsAsync().ConfigureAwait(false);

            // Assert
            UserRepository.Verify(_ => _.GetAllUsers(It.IsAny<CancellationToken>()), Times.Once);
            UserNotificationPreferenceRepository.Verify(_ => _.GetUserNotificationPreferences(It.IsAny<Guid>(), It.IsAny<CancellationToken>()), Times.Exactly(2));
            EventRepository.Verify(_ => _.GetActiveEvents(It.IsAny<CancellationToken>()), Times.Exactly(2));
            EventAttendeeRepository.Verify(_ => _.GetEventsUserIsAttending(It.IsAny<Guid>(), It.IsAny<bool>(), It.IsAny<CancellationToken>()), Times.Exactly(2));
            UserNotificationRepository.Verify(_ => _.AddUserNotification(It.IsAny<UserNotification>()), Times.Exactly(2));
            EmailSender.Verify(_ => _.SendEmailAsync(It.IsAny<Email>(), It.IsAny<CancellationToken>()), Times.Exactly(2));
        }

        [Fact]
        public async Task GenerateNotificationsAsync_With1EventFor1UsersWhoIsAlreadyAttending_SendsNoEmail()
        {
            // Arrange
            List<Event> events = GetEventList1();
            List<User> users = GetUserList1();

            EventRepository.Setup(e => e.GetActiveEvents(It.IsAny<CancellationToken>())).ReturnsAsync(events);
            UserRepository.Setup(u => u.GetAllUsers(It.IsAny<CancellationToken>())).ReturnsAsync(users);

            // The user is attending all available events
            EventAttendeeRepository.Setup(ea => ea.GetEventsUserIsAttending(It.IsAny<Guid>(), It.IsAny<bool>(), It.IsAny<CancellationToken>())).ReturnsAsync(events);

            // Act
            await Engine.GenerateNotificationsAsync().ConfigureAwait(false);

            // Assert
            UserRepository.Verify(_ => _.GetAllUsers(It.IsAny<CancellationToken>()), Times.Once);
            UserNotificationPreferenceRepository.Verify(_ => _.GetUserNotificationPreferences(It.IsAny<Guid>(), It.IsAny<CancellationToken>()), Times.Once);
            EventRepository.Verify(_ => _.GetActiveEvents(It.IsAny<CancellationToken>()), Times.Once);
            EventAttendeeRepository.Verify(_ => _.GetEventsUserIsAttending(It.IsAny<Guid>(), It.IsAny<bool>(), It.IsAny<CancellationToken>()), Times.Once);
            UserNotificationRepository.Verify(_ => _.AddUserNotification(It.IsAny<UserNotification>()), Times.Never);
            EmailSender.Verify(_ => _.SendEmailAsync(It.IsAny<Email>(), It.IsAny<CancellationToken>()), Times.Never);
        }

        [Fact]
        public async Task GenerateNotificationsAsync_With1EventFor1UsersWhoIsAttendingOtherEventsButNotThisOne_SendsOneEmail()
        {
            // Arrange
            List<Event> events = GetEventList1();
            List<User> users = GetUserList1();
            List<Event> alternateEvents = GetEventList1();
            alternateEvents[0].Id = new Guid();

            EventRepository.Setup(e => e.GetActiveEvents(It.IsAny<CancellationToken>())).ReturnsAsync(events);
            UserRepository.Setup(u => u.GetAllUsers(It.IsAny<CancellationToken>())).ReturnsAsync(users);

            // The user is attending all available events
            EventAttendeeRepository.Setup(ea => ea.GetEventsUserIsAttending(It.IsAny<Guid>(), It.IsAny<bool>(), It.IsAny<CancellationToken>())).ReturnsAsync(alternateEvents);

            // Act
            await Engine.GenerateNotificationsAsync().ConfigureAwait(false);

            // Assert
            UserRepository.Verify(_ => _.GetAllUsers(It.IsAny<CancellationToken>()), Times.Once);
            UserNotificationPreferenceRepository.Verify(_ => _.GetUserNotificationPreferences(It.IsAny<Guid>(), It.IsAny<CancellationToken>()), Times.Once);
            EventRepository.Verify(_ => _.GetActiveEvents(It.IsAny<CancellationToken>()), Times.Once);
            EventAttendeeRepository.Verify(_ => _.GetEventsUserIsAttending(It.IsAny<Guid>(), It.IsAny<bool>(), It.IsAny<CancellationToken>()), Times.Once);
            UserNotificationRepository.Verify(_ => _.AddUserNotification(It.IsAny<UserNotification>()), Times.Once);
            EmailSender.Verify(_ => _.SendEmailAsync(It.IsAny<Email>(), It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task GenerateNotificationsAsync_With1EventFor1UsersWhoHasAlreadyReceivedTheEmail_SendsNoEmail()
        {
            // Arrange
            List<Event> events = GetEventList1();
            List<User> users = GetUserList1();

            EventRepository.Setup(e => e.GetActiveEvents(It.IsAny<CancellationToken>())).ReturnsAsync(events);
            UserRepository.Setup(u => u.GetAllUsers(It.IsAny<CancellationToken>())).ReturnsAsync(users);

            // The user has already received notifications for all events
            var userNotification = new UserNotification()
            {
                EventId = events[0].Id,
                UserId = users[0].Id,
                SentDate = DateTimeOffset.UtcNow.AddDays(-1),
                UserNotificationTypeId = (int)NotificationType,
            };

            var userNotifications = new List<UserNotification>() { userNotification };

            UserNotificationRepository.Setup(ea => ea.GetUserNotifications(It.IsAny<Guid>(), It.IsAny<Guid>(), It.IsAny<CancellationToken>())).ReturnsAsync(userNotifications);

            // Act
            await Engine.GenerateNotificationsAsync().ConfigureAwait(false);

            // Assert
            UserRepository.Verify(_ => _.GetAllUsers(It.IsAny<CancellationToken>()), Times.Once);
            UserNotificationPreferenceRepository.Verify(_ => _.GetUserNotificationPreferences(It.IsAny<Guid>(), It.IsAny<CancellationToken>()), Times.Once);
            EventRepository.Verify(_ => _.GetActiveEvents(It.IsAny<CancellationToken>()), Times.Once);
            EventAttendeeRepository.Verify(_ => _.GetEventsUserIsAttending(It.IsAny<Guid>(), It.IsAny<bool>(), It.IsAny<CancellationToken>()), Times.Once);
            UserNotificationRepository.Verify(_ => _.AddUserNotification(It.IsAny<UserNotification>()), Times.Never);
            EmailSender.Verify(_ => _.SendEmailAsync(It.IsAny<Email>(), It.IsAny<CancellationToken>()), Times.Never);
        }

        [Fact]
        public async Task GenerateNotificationsAsync_With1EventFor1UsersWhoHasNotAlreadyReceivedTheEmail_Sends1Email()
        {
            // Arrange
            List<Event> events = GetEventList1();
            List<User> users = GetUserList1();

            EventRepository.Setup(e => e.GetActiveEvents(It.IsAny<CancellationToken>())).ReturnsAsync(events);
            UserRepository.Setup(u => u.GetAllUsers(It.IsAny<CancellationToken>())).ReturnsAsync(users);

            var userNotifications = new List<UserNotification>();

            UserNotificationRepository.Setup(ea => ea.GetUserNotifications(It.IsAny<Guid>(), It.IsAny<Guid>(), It.IsAny<CancellationToken>())).ReturnsAsync(userNotifications);

            // Act
            await Engine.GenerateNotificationsAsync().ConfigureAwait(false);

            // Assert
            UserRepository.Verify(_ => _.GetAllUsers(It.IsAny<CancellationToken>()), Times.Once);
            UserNotificationPreferenceRepository.Verify(_ => _.GetUserNotificationPreferences(It.IsAny<Guid>(), It.IsAny<CancellationToken>()), Times.Once);
            EventRepository.Verify(_ => _.GetActiveEvents(It.IsAny<CancellationToken>()), Times.Once);
            EventAttendeeRepository.Verify(_ => _.GetEventsUserIsAttending(It.IsAny<Guid>(), It.IsAny<bool>(), It.IsAny<CancellationToken>()), Times.Once);
            UserNotificationRepository.Verify(_ => _.AddUserNotification(It.IsAny<UserNotification>()), Times.Once);
            EmailSender.Verify(_ => _.SendEmailAsync(It.IsAny<Email>(), It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task GenerateNotificationsAsync_With1EventFor1UsersWhoHasOptedOutOfAllEmails_SendsNoEmail()
        {
            // Arrange
            List<Event> events = GetEventList1();
            List<User> users = GetUserList1();

            users[0].IsOptedOutOfAllEmails = true;

            EventRepository.Setup(e => e.GetActiveEvents(It.IsAny<CancellationToken>())).ReturnsAsync(events);
            UserRepository.Setup(u => u.GetAllUsers(It.IsAny<CancellationToken>())).ReturnsAsync(users);

            // Act
            await Engine.GenerateNotificationsAsync().ConfigureAwait(false);

            // Assert
            UserRepository.Verify(_ => _.GetAllUsers(It.IsAny<CancellationToken>()), Times.Once);
            UserNotificationPreferenceRepository.Verify(_ => _.GetUserNotificationPreferences(It.IsAny<Guid>(), It.IsAny<CancellationToken>()), Times.Never);
            EventRepository.Verify(_ => _.GetActiveEvents(It.IsAny<CancellationToken>()), Times.Never);
            EventAttendeeRepository.Verify(_ => _.GetEventsUserIsAttending(It.IsAny<Guid>(), It.IsAny<bool>(), It.IsAny<CancellationToken>()), Times.Never);
            UserNotificationRepository.Verify(_ => _.AddUserNotification(It.IsAny<UserNotification>()), Times.Never);
            EmailSender.Verify(_ => _.SendEmailAsync(It.IsAny<Email>(), It.IsAny<CancellationToken>()), Times.Never);
        }

        [Fact]
         public async Task GenerateNotificationsAsync_With1EventFor1UsersWhoHasOptedOutOfThisEmail_SendsNoEmail()
        {
            // Arrange
            List<Event> events = GetEventList1();
            List<User> users = GetUserList1();
            List<UserNotificationPreference> userNotificationPreferences = GetUserNotificationPreferences();
            var unIndex = userNotificationPreferences.FindIndex(unp => unp.UserNotificationTypeId == (int)NotificationType);
            userNotificationPreferences[unIndex].IsOptedOut = true;

            EventRepository.Setup(e => e.GetActiveEvents(It.IsAny<CancellationToken>())).ReturnsAsync(events);
            UserRepository.Setup(u => u.GetAllUsers(It.IsAny<CancellationToken>())).ReturnsAsync(users);
            UserNotificationPreferenceRepository.Setup(unp => unp.GetUserNotificationPreferences(It.IsAny<Guid>(), It.IsAny<CancellationToken>())).ReturnsAsync(userNotificationPreferences);

            // Act
            await Engine.GenerateNotificationsAsync().ConfigureAwait(false);

            // Assert
            UserRepository.Verify(_ => _.GetAllUsers(It.IsAny<CancellationToken>()), Times.Once);
            EventRepository.Verify(_ => _.GetActiveEvents(It.IsAny<CancellationToken>()), Times.Never);
            UserNotificationPreferenceRepository.Verify(_ => _.GetUserNotificationPreferences(It.IsAny<Guid>(), It.IsAny<CancellationToken>()), Times.Once);
            EventAttendeeRepository.Verify(_ => _.GetEventsUserIsAttending(It.IsAny<Guid>(), It.IsAny<bool>(), It.IsAny<CancellationToken>()), Times.Never);
            UserNotificationRepository.Verify(_ => _.AddUserNotification(It.IsAny<UserNotification>()), Times.Never);
            EmailSender.Verify(_ => _.SendEmailAsync(It.IsAny<Email>(), It.IsAny<CancellationToken>()), Times.Never);
        }

        [Fact]
        public async Task GenerateNotificationsAsync_With1EventFor1UsersWhereEventIsMoreThanRequiredHoursAway_SendsNoEmail()
        {
            // Arrange
            List<Event> events = GetEventList1();
            List<User> users = GetUserList1();
            events[0].EventDate = DateTimeOffset.UtcNow.AddDays(NumberOfDaysToAddForEventOutOfWindow);

            EventRepository.Setup(e => e.GetActiveEvents(It.IsAny<CancellationToken>())).ReturnsAsync(events);
            UserRepository.Setup(u => u.GetAllUsers(It.IsAny<CancellationToken>())).ReturnsAsync(users);

            // Act
            await Engine.GenerateNotificationsAsync().ConfigureAwait(false);

            // Assert
            UserRepository.Verify(_ => _.GetAllUsers(It.IsAny<CancellationToken>()), Times.Once);
            EventRepository.Verify(_ => _.GetActiveEvents(It.IsAny<CancellationToken>()), Times.Once);
            UserNotificationPreferenceRepository.Verify(_ => _.GetUserNotificationPreferences(It.IsAny<Guid>(), It.IsAny<CancellationToken>()), Times.Once);
            EventAttendeeRepository.Verify(_ => _.GetEventsUserIsAttending(It.IsAny<Guid>(), It.IsAny<bool>(), It.IsAny<CancellationToken>()), Times.Once);
            UserNotificationRepository.Verify(_ => _.AddUserNotification(It.IsAny<UserNotification>()), Times.Never);
            EmailSender.Verify(_ => _.SendEmailAsync(It.IsAny<Email>(), It.IsAny<CancellationToken>()), Times.Never);
        }

        [Fact]
        public async Task GenerateNotificationsAsync_With1EventFor1UsersWhereEventIsOutsideOfTravelPreference_SendsNoEmail()
        {
            // Arrange
            List<Event> events = GetEventList1();
            List<User> users = GetUserList1();
            events[0].EventDate = DateTimeOffset.UtcNow.AddDays(3);

            EventRepository.Setup(e => e.GetActiveEvents(It.IsAny<CancellationToken>())).ReturnsAsync(events);
            UserRepository.Setup(u => u.GetAllUsers(It.IsAny<CancellationToken>())).ReturnsAsync(users);

            // Setup a return of distance between User and Event of 50 (in whatever units)
            MapRepository.Setup(mr => mr.GetDistanceBetweenTwoPoints(It.IsAny<Tuple<double, double>>(), It.IsAny<Tuple<double, double>>(), It.IsAny<bool>())).ReturnsAsync(50);

            // Act
            await Engine.GenerateNotificationsAsync().ConfigureAwait(false);

            // Assert
            UserRepository.Verify(_ => _.GetAllUsers(It.IsAny<CancellationToken>()), Times.Once);
            EventRepository.Verify(_ => _.GetActiveEvents(It.IsAny<CancellationToken>()), Times.Once);
            UserNotificationPreferenceRepository.Verify(_ => _.GetUserNotificationPreferences(It.IsAny<Guid>(), It.IsAny<CancellationToken>()), Times.Once);
            EventAttendeeRepository.Verify(_ => _.GetEventsUserIsAttending(It.IsAny<Guid>(), It.IsAny<bool>(), It.IsAny<CancellationToken>()), Times.Once);
            UserNotificationRepository.Verify(_ => _.AddUserNotification(It.IsAny<UserNotification>()), Times.Never);
            EmailSender.Verify(_ => _.SendEmailAsync(It.IsAny<Email>(), It.IsAny<CancellationToken>()), Times.Never);
        }
    }
}
