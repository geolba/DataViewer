using System;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using DataViewer.app;

namespace DataViewer
{
    public partial class Index : System.Web.UI.Page
    {
        private const string WEB_ROOT = "~/tdv/";
        private const string DEFAULT_LANGUAGE = "en";
        public string Url = string.Empty;
        public string ItemName = string.Empty;

        protected static string CurrentPageURL(string id)
        {
            return string.Format("{0}Index.aspx?id={1}", WEB_ROOT, id);
        }       

        protected void Page_Load(object sender, EventArgs e)
        {           
            if(!base.Request.QueryString.AllKeys.Any(k => k == "url"))
            {
                throw new TermNotSpecifiedException();
            }
            this.Url = App.urlParam(Request["url"]);

            SqlConnection sqlConnection = App.db();
            var cmd = sqlConnection.CreateCommand();

            try
            {
                //cmd.CommandText = "SELECT PrefLabelEn, PrefLabelDe FROM THESAURUS_concept WHERE URI='" + Url + "'";
                //var reader = cmd.ExecuteReader();
                // Create the Command and Parameter objects.
                // Provide the query string with a parameter placeholder.
                string cmdText = "SELECT PrefLabelEn, PrefLabelDe FROM gba.THESAURUS_concept WHERE URI= @url";
                SqlCommand sqlCommand = new SqlCommand(cmdText, sqlConnection);
                sqlCommand.Parameters.AddWithValue("@url", this.Url);
                SqlDataReader sqlDataReader = sqlCommand.ExecuteReader();
                if (!sqlDataReader.Read())
                {
                    throw new TermNotFoundException(this.Url);
                }
                this.ItemName = (sqlDataReader[0] as string);
            }
            finally
            {
                sqlConnection.Close();
            }

        }

        protected void Page_Error(object sender, EventArgs e)
        {
            Exception lastError = base.Server.GetLastError();
            if (lastError is TermNotSpecifiedException)
            {
                HttpContext.Current.Response.Redirect(WEB_ROOT + "TermNotSpecified.aspx", true);                
            }
            else if (lastError is TermNotFoundException)
            {
                HttpContext.Current.Response.Redirect(WEB_ROOT + "TermNotFound.aspx?id=" + lastError.Data["URI"]);
            }
            else if (lastError is SqlException)
            {
                HttpContext.Current.Response.Redirect(WEB_ROOT + "DatabaseNotFound.aspx", true);
            }
        }

    }
}