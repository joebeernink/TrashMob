using System;
using TrashMobMobile.Models;

namespace TrashMobMobile.Services
{
    public interface IPushNotificationActionService : INotificationActionService
    {
        event EventHandler<PushAction> ActionTriggered;
    }
}