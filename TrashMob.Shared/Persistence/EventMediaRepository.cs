﻿namespace TrashMob.Shared.Persistence
{
    using Microsoft.EntityFrameworkCore;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using TrashMob.Shared.Models;

    public class EventMediaRepository : IEventMediaRepository
    {
        private readonly MobDbContext mobDbContext;

        public EventMediaRepository(MobDbContext mobDbContext)
        {
            this.mobDbContext = mobDbContext;
        }

        public async Task<IEnumerable<EventMedia>> GetEventMedias(CancellationToken cancellationToken = default)
        {
            return await mobDbContext.EventMedias
                .AsNoTracking()
                .ToListAsync(cancellationToken: cancellationToken).ConfigureAwait(false);
        }

        public async Task<IEnumerable<EventMedia>> GetEventMediasByEvent(Guid eventId, CancellationToken cancellationToken = default)
        {
            return await mobDbContext.EventMedias.Where(em => em.EventId == eventId)
                .AsNoTracking()
                .ToListAsync(cancellationToken: cancellationToken).ConfigureAwait(false);
        }

        public async Task<IEnumerable<EventMedia>> GetEventMediasByUser(Guid userId, CancellationToken cancellationToken = default)
        {
            return await mobDbContext.EventMedias.Where(em => em.CreatedByUserId == userId)
                .AsNoTracking()
                .ToListAsync(cancellationToken: cancellationToken).ConfigureAwait(false);
        }

        public async Task<EventMedia> GetEventMediaById(Guid eventMediaId, CancellationToken cancellationToken = default)
        {
            return await mobDbContext.EventMedias.FirstOrDefaultAsync(em => em.Id == eventMediaId, cancellationToken: cancellationToken).ConfigureAwait(false);
        }

        // Add new EventMedia record     
        public async Task<EventMedia> AddUpdateEventMedia(EventMedia eventMedia)
        {
            if (eventMedia.Id == Guid.Empty)
            {
                eventMedia.Id = Guid.NewGuid();
                eventMedia.CreatedDate = DateTimeOffset.UtcNow;
                eventMedia.LastUpdatedDate = DateTimeOffset.UtcNow;
                mobDbContext.EventMedias.Add(eventMedia);
            }
            else
            {
                mobDbContext.Entry(eventMedia).State = EntityState.Modified;
                eventMedia.LastUpdatedDate = DateTimeOffset.UtcNow;
            }

            await mobDbContext.SaveChangesAsync().ConfigureAwait(false);
            return await mobDbContext.EventMedias.FindAsync(eventMedia.Id).ConfigureAwait(false);
        }

        // Delete the record of a particular Mob Event    
        public async Task<int> DeleteEventMedia(Guid id)
        {
            var eventMedia = await mobDbContext.EventMedias.FindAsync(id).ConfigureAwait(false);
            mobDbContext.EventMedias.Remove(eventMedia);
            return await mobDbContext.SaveChangesAsync().ConfigureAwait(false);
        }
    }
}
