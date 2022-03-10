﻿namespace TrashMob.Shared.Persistence
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.EntityFrameworkCore;
    using TrashMob.Shared.Models;

    public class EventTypeRepository : IEventTypeRepository
    {
        private readonly MobDbContext mobDbContext;

        public EventTypeRepository(MobDbContext mobDbContext)
        {
            this.mobDbContext = mobDbContext;
        }

        public async Task<IEnumerable<EventType>> GetAllEventTypes(CancellationToken cancellationToken = default)
        {
            return await mobDbContext.EventTypes.Where(e => e.IsActive == true)
                .AsNoTracking()
                .ToListAsync(cancellationToken: cancellationToken).ConfigureAwait(false);
        }
    }
}
