using System;
using System.Collections.Generic;

namespace DataViewer.app
{
    public class Item
    {
        public string name;

        public string uri;

        public string endpoint;

        public string description;

        public List<string> l_id = new List<string>();

        public List<LidItem> l_id2 = new List<LidItem>();
    }
}
