namespace TrashMobMobile.Droid
{
    using Android.App;
    using Android.Content;
    using AndroidX.Core.App;
    using WindowsAzure.Messaging.NotificationHubs;

    public class AzureListener : Java.Lang.Object, INotificationListener
    {
        public void OnPushNotificationReceived(Context context, INotificationMessage message)
        {
            /*Context currContext = Application.Context;*/
            var intent = new Intent(context, typeof(MainActivity));
            intent.AddFlags(ActivityFlags.ClearTop);
            var pendingIntent = PendingIntent.GetActivity(Android.App.Application.Context, 0, intent, PendingIntentFlags.OneShot);

            var notificationBuilder = new NotificationCompat.Builder(context, AppConstants.NotificationChannelName);

            notificationBuilder.SetContentTitle(message.Title)
                        .SetSmallIcon(Resource.Drawable.ic_launcher)
                        .SetContentText(message.Body)
                        .SetAutoCancel(true)
                        .SetShowWhen(false)
                        .SetContentIntent(pendingIntent);

            var notificationManager = NotificationManager.FromContext(context);

            notificationManager.Notify(0, notificationBuilder.Build());
        }
    }
}