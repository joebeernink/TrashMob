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

        public static string ApiKey = "AAAA50g5900:APA91bFv1IMWHzUz-41z4wxVL4NX6I5b6TQ19Dm5Fjg0aVQ1STU5j3CFFdzeNqdfdIWiM_s1xFwmevGu-1kiyOk2oyf0lyOJlZsguETDVFfpk37eDyKljfddzfDL6DUlbD8D9LKBqJ7Q";

        public static string NotificationChannelName { get; set; } = "XamarinNotifyChannel";

        public static string NotificationHubName { get; set; } = "nh-tm-dev-westus2";
        
/*        public static string ListenConnectionString { get; set; } = "<add before starting - do not check in>";
*/        public static string ListenConnectionString { get; set; } = "Endpoint=sb://nhns-tm-dev-westus2.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=C/h41yLczrlOxg2L7R1570CmPHPvi360FT1y5zI3GmQ=";


        public static string DebugTag { get; set; } = "XamarinNotify";
        
        public static string[] SubscriptionTags { get; set; } = { "default" };
        
        public static string FCMTemplateBody { get; set; } = "{\"data\":{\"message\":\"$(messageParam)\"}}";
        
        public static string APNTemplateBody { get; set; } = "{\"aps\":{\"alert\":\"$(messageParam)\"}}";
    }
}
