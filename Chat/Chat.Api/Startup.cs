using System;
using System.Threading.Tasks;
using Microsoft.Owin;
using Owin;
using System.Web.Http;
using System.Net.Http.Headers;

[assembly: OwinStartup(typeof(Chat.Api.Startup))]

namespace Chat.Api
{
    public class Startup
    {

        public static void Configuration(IAppBuilder app)
        {
            var httpConfiguration = CreateHttpConfiguration();
            app.MapSignalR();
            app.UseWebApi(httpConfiguration);
        }

        public static HttpConfiguration CreateHttpConfiguration()
        {
            var config = new HttpConfiguration();

            config.MapHttpAttributeRoutes();
            //change return type data to json
            config.Formatters.JsonFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/html"));


            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
               defaults: new { id = RouteParameter.Optional }
               );
            return config;
        }
    }
}
