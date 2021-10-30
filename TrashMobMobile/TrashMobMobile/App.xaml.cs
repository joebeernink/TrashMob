﻿namespace TrashMobMobile
{
    using TrashMobMobile.Services;
    using TrashMobMobile.Views;
    using TrashMobMobile.Features.LogOn;
    using Xamarin.Forms;
    using System;
    using Microsoft.Extensions.DependencyInjection;
    using TrashMobMobile.Models;
    using TrashMobMobile.ViewModels;

    public partial class App : Application
    {
        public static string ApiEndpoint = "https://www.trashmob.eco/api/";

        protected static IServiceProvider ServiceProvider { get; set; }

        public App(Action<IServiceCollection> addPlatformServices = null)
        {
            InitializeComponent();

            SetupServices(addPlatformServices);

            MainPage = new NavigationPage(new WelcomePage(ServiceProvider.GetService<IUserManager>()));
        }

        void SetupServices(Action<IServiceCollection> addPlatformServices = null)
        {
            var services = new ServiceCollection();

            // Add platform specific services
            addPlatformServices?.Invoke(services);

            // Add View Models
            services.AddTransient<AboutViewModel>();
            services.AddTransient<ContactUsViewModel>();
            services.AddTransient<EventsMapViewModel>();
            services.AddTransient<ItemDetailViewModel>();
            services.AddTransient<ItemsViewModel>();
            services.AddTransient<LoginViewModel>();
            services.AddTransient<MobEventsViewModel>();
            services.AddTransient<NewItemViewModel>();

            // Add Services
            _ = services.AddSingleton<IB2CAuthenticationService, B2CAuthenticationService>();
            _ = services.AddSingleton<IContactRequestManager, ContactRequestManager>();
            _ = services.AddSingleton<IContactRequestRestService, ContactRequestRestService>();
            _ = services.AddSingleton<IDataStore<Item>, MockDataStore>();
            _ = services.AddSingleton<IMobEventManager, MobEventManager>();
            _ = services.AddSingleton<IMobEventRestService, MobEventRestService>();
            _ = services.AddSingleton<IUserManager, UserManager>();
            _ = services.AddSingleton<IUserRestService, UserRestService>();

            ServiceProvider = services.BuildServiceProvider();
        }
        public static BaseViewModel GetViewModel<TViewModel>() where TViewModel : BaseViewModel
                => ServiceProvider.GetService<TViewModel>();

        protected override void OnStart()
        {
        }

        protected override void OnSleep()
        {
        }

        protected override void OnResume()
        {
        }
    }
}
