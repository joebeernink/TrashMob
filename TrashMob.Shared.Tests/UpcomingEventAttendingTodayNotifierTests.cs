namespace TrashMob.Shared.Tests
{
    using TrashMob.Shared.Engine;
    using Xunit;

    public class UpcomingEventAttendingTodayNotifierTests :  UpcomingEventAttendingNotifierTestsBase
    {
        protected override NotificationTypeEnum NotificationType => NotificationTypeEnum.UpcomingEventAttendingSoon;

        protected override INotificationEngine Engine => new UpcomingEventAttendingSoonNotifier(EventRepository.Object, UserRepository.Object, EventAttendeeRepository.Object, UserNotificationRepository.Object, NonEventUserNotificationRepository.Object, EmailSender.Object, EmailManager.Object, MapRepository.Object, Logger.Object);

        protected override int NumberOfDaysToAddForEventOutOfWindow => 2;
    }
}
