using System;

namespace DataViewer.app
{
    public class TermNotSpecifiedException : Exception
    {
        public override string ToString()
        {
            return "Thesaurus URI was not specified in URL.";
        }
    }
}