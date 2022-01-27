using System;
using System.Threading.Tasks;
using Android.App;
using Android.Gms.Common;
using static Android.Provider.Settings;
using Firebase.Messaging;

using TrashMobMobile.Models;
using TrashMobMobile.Services;

namespace TrashMobMobile.Droid
{
    public class DeviceInstallationService : IDeviceInstallationService
    {
        public string Token { get; set; }

        public bool NotificationsSupported
            => GoogleApiAvailability.Instance
                .IsGooglePlayServicesAvailable(Application.Context) == ConnectionResult.Success;

        public string GetDeviceId()
            => Secure.GetString(Application.Context.ContentResolver, Secure.AndroidId);

        public async Task<DeviceInstallation> GetDeviceInstallation(params string[] tags)
        {
            if (!NotificationsSupported)
                throw new Exception(GetPlayServicesError());

            if (string.IsNullOrWhiteSpace(Token))
            {
                Console.WriteLine("Generating new token for FCM");
                await Task.Run(() =>
                {
                    var token = FirebaseMessaging.Instance.GetToken();
                    // update saved token, send it to the backend, etc.
                    Token = token.ToString();
                });
            }

            var installation = new DeviceInstallation
            {
                InstallationId = GetDeviceId(),
                Platform = "fcm",
                PushChannel = Token
            };

            installation.Tags.AddRange(tags);

            return installation;
        }

        string GetPlayServicesError()
        {
            int resultCode = GoogleApiAvailability.Instance.IsGooglePlayServicesAvailable(Application.Context);

            if (resultCode != ConnectionResult.Success)
                return GoogleApiAvailability.Instance.IsUserResolvableError(resultCode) ?
                           GoogleApiAvailability.Instance.GetErrorString(resultCode) :
                           "This device is not supported";

            return "An error occurred preventing the use of push notifications";
        }
    }
}