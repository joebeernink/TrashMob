namespace TrashMobMobile
{
    using System;

    public static class AppConstants
    {
        public const string PrivacyPolicyVersion = "0.3";
        public static DateTimeOffset PrivacyPolicyDate = new DateTimeOffset(2021, 5, 14, 0, 0, 0, TimeSpan.Zero);
        public const string TermsOfServiceVersion = "0.3";
        public static DateTimeOffset TermsOfServiceDate = new DateTimeOffset(2021, 5, 14, 0, 0, 0, TimeSpan.Zero);
        public static string ApiEndpoint = "https://as-tm-dev-westus2.azurewebsites.net/api/";

        // Do not check in secret
        public static string ApiKey = "<API_KEY>";

        public static string NotificationChannelName { get; set; } = "XamarinNotifyChannel";

        public static string NotificationHubName { get; set; } = "nh-tm-dev-westus2";

        // Do not check in secret
        public static string ListenConnectionString { get; set; } = "<CONNECTION_STRING>";

        public static string DebugTag { get; set; } = "XamarinNotify";
        
        public static string[] SubscriptionTags { get; set; } = { "default" };
        
        public static string FCMTemplateBody { get; set; } = "{\"data\":{\"message\":\"$(messageParam)\"}}";
        
        public static string APNTemplateBody { get; set; } = "{\"aps\":{\"alert\":\"$(messageParam)\"}}";
    }
}
