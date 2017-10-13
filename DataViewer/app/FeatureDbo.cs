namespace DataViewer.app
{
    public class FeatureDbo
    {
        #region private members

        private string _l_ID;
        private string _geologicCollectionTitle;
        private string _descriptionPurposeUri;
        private string _descriptionPurposeLbl;
        private string _geologicUnitNameUri;
        private string _geologicUnitNameLbl;
        private string _geologicUnitNameDescription;
        private string _tectonicUnitUri;
        private string _tectonicUnitLbl;
        private string _tectonicUnitDescription;
        private string _lithologyUri;
        private string _lithologyLbl;
        private string _lithologyDescription;
        private string _proportionUri;
        private string _proportionLbl;

        private string _eventProcessUri;
        private string _eventProcessLbl;
        private string _eventProcessDescription;
        private string _eventEnvironmentUri;
        private string _eventEnvironmentLbl;
        private string _eventEnvironmentDescription;
        private string _AgeUri;
        private string _AgeLbl;
        private string _ageDescription;

        #endregion

        #region constructor

        public FeatureDbo()
        {
            //LithologyUriList = new List<string>();
        }

        #endregion

        #region properties

        public string L_ID
        {
            get
            {
                return this._l_ID;
            }
            set
            {
                this._l_ID = value;
            }
        }

        public string GeologicCollectionTitle
        {
            get
            {
                return this._geologicCollectionTitle;
            }
            set
            {
                this._geologicCollectionTitle = value;
            }
        }

        public string DescriptionPurposeUri
        {
            get
            {
                return this._descriptionPurposeUri;
            }
            set
            {
                this._descriptionPurposeUri = value;
            }
        }

        public string DescriptionPurposeLbl
        {
            get
            {
                return this._descriptionPurposeLbl;
            }
            set
            {
                this._descriptionPurposeLbl = value;
            }
        }

        public string GeologicUnitNameUri
        {
            get
            {
                return this._geologicUnitNameUri;
            }
            set
            {
                this._geologicUnitNameUri = value;
            }
        }

        public string GeologicUnitNameLbl
        {
            get
            {
                return this._geologicUnitNameLbl;
            }
            set
            {
                this._geologicUnitNameLbl = value;
            }
        }

        public string GeologicUnitNameDescription
        {
            get
            {
                return this._geologicUnitNameDescription;
            }
            set
            {
                if (value != null && value.Length > 100)
                {
                    value = value.Substring(0, 100) + "...";
                }
                this._geologicUnitNameDescription = value;
            }
        }

        public string TectonicUnitUri
        {
            get
            {
                return this._tectonicUnitUri;
            }
            set
            {
                this._tectonicUnitUri = value;
            }
        }

        public string TectonicUnitLbl
        {
            get
            {
                return this._tectonicUnitLbl;
            }
            set
            {
                this._tectonicUnitLbl = value;
            }
        }

        public string TectonicUnitDescription
        {
            get
            {
                return this._tectonicUnitDescription;
            }
            set
            {
                if (value != null && value.Length > 100)
                {
                    value = value.Substring(0, 100) + "...";
                }
                this._tectonicUnitDescription = value;
            }
        }



        public string LithologyUri
        {
            get
            {
                return this._lithologyUri;
            }
            set
            {
                this._lithologyUri = value;
            }
        }

        public string LithologyLbl
        {
            get
            {
                return this._lithologyLbl;
            }
            set
            {
                this._lithologyLbl = value;
            }
        }
        public string LithologyDescription
        {
            get
            {
                return this._lithologyDescription;
            }
            set
            {
                if (value != null && value.Length > 100)
                {
                    value = value.Substring(0, 100) + "...";                   
                }
                this._lithologyDescription = value;
            }
        }

        public string ProportionUri
        {
            get
            {
                return this._proportionUri;
            }
            set
            {
                this._proportionUri = value;
            }
        }

        public string ProportionLbl
        {
            get
            {
                return this._proportionLbl;
            }
            set
            {
                this._proportionLbl = value;
            }
        }

        #region GE_GeologicEvent

        public string EventProcessUri
        {
            get
            {
                return this._eventProcessUri;
            }
            set
            {
                this._eventProcessUri = value;
            }
        }

        public string EventProcessLbl
        {
            get
            {
                return this._eventProcessLbl;
            }
            set
            {
                this._eventProcessLbl = value;
            }
        }

        public string EventProcessDescription
        {
            get
            {
                return this._eventProcessDescription;
            }
            set
            {
                if (value != null && value.Length > 100)
                {
                    value = value.Substring(0, 100) + "...";
                }
                this._eventProcessDescription = value;
            }
        }

        public string EventEnvironmentUri
        {
            get
            {
                return this._eventEnvironmentUri;
            }
            set
            {
                this._eventEnvironmentUri = value;
            }
        }
        
        public string EventEnvironmentLbl
        {
            get
            {
                return this._eventEnvironmentLbl;
            }
            set
            {
                this._eventEnvironmentLbl = value;
            }
        }

        public string EventEnvironmentDescription
        {
            get
            {
                return this._eventEnvironmentDescription;
            }
            set
            {
                if (value != null && value.Length > 100)
                {
                    value = value.Substring(0, 100) + "...";
                }
                this._eventEnvironmentDescription = value;
            }
        }

        public string AgeUri
        {
            get
            {
                return this._AgeUri;
            }
            set
            {
                this._AgeUri = value;
            }
        }

        public string AgeLbl
        {
            get
            {
                return this._AgeLbl;
            }
            set
            {
                this._AgeLbl = value;
            }
        }

        public string AgeDescription
        {
            get
            {
                return this._ageDescription;
            }
            set
            {
                if (value != null && value.Length > 100)
                {
                    value = value.Substring(0, 100) + "...";
                }
                this._ageDescription = value;
            }
        }

        #endregion

        #endregion

    }
}