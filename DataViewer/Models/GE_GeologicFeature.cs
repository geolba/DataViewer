//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace DataViewer.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class GE_GeologicFeature
    {
        public GE_GeologicFeature()
        {
            this.GE_GeologicEvent = new HashSet<GE_GeologicEvent>();
            this.GE_GeologicUnit = new HashSet<GE_GeologicUnit>();
        }
    
        public int GF_ID { get; set; }
        public string L_ID { get; set; }
        public int GeologicCollectionID { get; set; }
        public string GeologicCollectionTitle { get; set; }
        public string Notes { get; set; }
        public string LEGTEXT { get; set; }
        public string DescriptionPurpose { get; set; }
        public string LEGKURZ { get; set; }
        public Nullable<int> LEG_ID { get; set; }
        public Nullable<int> FEATURE_ID { get; set; }
    
        public virtual ICollection<GE_GeologicEvent> GE_GeologicEvent { get; set; }
        public virtual ICollection<GE_GeologicUnit> GE_GeologicUnit { get; set; }
    }
}
