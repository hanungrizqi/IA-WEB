using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;

namespace API_AUDIT_WPI
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            // Configure Web API to use only bearer token authentication.
            //config.SuppressDefaultHostAuthentication();
            //config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));
            config.MessageHandlers.Add(new CorsHandler());
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            EnableCorsAttribute cors = new EnableCorsAttribute("*", "*", "GET,POST");
            //EnableCorsAttribute cors = new EnableCorsAttribute("http://localhost:57074,http://10.14.101.111:7676,http://10.14.101.111:7677", "*", "GET,POST");

            //EnableCorsAttribute cors2 = new EnableCorsAttribute("http://10.14.101.111:7676", "*", "GET,POST");
            config.EnableCors(cors);
            //config.EnableCors(cors2);
        }
    }
}
