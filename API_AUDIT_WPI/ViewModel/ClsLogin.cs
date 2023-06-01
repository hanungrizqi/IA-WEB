using API_AUDIT_WPI.Models;
using FormsAuth;
using System;
using System.Collections.Generic;
using System.DirectoryServices;
using System.Linq;
using System.Web;

namespace API_AUDIT_WPI.ViewModel
{
    public class ClsLogin
    {
        Audit_WpiDataContext db = new Audit_WpiDataContext();

        public string Username { get; set; }
        public string Password { get; set; }
        public string Jobsite { get; set; }

        public bool Login()
        {
            bool status = false;
            bool status_login = false;
            string nrp = "";

            if (Username.Count() > 7)
            {
                nrp = Username.Substring(Username.Length - 7);
            }
            else
            {
                nrp = Username;
            }


            status_login = CheckValidLogin();
            if (status_login == false)
            {
                status_login = OpenLdap(Username, Password);
            }

            if (status_login == true)
            {

                var data_user = db.VW_KARYAWAN_ALLs.Where(x => x.EMPLOYEE_ID == nrp).SingleOrDefault();
                if (data_user.DSTRCT_CODE == Jobsite || data_user.DSTRCT_CODE == "KPHO")
                {
                    status = true;
                }
                else
                {
                    status = false;
                }
            }

            return status;
            //return status_login;

        }


        public bool CheckValidLogin()
        {
            bool stat = false;

            try
            {
                var ldap = new LdapAuthentication("LDAP://KPPMINING:389");
                //stat = ldap.IsAuthenticated("KPPMINING", Username, Password);
                stat = true;
            }
            catch (Exception)
            {
                stat = false;
            }

            return stat;
        }

        public bool OpenLdap(string username = "", string password = "")
        {
            bool status = true;
            String uid = "cn=" + username + ",ou=Users,dc=kpp,dc=net";

            DirectoryEntry root = new DirectoryEntry("LDAP://10.12.101.102", uid, password, AuthenticationTypes.None);

            try
            {
                object connected = root.NativeObject;
                status = true;

            }
            catch (Exception)
            {
                status = false;
            }

            return status;
        }
    }
}