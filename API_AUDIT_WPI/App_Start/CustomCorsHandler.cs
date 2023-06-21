using System.Net.Http;
using System.Threading.Tasks;
using System.Threading;

namespace API_AUDIT_WPI
{
    internal class CustomCorsHandler : DelegatingHandler
    {
        protected override async Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request,
        CancellationToken cancellationToken)
        {
            var response = await base.SendAsync(request, cancellationToken);

            // Set Access-Control-Allow-Origin header
            response.Headers.Add("Access-Control-Allow-Origin", "*");

            return response;
        }
    }
}