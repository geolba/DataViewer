using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataViewer.app;
using DataViewer.Models;
using System.Web.Script.Serialization;

namespace DataViewer.tdv
{

    /// <summary>
    /// Summary description for AttributeHandler
    /// </summary>
    public class AttributeHandler : IHttpHandler
    {
        ThesaurusContext db;
        String[] filters;

        static String[] filtersAll = new string[] { "GeologicCollectionTitle", "DescriptionPurpose", "GeologicUnit", "TectonicUnit", "Proportion", "Lithology", "TimeScale", "EventProcess", "EventEnvironment" };
               
        //static String[] filtersLithology = { "Proportion", "GeologicUnit", "TectonicUnit", "TimeScale", "GeologicCollectionTitle" };
        static String[] filtersLithology = new string[] { "Proportion", "Dataset", "GeologicUnit", "TectonicUnit" };
        //static String[] filtersTimeScale = { "EventProcess", "EventEnvironment", "GeologicUnit", "TectonicUnit", "Lithology", "Dataset" };
        static String[] filtersTimeScale = new string[] { "Dataset", "GeologicUnit", "Lithology", "TectonicUnit", "EventProcess", "EventEnvironment" };
        //static String[] filtersGeologicUnit = { "DescriptionPurpose", "EventProcess", "EventEnvironment", "TectonicUnit", "TimeScale", "Lithology", "Dataset" };
        static String[] filtersGeologicUnit = new string[] { "DescriptionPurpose", "Dataset", "TimeScale", "Lithology", "TectonicUnit", "EventProcess", "EventEnvironment" };
        //static String[] filtersTectonicUnit = { "GeologicUnit", "Lithology", "TimeScale", "Dataset" };    
        static String[] filtersTectonicUnit = new string[] { "Dataset", "GeologicUnit", "TimeScale", "Lithology" };  

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "application/json";
            string connectionString = App.entityConnectionString();
            this.db = new ThesaurusContext(connectionString);
            this.db.Configuration.AutoDetectChangesEnabled = false;
                       
            Object data = null;
            data = readData(context);
            this.db.Dispose();  
            if (data != null)
            {
                JavaScriptSerializer serializer = new JavaScriptSerializer();
                context.Response.Write(serializer.Serialize(data));
            }
        }
        
        //private FeatureDbo[] DoQuery(string[] uris)
        private IQueryable<FeatureDbo> DoQuery(string[] uris, string parameter, string language)
        {
            

            var eventAge = (from ge in db.GE_GeologicEvent 
                            where !string.IsNullOrEmpty(ge.YoungerAge) 
                            select new { GE_ID = ge.GE_ID, GF_ID = ge.GF_ID, Age = ge.YoungerAge, EventProcess = ge.EventProcess, EventEnvironment = ge.EventEnvironment })
                .Concat(from ge in db.GE_GeologicEvent 
                        where !string.IsNullOrEmpty(ge.OlderAge) 
                        select new { GE_ID = ge.GE_ID, GF_ID = ge.GF_ID, Age = ge.OlderAge, EventProcess = ge.EventProcess, EventEnvironment = ge.EventEnvironment })
                .Concat(from ge in db.GE_GeologicEvent
                        where !string.IsNullOrEmpty(ge.MainAge) 
                        select new { GE_ID = ge.GE_ID, GF_ID = ge.GF_ID, Age = ge.MainAge, EventProcess = ge.EventProcess, EventEnvironment = ge.EventEnvironment });

          
            if (language == "de")
            {
                var query = (
                           from o in db.GE_GeologicUnit

                           //join Description purpose
                           join cgi in db.THESAURUS_geosciml on o.GE_GeologicFeature.DescriptionPurpose equals cgi.URI into cgiJoin1
                           from j1_cgi in cgiJoin1.DefaultIfEmpty()//for making outer join

                           //j1_concept: outer join for GeologicUnitName
                           join concept in db.THESAURUS_concept on o.GeologicUnitName equals concept.URI into conceptJoin1
                           from j1_concept in conceptJoin1.DefaultIfEmpty()//for making outer join

                           //j2_concept: outer join for TectonicUnit
                           join concept2 in db.THESAURUS_concept on o.TectonicUnit equals concept2.URI into conceptJoin2
                           from j2_concept in conceptJoin2.DefaultIfEmpty()//for making outer join

                           //j3_concept: outer join for Lithology
                           ////join m in db.GE_CompositionPart on o.GU_ID equals m.GU_ID into Details
                           ////from cp in Details.DefaultIfEmpty()                                           
                           from cp in o.GE_CompositionPart //.DefaultIfEmpty()
                           //j3_concept: outer join for Lithology
                           join concept3 in db.THESAURUS_concept on cp.Lithology equals concept3.URI into conceptJoin3
                           from j3_concept in conceptJoin3.DefaultIfEmpty()
                           //j2_cgi: outer join for Proportion
                           join cgi2 in db.THESAURUS_geosciml on cp.Proportion equals cgi2.URI into cgiJoin2
                           from j2_cgi in cgiJoin2.DefaultIfEmpty()//for making outer join

                           from ge in eventAge
                           where o.GE_GeologicFeature.GF_ID == ge.GF_ID //.DefaultIfEmpty()
                           //j3_cgi: outer join for EventProcess
                           join cgi3 in db.THESAURUS_geosciml on ge.EventProcess equals cgi3.URI into cgiJoin3
                           from j3_cgi in cgiJoin3.DefaultIfEmpty()//for making outer join
                           //j4_cgi: outer join for EventEnviroment
                           join cgi4 in db.THESAURUS_geosciml on ge.EventEnvironment equals cgi4.URI into cgiJoin4
                           from j4_cgi in cgiJoin4.DefaultIfEmpty()//for making outer join
                           //j4_concept: outer join for (Younger)Age
                           join concept4 in db.THESAURUS_concept on ge.Age equals concept4.URI into conceptJoin4
                           from j4_concept in conceptJoin4.DefaultIfEmpty()

                           //from ge in o.GE_GeologicFeature.GE_GeologicEvent //.DefaultIfEmpty()
                           ////j3_cgi: outer join for EventProcess
                           //join cgi3 in db.THESAURUS_geosciml on ge.EventProcess equals cgi3.URI into cgiJoin3
                           //from j3_cgi in cgiJoin3.DefaultIfEmpty()//for making outer join
                           ////j4_cgi: outer join for EventEnviroment
                           //join cgi4 in db.THESAURUS_geosciml on ge.EventEnvironment equals cgi4.URI into cgiJoin4
                           //from j4_cgi in cgiJoin4.DefaultIfEmpty()//for making outer join
                           ////j4_concept: outer join for YoungerAge
                           //join concept4 in db.THESAURUS_Concept on ge.YoungerAge equals concept4.URI into conceptJoin4
                           //from j4_concept in conceptJoin4.DefaultIfEmpty()


                           //////////////////////////////////////////////////////////////////////////////////////////////////////////
                           //////where uris.Contains(o.GE_CompositionPart.FirstOrDefault().Lithology)
                           //where o.GE_CompositionPart.Select(cpa => cpa.Lithology).Any(x => uris.Contains(x))


                           select new FeatureDbo()
                           {
                               L_ID = o.GE_GeologicFeature.L_ID,
                               GeologicCollectionTitle = o.GE_GeologicFeature.GeologicCollectionTitle,

                               DescriptionPurposeUri = o.GE_GeologicFeature.DescriptionPurpose,
                               DescriptionPurposeLbl = j1_cgi.prefLabel_EN,

                               GeologicUnitNameUri = o.GeologicUnitName,
                               GeologicUnitNameLbl = j1_concept.PrefLabelDe,
                               GeologicUnitNameDescription = j1_concept.DescriptionDe,
                               //GeologicUnitNameLbl = j1_concept.PrefLabelEn,
                               //GeologicUnitNameDescription = j1_concept.DescriptionEn,

                               TectonicUnitUri = o.TectonicUnit,
                               TectonicUnitLbl = j2_concept.PrefLabelDe,
                               TectonicUnitDescription = j2_concept.DescriptionDe,
                               //TectonicUnitLbl = j2_concept.PrefLabelEn,
                               //TectonicUnitDescription = j2_concept.DescriptionEn,

                               LithologyUri = cp.Lithology,
                               LithologyLbl = j3_concept.PrefLabelDe,
                               LithologyDescription = j3_concept.DescriptionDe,
                               //LithologyLbl = j3_concept.PrefLabelEn,
                               //LithologyDescription = j3_concept.DescriptionEn,
                               ProportionUri = cp.Proportion,
                               ProportionLbl = j2_cgi.prefLabel_EN,
                               //LithologyUriList = o.GE_CompositionPart.Select(cp => cp.Lithology).Where(x => uris.Contains(x)).ToList()   

                               EventProcessUri = ge.EventProcess,
                               EventProcessLbl = j3_cgi.prefLabel_EN,
                               EventProcessDescription = j3_cgi.definition_EN,
                               EventEnvironmentUri = ge.EventEnvironment,
                               EventEnvironmentLbl = j4_cgi.prefLabel_EN,
                               EventEnvironmentDescription = j4_cgi.definition_EN,
                               AgeUri = ge.Age,
                               AgeLbl = j4_concept.PrefLabelDe,
                               AgeDescription = j4_concept.DescriptionDe
                               //AgeLbl = j4_concept.PrefLabelEn,
                               //AgeDescription = j4_concept.DescriptionEn
                           });

                if (parameter == "Lithology")
                {
                    query = query.Where(x => uris.Contains(x.LithologyUri));
                }
                else if (parameter == "GeologicUnit")
                {
                    query = query.Where(x => uris.Contains(x.GeologicUnitNameUri));
                }
                else if (parameter == "TectonicUnit")
                {
                    query = query.Where(x => uris.Contains(x.TectonicUnitUri));
                }
                else if (parameter == "GeologicTimeScale")
                {
                    query = query.Where(x => uris.Contains(x.AgeUri));
                }
                else
                {
                    return null;
                }              

                return query;//.ToArray();
            }
            else
            {
                var query = (
                           from o in db.GE_GeologicUnit

                           //join Description purpose
                           join cgi in db.THESAURUS_geosciml on o.GE_GeologicFeature.DescriptionPurpose equals cgi.URI into cgiJoin1
                           from j1_cgi in cgiJoin1.DefaultIfEmpty()//for making outer join

                           //j1_concept: outer join for GeologicUnitName
                           join concept in db.THESAURUS_concept on o.GeologicUnitName equals concept.URI into conceptJoin1
                           from j1_concept in conceptJoin1.DefaultIfEmpty()//for making outer join

                           //j2_concept: outer join for TectonicUnit
                           join concept2 in db.THESAURUS_concept on o.TectonicUnit equals concept2.URI into conceptJoin2
                           from j2_concept in conceptJoin2.DefaultIfEmpty()//for making outer join

                           //j3_concept: outer join for Lithology
                           ////join m in db.GE_CompositionPart on o.GU_ID equals m.GU_ID into Details
                           ////from cp in Details.DefaultIfEmpty()                                           
                           from cp in o.GE_CompositionPart //.DefaultIfEmpty()
                           //j3_concept: outer join for Lithology
                           join concept3 in db.THESAURUS_concept on cp.Lithology equals concept3.URI into conceptJoin3
                           from j3_concept in conceptJoin3.DefaultIfEmpty()
                           //j2_cgi: outer join for Proportion
                           join cgi2 in db.THESAURUS_geosciml on cp.Proportion equals cgi2.URI into cgiJoin2
                           from j2_cgi in cgiJoin2.DefaultIfEmpty()//for making outer join

                           from ge in eventAge
                           where o.GE_GeologicFeature.GF_ID == ge.GF_ID //.DefaultIfEmpty()
                           //j3_cgi: outer join for EventProcess
                           join cgi3 in db.THESAURUS_geosciml on ge.EventProcess equals cgi3.URI into cgiJoin3
                           from j3_cgi in cgiJoin3.DefaultIfEmpty()//for making outer join
                           //j4_cgi: outer join for EventEnviroment
                           join cgi4 in db.THESAURUS_geosciml on ge.EventEnvironment equals cgi4.URI into cgiJoin4
                           from j4_cgi in cgiJoin4.DefaultIfEmpty()//for making outer join
                           //j4_concept: outer join for (Younger)Age
                           join concept4 in db.THESAURUS_concept on ge.Age equals concept4.URI into conceptJoin4
                           from j4_concept in conceptJoin4.DefaultIfEmpty()                       

                           select new FeatureDbo()
                           {
                               L_ID = o.GE_GeologicFeature.L_ID,
                               GeologicCollectionTitle = o.GE_GeologicFeature.GeologicCollectionTitle,

                               DescriptionPurposeUri = o.GE_GeologicFeature.DescriptionPurpose,
                               DescriptionPurposeLbl = j1_cgi.prefLabel_EN,

                               GeologicUnitNameUri = o.GeologicUnitName,
                               //GeologicUnitNameLbl = j1_concept.PrefLabelDe,
                               //GeologicUnitNameDescription = j1_concept.DescriptionDe,
                               GeologicUnitNameLbl = j1_concept.PrefLabelEn,
                               GeologicUnitNameDescription = j1_concept.DescriptionEn,

                               TectonicUnitUri = o.TectonicUnit,
                               //TectonicUnitLbl = j2_concept.PrefLabelDe,
                               //TectonicUnitDescription = j2_concept.DescriptionDe,
                               TectonicUnitLbl = j2_concept.PrefLabelEn,
                               TectonicUnitDescription = j2_concept.DescriptionEn,

                               LithologyUri = cp.Lithology,
                               //LithologyLbl = j3_concept.PrefLabelDe,
                               //LithologyDescription = j3_concept.DescriptionDe,
                               LithologyLbl = j3_concept.PrefLabelEn,
                               LithologyDescription = j3_concept.DescriptionEn,
                               ProportionUri = cp.Proportion,
                               ProportionLbl = j2_cgi.prefLabel_EN,
                               //LithologyUriList = o.GE_CompositionPart.Select(cp => cp.Lithology).Where(x => uris.Contains(x)).ToList()   

                               EventProcessUri = ge.EventProcess,
                               EventProcessLbl = j3_cgi.prefLabel_EN,
                               EventProcessDescription = j3_cgi.definition_EN,
                               EventEnvironmentUri = ge.EventEnvironment,
                               EventEnvironmentLbl = j4_cgi.prefLabel_EN,
                               EventEnvironmentDescription = j4_cgi.definition_EN,
                               AgeUri = ge.Age,
                               //AgeLbl = j4_concept.PrefLabelDe,
                               //AgeDescription = j4_concept.DescriptionDe
                               AgeLbl = j4_concept.PrefLabelEn,
                               AgeDescription = j4_concept.DescriptionEn
                           });

                if (parameter == "Lithology")
                {
                    query = query.Where(x => uris.Contains(x.LithologyUri));
                }
                else if (parameter == "GeologicUnit")
                {
                    query = query.Where(x => uris.Contains(x.GeologicUnitNameUri));
                }
                else if (parameter == "TectonicUnit")
                {
                    query = query.Where(x => uris.Contains(x.TectonicUnitUri));
                }
                else if (parameter == "GeologicTimeScale")
                {
                    query = query.Where(x => uris.Contains(x.AgeUri));
                }
                else
                {
                    return null;
                }              

                return query;//.ToArray();
            }

          
            
            ////var objectQuery = (System.Data.Objects.ObjectQuery)query;
            //    //var sql = objectQuery.ToTraceString();

            //return query;//.ToArray();
           
        }
               
        private void put(Dictionary<String, Item> dictionary, String uri, String name, String l_id, String description, String proportion)
        {
            if (name != null)
            {
                Item I;
                if (!dictionary.TryGetValue(name, out I))
                {
                    I = new Item();
                }
                I.name = name;
                I.uri = uri;
                I.description = description;                
                I.endpoint = getEndpoint(uri);
                //I.proportion = proportion;

                LidItem lidItem = new LidItem();
                lidItem.l_id = l_id;
                lidItem.proportion = proportion;
                bool alreadyExists = I.l_id2.Any(x => x.l_id == l_id);
                if (alreadyExists == false)
                {
                    I.l_id2.Add(lidItem);
                }

                //if (!I.l_id.Contains(l_id))
                //{
                //    I.l_id.Add(l_id);
                //}
                dictionary[name] = I;
            }
        }

        private string getEndpoint(string uri)
        {
            if (uri == null)
            {
                return string.Empty;
            }
            var value = uri;
            int ix = value.LastIndexOf('/');
            string _uri = value.Substring(0, ix + 1);
            string endpoint;
            switch (_uri)
             {
                
                 case "http://resource.geolba.ac.at/GeologicUnit/":
                     //endpoint = "GeologicUnitName";
                     endpoint = "http://resource.geolba.ac.at/PoolParty/sparql/GeologicUnit";
                     break;
                 case "http://resource.geolba.ac.at/tectonicunit/":
                     //endpoint = "TectonicUnit";
                     endpoint = "http://resource.geolba.ac.at/PoolParty/sparql/tectonicunit";
                     break;
                 //case "http://resource.geosciml.org/classifier/cgi/proportionterm/":
                 //    endpoint = "Proportion";
                     //break;
                 case "http://resource.geolba.ac.at/lithology/":
                     //endpoint = "Lithology";
                     endpoint = "http://resource.geolba.ac.at/PoolParty/sparql/lithology";
                     break;
                 case "http://resource.geolba.ac.at/GeologicTimeScale/":
                     //endpoint = "YoungerAge";
                     endpoint = "http://resource.geolba.ac.at/PoolParty/sparql/GeologicTimeScale";
                     break;               
                 default :
                     endpoint = "";
                     break;
             }

             return endpoint;
        }

        private string GetParameter(string uri)
        {
            if (uri == null)
            {
                return string.Empty;
            }
            var value = uri;
            int ix = value.LastIndexOf('/');
            string _uri = value.Substring(0, ix + 1);
            string parameter;
            switch (_uri)
            {

                case "http://resource.geolba.ac.at/GeologicUnit/":
                    parameter = "GeologicUnit";
                    filters = filtersGeologicUnit;
                    break;
                case "http://resource.geolba.ac.at/tectonicunit/":
                    parameter = "TectonicUnit";
                    filters = filtersTectonicUnit;
                    break;               
                case "http://resource.geolba.ac.at/lithology/":
                    parameter = "Lithology";   
                    filters = filtersLithology;
                    break;
                case "http://resource.geolba.ac.at/GeologicTimeScale/":
                    parameter = "GeologicTimeScale";
                    filters = filtersTimeScale;
                    break;
                default:
                    parameter = "";
                    filters = filtersAll;
                    break;
            }

            return parameter;
        }

        private Object readData(HttpContext context)
        {
            //defining all the dictionaries
            Dictionary<String, Item> GeologicCollectionTitle = new Dictionary<String, Item>();            
            Dictionary<String, Item> GeologicUnit = new Dictionary<String, Item>();
            Dictionary<String, Item> TectonicUnit = new Dictionary<String, Item>();
            Dictionary<String, Item> Proportion = new Dictionary<String, Item>();
            Dictionary<String, Item> TimeScale = new Dictionary<String, Item>();
            //zusätzlich für TimeScale
            Dictionary<String, Item> Lithology = new Dictionary<String, Item>();
            Dictionary<String, Item> EventProcess = new Dictionary<String, Item>();
            Dictionary<String, Item> EventEnvironment = new Dictionary<String, Item>();
            //zusätzlich für GeologicUnit
            Dictionary<String, Item> DescriptionPurpose = new Dictionary<String, Item>();

            //String s;
            //s = getTopicsORCondition(context);
            //List<GE_GeologicFeature> myFeatures = new List<GE_GeologicFeature>();
            List<LidItem> L_ID = null;// = new List<String>();
            String topics = context.Request["topics"];
            String allTopics_string = context.Request["alltopics"];
            String uri = context.Request["uri"];
            String language = context.Request["language"];
            String parameter = GetParameter(uri);
            String value2 = context.Request["filters"];
            UriFilter uriFilter = null;
            if (value2 != null)
            {
                JavaScriptSerializer jss = new JavaScriptSerializer();
                //Object user = jss.DeserializeObject(value2);
                uriFilter = jss.Deserialize<UriFilter>(value2);               
            }
            if (topics == null)
            {
                return null;
            }
            List<string> notIncludedUriList = new List<string>();  
            String[] filteredTopics = topics.Split(',');
            String[] allTopics = allTopics_string.Split(',');
            if (filteredTopics != null && filteredTopics.Length > 0)
            {
                //FeatureDbo[] features = DoQuery(a);
                //IQueryable<FeatureDbo> features = DoQuery(filteredTopics, parameter, language);
                IQueryable<FeatureDbo> features = DoQuery(allTopics, parameter, language);
                if (features == null)
                {
                    return null;
                }
                
                //also set the filters if ther are any:
                if (uriFilter != null)
                {
                    if (uriFilter.tectonicuris.Count() > 0)
                    {
                        features = features.Where(f => uriFilter.tectonicuris.Contains(f.TectonicUnitUri));
                    }
                    if (uriFilter.geologicunituris.Count() > 0)
                    {
                        features = features.Where(f => uriFilter.geologicunituris.Contains(f.GeologicUnitNameUri));
                    }
                   
                    if (uriFilter.proportionuris.Count() > 0)
                    {
                        features = features.Where(f => uriFilter.proportionuris.Contains(f.ProportionUri));
                    }
                    if (uriFilter.timescaleuris.Count() > 0)
                    {
                        features = features.Where(f => uriFilter.timescaleuris.Contains(f.AgeUri));
                    }
                    if (uriFilter.dataset != null)
                    {
                        features = features.Where(f => f.GeologicCollectionTitle == uriFilter.dataset);
                    }
                    //zusätzlich für TimeScale
                    if (uriFilter.lithologyuris.Count() > 0)
                    {
                        features = features.Where(f => uriFilter.lithologyuris.Contains(f.LithologyUri));
                    }
                    if (uriFilter.eventprocessuris.Count() > 0)
                    {
                        features = features.Where(f => uriFilter.eventprocessuris.Contains(f.EventProcessUri));
                    }
                    if (uriFilter.eventenvironmenturis.Count() > 0)
                    {
                        features = features.Where(f => uriFilter.eventenvironmenturis.Contains(f.EventEnvironmentUri));
                    }
                    //zusätzlich für GeologicUnit
                    if (uriFilter.descriptionpurposeuris.Count() > 0)
                    {
                        features = features.Where(f => uriFilter.descriptionpurposeuris.Contains(f.DescriptionPurposeUri));
                    }
                    
                }

                //var test = features.Select(f => f.L_ID).Distinct().ToList();    
                //L_ID = features.Select(f => new LidItem() { l_id = f.L_ID, proportion = f.ProportionLbl }).DistinctBy(lid => lid.l_id).ToList();
                //L_ID = new List<LidItem>();
                
                //((ObjectQuery)features).MergeOption = MergeOption.NoTracking;
                IEnumerable<FeatureDbo> features2 = features.ToList();               

                //make test which terms ar not included anymore
                foreach (string termUri in allTopics)
                {
                    bool matches = false;
                    if (parameter == "Lithology")
                    {
                        matches = features2.Any(p => p.LithologyUri == termUri);
                    }
                    else if (parameter == "GeologicUnit")
                    {                      
                        matches = features2.Any(p => p.GeologicUnitNameUri == termUri);
                    }
                    else if (parameter == "TectonicUnit")
                    {                        
                        matches = features2.Any(p => p.TectonicUnitUri == termUri);
                    }
                    else if (parameter == "GeologicTimeScale")
                    {                       
                        matches = features2.Any(p => p.AgeUri == termUri);
                    }
                    if (matches == false){
                        notIncludedUriList.Add(termUri);
                    }
                }

                //features nochmal einschränken
                if (allTopics.Length != filteredTopics.Length)
                {
                    if (parameter == "Lithology")
                    {
                        features2 = features2.Where(x => filteredTopics.Contains(x.LithologyUri));
                    }
                    else if (parameter == "GeologicUnit")
                    {
                        features2 = features2.Where(x => filteredTopics.Contains(x.GeologicUnitNameUri));
                    }
                    else if (parameter == "TectonicUnit")
                    {
                        features2 = features2.Where(x => filteredTopics.Contains(x.TectonicUnitUri));
                    }
                    else if (parameter == "GeologicTimeScale")
                    {
                        features2 = features2.Where(x => filteredTopics.Contains(x.AgeUri)).ToList();
                    }
                }
                L_ID = features2.Select(f => new LidItem() { l_id = f.L_ID, proportion = f.ProportionLbl }).DistinctBy(lid => lid.l_id).ToList();
                           
                
                //fill the dictionaries
                foreach (var feature in features2)
                {
                    put(GeologicCollectionTitle, null, feature.GeologicCollectionTitle, feature.L_ID, null, feature.ProportionLbl);
                    put(DescriptionPurpose, feature.DescriptionPurposeUri, feature.DescriptionPurposeLbl, feature.L_ID, null, feature.ProportionLbl);
                    put(GeologicUnit, feature.GeologicUnitNameUri, feature.GeologicUnitNameLbl, feature.L_ID, feature.GeologicUnitNameDescription, feature.ProportionLbl);
                    put(TectonicUnit, feature.TectonicUnitUri, feature.TectonicUnitLbl, feature.L_ID, feature.TectonicUnitDescription, feature.ProportionLbl);
                    put(Proportion, feature.ProportionUri, feature.ProportionLbl, feature.L_ID, null, feature.ProportionLbl);
                    put(TimeScale, feature.AgeUri, feature.AgeLbl, feature.L_ID, feature.AgeDescription, feature.ProportionLbl);
                    //zusätzlich für TimeScale
                    put(Lithology, feature.LithologyUri, feature.LithologyLbl, feature.L_ID, feature.LithologyDescription, feature.ProportionLbl);
                    put(Lithology, feature.LithologyUri, feature.LithologyLbl, feature.L_ID, feature.LithologyDescription, feature.ProportionLbl);
                    put(EventProcess, feature.EventProcessUri, feature.EventProcessLbl, feature.L_ID, feature.EventProcessDescription, feature.ProportionLbl);
                    put(EventEnvironment, feature.EventEnvironmentUri, feature.EventEnvironmentLbl, feature.L_ID, feature.EventEnvironmentDescription, feature.ProportionLbl);
                    //zusätzlich für GeologicUnit
                    put(DescriptionPurpose, feature.DescriptionPurposeUri, feature.DescriptionPurposeLbl, feature.L_ID, null, feature.ProportionLbl);
                }
                //GeologicCollectionTitle.GroupBy(f => f.Value);               
            }

            return new
            {
                L_ID = L_ID,
                Filters = GetLocalizedFilters(filters, language),
                Dataset = GeologicCollectionTitle.Values.OrderBy(m => m.name).ToArray(),
                GeologicUnit = GeologicUnit.Values.OrderBy(m => m.name).ToArray(),
                TectonicUnit = TectonicUnit.Values.OrderBy(m => m.name).ToArray(),
                Proportion = Proportion.Values.OrderBy(m => m.name).ToArray(),
                TimeScale = TimeScale.Values.OrderBy(m => m.name).ToArray(),
                //zusätzlich für TimeScale
                Lithology = Lithology.Values.OrderBy(m => m.name).ToArray(),               
                EventProcess = EventProcess.Values.OrderBy(m => m.name).ToArray(),
                EventEnvironment = EventEnvironment.Values.OrderBy(m => m.name).ToArray(),
                //zusätzlich für GeologicUnit
                DescriptionPurpose = DescriptionPurpose.Values.OrderBy(m => m.name).ToArray(),
                
                NotIncludedUris = notIncludedUriList
            };
        

        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }

        private Filter[] GetLocalizedFilters(IList<String> filters, string language)
        {
            Filter[] result = new Filter[filters.Count];

            for (var i = 0; i < filters.Count; ++i)
            {
                result[i] = new Filter()
                {
                    name = filters[i],
                    //localizedName = filters[i]
                    localizedName = Dictionary.GetText(filters[i], language)
                };
            }

            return result;
        }

    }
}