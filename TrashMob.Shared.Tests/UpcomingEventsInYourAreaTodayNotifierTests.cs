namespace TrashMob.Shared.Tests
{
    using Moq;
    using System.Threading.Tasks;
    using TrashMob.Shared.Engine;
    using TrashMob.Shared.Persistence;
    using Xunit;

    public class UpcomingEventsInYourAreaTodayNotifierTests
    {
        private readonly Mock<IEventRepository> eventRepository;
        private readonly Mock<IEventAttendeeRepository> eventAttendeeRepository;
        private readonly Mock<IUserRepository> userRepository;

        public UpcomingEventsInYourAreaTodayNotifierTests()
        {
            eventRepository = new Mock<IEventRepository>();
            eventAttendeeRepository = new Mock<IEventAttendeeRepository>();
            userRepository = new Mock<IUserRepository>();
        }

        [Fact]
        public async Task GenerateNotificationsAsync_WithNoDataAvailable_Succeeds()
        {
            var engine = new UpcomingEventsInYourAreaTodayNotifier(eventRepository.Object, userRepository.Object, eventAttendeeRepository.Object);

            await engine.GenerateNotificationsAsync().ConfigureAwait(false);
        }
    }
}
