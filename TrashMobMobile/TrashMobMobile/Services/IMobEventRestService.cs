﻿namespace TrashMobMobile.Services
{
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using TrashMobMobile.Models;

    public interface IMobEventRestService
    {
        Task<IEnumerable<MobEvent>> GetActiveEventsAsync();

        Task<IEnumerable<MobEvent>> GetUserEventsAsync(Guid userId, bool showFutureEventsOnly);

        Task<MobEvent> GetEventAsync(Guid eventId);

        Task<MobEvent> UpdateEventAsync(MobEvent mobEvent);

        Task<MobEvent> AddEventAsync(MobEvent mobEvent);

        Task DeleteEventAsync(CancelEvent cancelEvent);

        Task<IEnumerable<MobEvent>> GetEventsUserIsAttending(Guid userId);
    }
}