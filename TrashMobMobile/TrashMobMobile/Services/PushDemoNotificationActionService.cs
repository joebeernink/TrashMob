using System;
using System.Collections.Generic;
using System.Linq;
using TrashMobMobile.Models;

namespace TrashMobMobile.Services
{
    public class PushDemoNotificationActionService : IPushDemoNotificationActionService
    {
        readonly Dictionary<string, PushTrashMobAction> _actionMappings = new Dictionary<string, PushTrashMobAction>
        {
            { "action_a", PushTrashMobAction.ActionA },
            { "action_b", PushTrashMobAction.ActionB }
        };

        public event EventHandler<PushTrashMobAction> ActionTriggered = delegate { };

        public void TriggerAction(string action)
        {
            if (!_actionMappings.TryGetValue(action, out var pushAction))
                return;

            List<Exception> exceptions = new List<Exception>();

            foreach (var handler in ActionTriggered?.GetInvocationList())
            {
                try
                {
                    handler.DynamicInvoke(this, pushAction);
                }
                catch (Exception ex)
                {
                    exceptions.Add(ex);
                }
            }

            if (exceptions.Any())
                throw new AggregateException(exceptions);
        }
    }
}