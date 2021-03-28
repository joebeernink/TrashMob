﻿#nullable disable

namespace TrashMob.Models
{
    using System;

    public partial class EventAttendee
    {
        public Guid EventId { get; set; }
        public Guid UserId { get; set; }
        public DateTimeOffset SignUpDate { get; set; }
        public DateTimeOffset? CanceledDate { get; set; }
        public DateTimeOffset? ArrivalTime { get; set; }
        public DateTimeOffset? DepartureTime { get; set; }

        public virtual Event Event { get; set; }
        public virtual ApplicationUser User { get; set; }
    }
}