using System.Data.Entity;

namespace DataViewer.Models
{
    public partial class ThesaurusContext : DbContext
    {
        public ThesaurusContext(string connectionstring)
            : base(connectionstring)
        {
            this.Configuration.LazyLoadingEnabled = false;          
        }
    }
}