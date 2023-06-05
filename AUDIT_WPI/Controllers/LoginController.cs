using AUDIT_WPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AUDIT_WPI.Controllers
{
    public class LoginController : Controller
    {
        AUDIT_WPIDataContext db = new AUDIT_WPIDataContext();
        // GET: Login
        public ActionResult Index()
        {
            Session["Web_Link"] = System.Configuration.ConfigurationManager.AppSettings["WebApp_Link"].ToString();
            return View();
        }

        public JsonResult MakeSession(string NRP/*, string Jobsite, string Roled*/)
        {
            string nrp = "";

            if (NRP.Count() > 7)
            {
                nrp = NRP.Substring(NRP.Length - 7);
            }
            else
            {
                nrp = NRP;
            }
            var dataUser = db.VW_KARYAWAN_ALLs.Where(a => a.EMPLOYEE_ID == nrp).FirstOrDefault();
            var dataRole = db.TBL_M_USERs.Where(a => a.Username == nrp).FirstOrDefault();
            var dataRoledakun = db.TBL_M_ROLEs.Where(a => a.ID == dataRole.ID_Role).FirstOrDefault();

            if (dataRole != null)
            {
                //if (Jobsite == null || Jobsite == "")
                //{
                //    return new JsonResult() { Data = new { Remarks = false, Message = "Jobsite tidak sesuai" }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                //}
                //if (Roled == null || Roled == "" || Roled != dataRoledakun.RoleName)
                //{
                //    return new JsonResult() { Data = new { Remarks = false, Message = "Role tidak sesuai" }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                //}

                Session["Web_Link"] = System.Configuration.ConfigurationManager.AppSettings["WebApp_Link"].ToString();
                Session["Nrp"] = nrp;
                Session["ID_Role"] = dataRole.ID_Role;
                Session["Name"] = dataUser.NAME;
                //Session["Site"] = Jobsite;
                //Session["Role"] = dataRoledakun.RoleName;
                return new JsonResult() { Data = new { Remarks = true }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            else
            {
                return new JsonResult() { Data = new { Remarks = false, Message = "Maaf anda tidak memiliki akses ke AUDIT-WPI" }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }

        }

        public ActionResult Logout()
        {
            Session.RemoveAll();

            return RedirectToAction("Index", "Login");
        }
    }
}