using System;
using System.Configuration;
using System.Data.SqlClient;

namespace DataViewer.app
{
    public class App
    {
        static String dbConnectString = ConfigurationManager.ConnectionStrings["CodePaste"].ConnectionString;
        public static SqlConnection db()
        {
            SqlConnection C = new SqlConnection(dbConnectString);

            try
            {
                C.Open();
            }
            catch (SqlException Ex)
            {
                throw Ex;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
            return C;
        }
        public static string entityConnectionString()
        {
            string connectionString  = dbConnectString;
            System.Data.SqlClient.SqlConnectionStringBuilder scsb = new System.Data.SqlClient.SqlConnectionStringBuilder(connectionString);

            System.Data.Entity.Core.EntityClient.EntityConnectionStringBuilder ecb = new System.Data.Entity.Core.EntityClient.EntityConnectionStringBuilder();
           ecb.Metadata = "res://*/Models.ThesaurusModel.csdl|res://*/Models.ThesaurusModel.ssdl|res://*/Models.ThesaurusModel.msl";
           ecb.Provider = "System.Data.SqlClient";
           ecb.ProviderConnectionString = scsb.ConnectionString;

           return ecb.ConnectionString;
        }

        /* used to avoid sql-injection */
        public static String urlParam(String urlParam)
        {
            if (urlParam == null) return null;
            return urlParam.Replace("'", "''");
        }
    }
}