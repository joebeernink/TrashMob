using System;
using System.Collections.Generic;

namespace TrashMobMobile.Models
{
    public class DeviceInstallation
    {
        public string InstallationId { get; set; }

        public string Platform { get; set; }

        public string PushChannel { get; set; }

        public List<string> Tags { get; set; } = new List<string>();
    }
}