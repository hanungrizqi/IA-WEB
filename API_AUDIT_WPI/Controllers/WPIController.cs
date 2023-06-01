using API_AUDIT_WPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace API_AUDIT_WPI.Controllers
{
    [RoutePrefix("api/WPI")]
    public class WPIController : ApiController
    {
        Audit_WpiDataContext db = new Audit_WpiDataContext();
    }
}
