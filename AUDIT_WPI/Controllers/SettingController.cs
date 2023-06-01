using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AUDIT_WPI.Models;

namespace AUDIT_WPI.Controllers
{
    public class SettingController : Controller
    {
        AUDIT_WPIDataContext db = new AUDIT_WPIDataContext();
        public ActionResult Users()
        {
            if (Session["nrp"] == null)
            {
                return RedirectToAction("index", "login");
            }
            ViewBag.Emp = db.VW_KARYAWAN_ALLs.ToList();
            ViewBag.Group = db.TBL_M_ROLEs.ToList();
            return View();
        }

        public ActionResult Menu()
        {
            if (Session["nrp"] == null)
            {
                return RedirectToAction("index", "login");
            }
            ViewBag.Group = db.TBL_M_ROLEs.ToList();
            return View();
        }
    }
}