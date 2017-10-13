using System;

namespace DataViewer.app
{
    public class TermNotFoundException : Exception
    {
        /// <summary>
        ///     Constructor
        /// </summary>
        /// <param name="URI">The URI supplied in URL ID parameter</param>
        public TermNotFoundException(string URI)
        {
            base.Data.Add("URI", URI);
        }

        public override string Message
        {
            get
            {
                return "The given URI was not found.";
            }
        }
    }
}