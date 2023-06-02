using API_AUDIT_WPI.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace API_AUDIT_WPI.Controllers
{
    [RoutePrefix("api/Master")]
    public class MasterController : ApiController
    {
        Audit_WpiDataContext db = new Audit_WpiDataContext();

        [HttpGet]
        [Route("Get_Jobsite")]
        public IHttpActionResult Get_Jobsite()
        {
            try
            {
                var data = db.VW_M_JOBSITEs.OrderBy(a => a.DSTRCT_CODE).ToList();

                return Ok(new { Data = data, Total = data.Count() });
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpGet]
        [Route("Get_Roled")]
        public IHttpActionResult Get_Roled()
        {
            try
            {
                var data = db.TBL_M_ROLEs.ToList();

                return Ok(new { Data = data, Total = data.Count() });
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpGet]
        [Route("Get_JobsiteByUsername")]
        public IHttpActionResult Get_JobsiteByUsername(string username = "")
        {
            try
            {
                var data = db.VW_MSF020s.Where(x => x.ENTITY == username).ToList();

                return Ok(new { Data = data, Total = data.Count() });
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpGet]
        [Route("Get_Employee")]
        public IHttpActionResult Get_Employee()
        {
            try
            {
                var data = db.VW_KARYAWAN_ALLs.ToList();

                return Ok(new { Data = data, Total = data.Count() });
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpGet]
        [Route("Get_Employee/{id}")]
        public IHttpActionResult Get_Employee(string id)
        {
            try
            {
                var data = db.VW_KARYAWAN_ALLs.Where(a => a.EMPLOYEE_ID == id).FirstOrDefault();

                return Ok(new { Data = data });
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        //[HttpPost]
        //[Route("InsertImage")]
        //public IHttpActionResult InsertImage()
        //{
        //    try
        //    {
        //        var httpRequest = HttpContext.Current.Request;
        //        var files = httpRequest.Files;
        //        var attachmentUrls = new List<string>();

        //        if (files.Count > 0)
        //        {
        //            foreach (string file in files)
        //            {
        //                var postedFile = files[file];
        //                //var fileName = Guid.NewGuid().ToString() + Path.GetExtension(postedFile.FileName);
        //                var fileName = postedFile.FileName;
        //                var folderPath = HttpContext.Current.Server.MapPath("~/Content/SliderFile");

        //                if (!Directory.Exists(folderPath))
        //                {
        //                    Directory.CreateDirectory(folderPath);
        //                }

        //                var filePath = Path.Combine(folderPath, fileName);
        //                if (File.Exists(filePath))
        //                {
        //                    return Ok(new { Remarks = false, Message = "Photo already exists." });
        //                }
        //                postedFile.SaveAs(filePath);

        //                var attachmentUrl = Url.Content("~/Content/SliderFile/" + fileName);
        //                attachmentUrls.Add(attachmentUrl);
        //            }

        //            using (var dbContext = new Audit_WpiDataContext())
        //            {
        //                foreach (var attachmentUrl in attachmentUrls)
        //                {
        //                    var slider = new TBL_R_SLIDER
        //                    {
        //                        PATH_SLIDERS = attachmentUrl,
        //                    };

        //                    dbContext.TBL_R_SLIDERs.InsertOnSubmit(slider);
        //                }

        //                dbContext.SubmitChanges();
        //            }

        //            return Ok(new { Remarks = true, AttachmentUrls = attachmentUrls });
        //        }
        //        else
        //        {
        //            return BadRequest("No files found in the request.");
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        return InternalServerError(e);
        //    }
        //}

        [HttpPost]
        [Route("InsertImage")]
        public IHttpActionResult InsertImage()
        {
            try
            {
                var httpRequest = HttpContext.Current.Request;
                var files = httpRequest.Files;
                var attachmentUrls = new List<string>();

                if (files.Count > 0)
                {
                    foreach (string file in files)
                    {
                        var postedFile = files[file];
                        var fileName = postedFile.FileName;
                        var folderPath = HttpContext.Current.Server.MapPath("~/Content/SliderFile");

                        if (!Directory.Exists(folderPath))
                        {
                            Directory.CreateDirectory(folderPath);
                        }

                        var filePath = Path.Combine(folderPath, fileName);
                        if (File.Exists(filePath))
                        {
                            return Ok(new { Remarks = false, Message = "Photo already exists." });
                        }

                        // Simpan file dan atur atribut menjadi FileAttributes.Normal
                        using (var fileStream = File.Create(filePath))
                        {
                            postedFile.InputStream.CopyTo(fileStream);
                            fileStream.Flush();
                        }
                        File.SetAttributes(filePath, FileAttributes.Normal);

                        var attachmentUrl = Url.Content("~/Content/SliderFile/" + fileName);
                        attachmentUrls.Add(attachmentUrl);
                    }

                    using (var dbContext = new Audit_WpiDataContext())
                    {
                        foreach (var attachmentUrl in attachmentUrls)
                        {
                            var slider = new TBL_R_SLIDER
                            {
                                PATH_SLIDERS = attachmentUrl,
                            };

                            dbContext.TBL_R_SLIDERs.InsertOnSubmit(slider);
                        }

                        dbContext.SubmitChanges();
                    }

                    return Ok(new { Remarks = true, AttachmentUrls = attachmentUrls });
                }
                else
                {
                    return BadRequest("No files found in the request.");
                }
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }


        [HttpGet]
        [Route("GetSliderImages")]
        public IHttpActionResult GetSliderImages()
        {
            try
            {
                var folderPath = HttpContext.Current.Server.MapPath("~/Content/SliderFile");
                var sliderImages = new List<string>();

                //using (var dbContext = new Audit_WpiDataContext())
                //{
                //    var sliders = dbContext.TBL_R_SLIDERs.ToList();

                //    foreach (var slider in sliders)
                //    {
                //        var filePath = Path.Combine(folderPath, slider.PATH_SLIDERS);

                //        if (File.Exists(filePath))
                //        {
                //            var imageUrl = Url.Content("~/Content/SliderFile/" + slider.PATH_SLIDERS);
                //            sliderImages.Add(imageUrl);
                //        }
                //    }
                //}
                var hiddenFileOption = SearchOption.AllDirectories;

                var imageFiles = Directory.GetFiles(folderPath, "*", hiddenFileOption);
                foreach (var imagePath in imageFiles)
                {
                    //var imageUrl = Url.Content("~" + imagePath.Replace(folderPath, "").Replace("\\", "/"));
                    var imageUrl = Url.Content("~/Content/SliderFile/" + imagePath.Replace(folderPath, "").Replace("\\", "/").TrimStart('/'));
                    sliderImages.Add(imageUrl);
                }

                return Ok(new { Remarks = true, sliderImages = sliderImages });
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        //[HttpPost]
        //[Route("DeleteImage")]
        //public IHttpActionResult DeleteImage([FromBody]string imageUrl)
        //{
        //    try
        //    {
        //        // Mendapatkan hanya nama file dari URL
        //        string fileName = Path.GetFileName(imageUrl);

        //        // Menghapus file dengan nama yang sama di folder SlideFile jika ada
        //        string slideDirectory = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Content", "SlideFile");

        //        string slideFilePath = Path.Combine(slideDirectory, fileName);

        //        // Menghapus atribut tersembunyi dari folder SlideFile jika ada
        //        DirectoryInfo directoryInfo = new DirectoryInfo(slideDirectory);
        //        if ((directoryInfo.Attributes & FileAttributes.Hidden) == FileAttributes.Hidden)
        //        {
        //            directoryInfo.Attributes = directoryInfo.Attributes & ~FileAttributes.Hidden;
        //        }

        //        // Menghapus atribut tersembunyi dari file gambar jika ada
        //        FileInfo fileInfo = new FileInfo(slideFilePath);
        //        if (fileInfo.Exists)
        //        {
        //            if ((fileInfo.Attributes & FileAttributes.Hidden) == FileAttributes.Hidden)
        //            {
        //                fileInfo.Attributes = fileInfo.Attributes & ~FileAttributes.Hidden;
        //            }

        //            fileInfo.Delete();
        //        }

        //        using (var dbContext = new Audit_WpiDataContext())
        //        {
        //            // Menghapus path dari TBL_R_SLIDER
        //            var slider = dbContext.TBL_R_SLIDERs.FirstOrDefault(s => s.PATH_SLIDERS == imageUrl);
        //            if (slider != null)
        //            {
        //                dbContext.TBL_R_SLIDERs.DeleteOnSubmit(slider);
        //                dbContext.SubmitChanges();
        //            }
        //        }

        //        return Ok(new { Remarks = true });
        //    }
        //    catch (Exception e)
        //    {
        //        return InternalServerError(e);
        //    }
        //}

        [HttpPost]
        public IHttpActionResult DeleteImage([FromBody] string imageUrl)
        {
            try
            {
                // Mendapatkan path fisik dari URL gambar
                string baseImagePath = System.Web.HttpContext.Current.Server.MapPath("~/Content/SliderFile/");
                string imagePath = Path.Combine(baseImagePath, Path.GetFileName(imageUrl));

                if (File.Exists(imagePath))
                {
                    FileAttributes attributes = File.GetAttributes(imagePath);
                    bool isHidden = (attributes & FileAttributes.Hidden) == FileAttributes.Hidden;

                    if (isHidden)
                    {
                        try
                        {
                            File.Delete(imagePath);
                            using (var dbContext = new Audit_WpiDataContext())
                            {
                                // Menghapus path dari TBL_R_SLIDER
                                var slider = dbContext.TBL_R_SLIDERs.FirstOrDefault(s => s.PATH_SLIDERS == imageUrl);
                                if (slider != null)
                                {
                                    dbContext.TBL_R_SLIDERs.DeleteOnSubmit(slider);
                                    dbContext.SubmitChanges();
                                }
                            }
                            return Ok(new { Remarks = true });
                        }
                        catch (Exception ex)
                        {
                            return InternalServerError(ex);
                        }
                    }
                    else
                    {
                        //return BadRequest("The file is not hidden.");
                        File.Delete(imagePath);
                        using (var dbContext = new Audit_WpiDataContext())
                        {
                            // Menghapus path dari TBL_R_SLIDER
                            var slider = dbContext.TBL_R_SLIDERs.FirstOrDefault(s => s.PATH_SLIDERS == imageUrl);
                            if (slider != null)
                            {
                                dbContext.TBL_R_SLIDERs.DeleteOnSubmit(slider);
                                dbContext.SubmitChanges();
                            }
                        }
                        return Ok(new { Remarks = true });
                    }
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

    }
}
