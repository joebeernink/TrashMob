﻿namespace TrashMob.Shared.Engine
{
    public enum NotificationTypeEnum    
    {
        EventSummaryAttendee = 1,
        EventSummaryHostReminder = 2,
        UpcomingEventAttendingThisWeek = 3,
        UpcomingEventAttendingToday = 4,
        UpcomingEventHostingThisWeek = 5,
        UpcomingEventHostingToday = 6,
        UpcomingEventsInYourAreaThisWeek = 7,
        UpcomingEventsInYourAreaToday = 8,
        Generic = 9,
        WelcomeToTrashMob = 10,
        EventPartnerRequest = 11,
        EventPartnerResponse = 12,
        PartnerRequestAccepted = 13,
        PartnerRequestDeclined = 14,
        EventCancelledNotice = 15,
        ContactRequestReceived = 16,
    }
}
