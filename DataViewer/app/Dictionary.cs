using System;
using System.Collections.Generic;

namespace DataViewer.app
{
    public static class Dictionary
    {
        private static Dictionary<String, String[]> dictionary = new Dictionary<String, String[]>();

        static Dictionary()
        {
            // Filters
            //dictionary["GeologicCollectionTitle"] = new[] { "Geological collection", "Datensatz" };
            Dictionary.dictionary["Dataset"] = new string[] { "Dataset", "Datensatz" };
            Dictionary.dictionary["DescriptionPurpose"] = new string[] { "DescriptionPurpose", "DescriptionPurpose" };
            Dictionary.dictionary["GeologicUnit"] = new string[] { "Geologic Unit", "Geologische Einheit" };
            Dictionary.dictionary["TectonicUnit"] = new string[] { "Tectonic Unit", "Tektonische Einheit " };
            Dictionary.dictionary["Proportion"] = new string[] { "Proportion", "Proportion" };
            Dictionary.dictionary["Lithology"] = new string[] { "Lithology", "Lithologie" };
            Dictionary.dictionary["TimeScale"] = new string[] { "Age of Formation", "Bildungsalter" };
            Dictionary.dictionary["EventProcess"] = new string[] { "Event Process", "Bildungsprozess" };
            Dictionary.dictionary["EventEnvironment"] = new string[] { "Event Environment", "Bildungsmilieu" };
        }

        private static int LanguageIndex(string languageCode)
        {
            if (languageCode != null)
            {
                if (languageCode == "en")
                {
                    return 0;
                }
                if (languageCode == "de")
                {
                    return 1;
                }
            }
            throw new KeyNotFoundException();
        }

        public static string ComplementaryLanguageCode(string languageCode)
        {
            if (languageCode != null)
            {
                if (languageCode == "en")
                {
                    return "de";
                }
                if (languageCode == "de")
                {
                    return "en";
                }
            }
            throw new KeyNotFoundException();
        }

        public static bool LanguageSupported(string languageCode)
        {
            return Dictionary.LanguageIndex(languageCode) != -1;
        }

        public static string GetText(string textCode, string languageCode)
        {
            return Dictionary.dictionary[textCode][Dictionary.LanguageIndex(languageCode)];
        }



    }
}