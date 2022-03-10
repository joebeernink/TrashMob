﻿namespace TrashMob.Shared.Persistence
{
    using System.Collections.Generic;
    using System.Threading;
    using System.Threading.Tasks;
    using TrashMob.Shared.Models;

    public interface IEventStatusRepository
    {
        Task<IEnumerable<EventStatus>> GetAllEventStatuses(CancellationToken cancellationToken = default);
    }
}
