using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using AUDIT_WPI.Models;

namespace AUDIT_WPI.Controllers
{
    public class MasterController : Controller
    {
        AUDIT_WPIDataContext db = new AUDIT_WPIDataContext();
        public ActionResult Sliders()
        {
            if (Session["nrp"] == null)
            {
                return RedirectToAction("index", "login");
            }
            return View();
        }
        public ActionResult TentangIAWEB()
        {
            if (Session["nrp"] == null)
            {
                return RedirectToAction("index", "login");
            }
            return View();
        }
        public ActionResult PublikasiLayanan()
        {
            if (Session["nrp"] == null)
            {
                return RedirectToAction("index", "login");
            }
            return View();
        }
        
        public ActionResult GetTentangIAData(string id)
        {
            try
            {
                //var data = db.TBL_R_TENTANG_IA_WEBs.ToList();
                var data = db.TBL_R_TENTANG_IA_WEBs.Where(a => a.PATH_CONTENT == id).ToList();
                return View();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        public ActionResult Insert_Content()
        {
            try
            {
                var httpRequest = HttpContext.Request;
                var files = httpRequest.Files;
                var attachmentUrls = new List<string>();
                var nameContent = HttpContext.Request.Form["nameContent"];

                if (files.Count > 0)
                {
                    foreach (string file in files)
                    {
                        var postedFile = files[file];
                        var fileName = postedFile.FileName;
                        var folderPath = HttpContext.Server.MapPath("~/Content/ContentFile");

                        if (!Directory.Exists(folderPath))
                        {
                            Directory.CreateDirectory(folderPath);
                        }

                        var filePath = Path.Combine(folderPath, fileName);
                        if (System.IO.File.Exists(filePath))
                        {
                            return Json(new { Remarks = false });
                        }

                        // Simpan file dan atur atribut menjadi FileAttributes.Normal
                        using (var fileStream = System.IO.File.Create(filePath))
                        {
                            postedFile.InputStream.CopyTo(fileStream);
                            fileStream.Flush();
                        }
                        System.IO.File.SetAttributes(filePath, FileAttributes.Normal);

                        var attachmentUrl = Url.Content("~/Content/ContentFile/" + fileName);
                        attachmentUrls.Add(attachmentUrl);
                    }

                    using (var dbContext = new AUDIT_WPIDataContext())
                    {
                        foreach (var attachmentUrl in attachmentUrls)
                        {
                            var content = new TBL_R_TENTANG_IA_WEB
                            {
                                NAME_CONTENT = nameContent,
                                PATH_CONTENT = attachmentUrl,
                            };

                            dbContext.TBL_R_TENTANG_IA_WEBs.InsertOnSubmit(content);
                        }

                        dbContext.SubmitChanges();
                    }

                    return Json(new { Remarks = true, AttachmentUrls = attachmentUrls });
                }
                else
                {
                    return BadRequest("No file found in the request.");
                }
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        public ActionResult Delete_Content(int id)
        {
            try
            {
                var data = db.TBL_R_TENTANG_IA_WEBs.Where(a => a.ID == id).FirstOrDefault();

                // Menghapus file dari folder
                if (!string.IsNullOrEmpty(data.PATH_CONTENT))
                {
                    //string filePath = HttpContext.Current.Server.MapPath(data.PATH_CONTENT);
                    string virtualPath = data.PATH_CONTENT;
                    string baseImagePath = System.Web.HttpContext.Current.Server.MapPath("~/Content/ContentFile/");
                    string imagePath = Path.Combine(baseImagePath, Path.GetFileName(virtualPath));
                    imagePath = Uri.UnescapeDataString(imagePath);
                    if (System.IO.File.Exists(imagePath)) 
                    //if (File.Exists(imagePath)) 
                    {
                        FileAttributes attributes = System.IO.File.GetAttributes(imagePath);
                        bool isHidden = (attributes & FileAttributes.Hidden) == FileAttributes.Hidden;

                        if (isHidden)
                        {
                            System.IO.File.Delete(imagePath);
                        }
                        else
                        {
                            //return BadRequest("The file is not hidden.");
                            System.IO.File.Delete(imagePath);
                        }
                    }
                    else
                    {
                        return (ActionResult)NotFound();
                    }
                }
                db.TBL_R_TENTANG_IA_WEBs.DeleteOnSubmit(data);
                db.SubmitChanges();
                return Json(new { Remarks = true });
            }
            catch (Exception e)
            {
                return Json(new { Remarks = false, Message = e });
            }
        }

        private IHttpActionResult NotFound()
        {
            throw new NotImplementedException();
        }

        private ActionResult BadRequest()
        {
            throw new NotImplementedException();
        }

        private ActionResult BadRequest(string v)
        {
            throw new NotImplementedException();
        }
    }
}