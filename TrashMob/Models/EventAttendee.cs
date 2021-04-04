﻿#nullable disable

namespace TrashMob.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public partial class EventAttendee
    {
        public Guid EventId { get; set; }

        public Guid UserId { get; set; }
        
        public DateTimeOffset SignUpDate { get; set; }
        
        public DateTimeOffset? CanceledDate { get; set; }
        
        public virtual Event Event { get; set; }
        
        public virtual User User { get; set; }
    }
}
