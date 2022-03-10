namespace TrashMobMobile.Views
{
    using System;
    using Xamarin.Essentials;
    using Xamarin.Forms;
    using Xamarin.Forms.Xaml;

    using TrashMobMobile.Services;
    using TrashMobMobile.ViewModels;

    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class LoginPage : ContentPage
    {
        private readonly INotificationRegistrationService notificationRegistrationService;

        public LoginPage()
        {
            this.notificationRegistrationService = ServiceContainer.Resolve<INotificationRegistrationService>();
            InitializeComponent();
            BindingContext = App.GetViewModel<LoginViewModel>();
        }

        protected override async void OnAppearing()
        {
            base.OnAppearing();
            
            // TODO This logic should be moved to VM
            var isLoggedIn = await Xamarin.Essentials.SecureStorage.GetAsync("isLogged");

            if (isLoggedIn == "1")
            {
                await Shell.Current.GoToAsync($"//{nameof(MobEventsPage)}");
            }
        }


        void RegisterButtonClicked(object sender, EventArgs e)
            => notificationRegistrationService.RegisterDeviceAsync().ContinueWith((task)
                => {
                    ShowAlert(task.IsFaulted ?
                       task.Exception.Message :
                       $"Device registered");
                });

        void DeregisterButtonClicked(object sender, EventArgs e)
            => notificationRegistrationService.DeregisterDeviceAsync().ContinueWith((task)
                => {
                    ShowAlert(task.IsFaulted ?
                      task.Exception.Message :
                      $"Device deregistered");
                });

        void ShowAlert(string message)
            => MainThread.BeginInvokeOnMainThread(()
                => App.Current.MainPage.DisplayAlert("TrashMob", message, "OK").ContinueWith((task)
                    => { if (task.IsFaulted) throw task.Exception; }));
    }
}