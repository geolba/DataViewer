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

    public partial class GE_CompositionPart
    {
        public int CP_ID { get; set; }
        public int GU_ID { get; set; }
        public string Lithology { get; set; }
        public string Protolith { get; set; }
        public string Proportion { get; set; }
        public string CompositionPartRole { get; set; }
        public string Notes { get; set; }
    
        public virtual GE_GeologicUnit GE_GeologicUnit { get; set; }
    }
}