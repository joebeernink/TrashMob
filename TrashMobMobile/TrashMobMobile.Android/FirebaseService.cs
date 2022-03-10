﻿namespace TrashMobMobile.Droid
{
    using Android.App;
    using Android.Content;
    using Android.OS;
    using Android.Util;
    using AndroidX.Core.App;
    using Firebase.Messaging;
    using System;
    using System.Linq;
    using WindowsAzure.Messaging;

    [Service]
    [IntentFilter(new[] { "com.google.firebase.MESSAGING_EVENT" })]
    public class FirebaseService : FirebaseMessagingService
    {
        int messageId = 0;
        const string channelId = "default";
        const string channelName = "Default";
        const string channelDescription = "The default channel for notifications.";

        bool channelInitialized = false;
        INotificationManager notificationManager;

        public FirebaseService()
        {
            notificationManager = new AndroidNotificationManager();
        }

        public override void OnNewToken(string token)
        {
            // NOTE: save token instance locally, or log if desired

            SendRegistrationToServer(token);
        }

        void SendRegistrationToServer(string token)
        {
            try
            {
                NotificationHub hub = new NotificationHub(AppConstants.NotificationHubName, AppConstants.ListenConnectionString, this);

                // register device with Azure Notification Hub using the token from FCM
                Registration registration = hub.Register(token, AppConstants.SubscriptionTags);

                // subscribe to the SubscriptionTags list with a simple template.
                string pnsHandle = registration.PNSHandle;
                TemplateRegistration templateReg = hub.RegisterTemplate(pnsHandle, "defaultTemplate", AppConstants.FCMTemplateBody, AppConstants.SubscriptionTags);
            }
            catch (Exception e)
            {
                Log.Error(AppConstants.DebugTag, $"Error registering device: {e.Message}");
            }
        }

        public override void OnMessageReceived(RemoteMessage message)
        {
            base.OnMessageReceived(message);
            string messageBody;

            if (message.GetNotification() != null)
            {
                messageBody = message.GetNotification().Body;
            }

            // NOTE: test messages sent via the Azure portal will be received here
            else
            {
                messageBody = message.Data.Values.First();
            }

            // convert the incoming message to a local notification

            AndroidNotificationManager.Instance.SendNotification("Header",messageBody);

            // send the incoming message directly to the MainPage
            //SendMessageToMainPage(messageBody);
        }

        void SendMessageToMainPage(string body)
        {
            //Todo: add code to handle message
        }
    }
}