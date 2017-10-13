# DataViewer

This JavaScript app is based on the INSPIRE data model for geology, 
especially designed to search and analyze geological 
data. Please see example link where you search for geologic features 
in Austria attributed with “breccia”: 
http://gisgba.geologie.ac.at/DataViewer/tdv/Index.aspx?url=http://resource.geolba.ac.at/lithology/182 


## Getting Started

* git clone https://github.com/geolba/DataViewer.git 
* create database (see DataViewer/Models/ThesaurusModel.sql)
* set db connectionstring in DataViewer/config/ConnectionStrings.config.release

See deployment for notes on how to deploy the project on a live system.

## Deployment

* after changes on javascript code run: npm run-script prod

## Versioning

For the versions available, see the [tags on this repository](https://github.com/geolba/DataViewer/tags). 

## Authors

* **Arno Kaimbacher** - *Initial work* 

See also the list of [contributors](https://github.com/geolba/DataViewer/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

