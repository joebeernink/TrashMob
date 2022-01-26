using System;
using TrashMobMobile.Models;

namespace TrashMobMobile.Services
{
    public interface IPushDemoNotificationActionService : INotificationActionService
    {
        event EventHandler<PushTrashMobAction> ActionTriggered;
    }
}