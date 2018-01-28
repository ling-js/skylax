# Skylax-Suite

### Idea & Conception
[see Github Wiki](https://github.com/ling-js/skylax/wiki)

### Installation

The whole Suite consists of three parts that are installed seperately. This README provides Installation instructions for a debian-based linux distribution. Deployment on other UNIX Systems may differ.

    1. skylax infrastructure
    2. skylax-client
    3. skylax-api


## skylax-infrastructure

The skylax infrastructure consists of several different external programs and libraries

### Installation

nodeJS + pm2:

    1. https://nodejs.org/en/download/package-manager/
    2. sudo apt-get install npm
    3. npm install pm2 -g // cluster management

nginx proxy:

    1. sudo apt-get install nginx
    2. sudo nano /etc/nginx/sites-enabled
    3. TODO(specki): add config

## skylax-client
### Installation
Run the following commands in the desired location.

    1. git clone https://github.com/ling-js/skylax.git
    2. cd skylax
    3. npm install

### Running

If Process Manager 2 is used the Cluster is started with:

    1. pm2 start app.js -i 4

If only a single Instance is used the Server is started with:

    1. npm start

The Client is then reachable under Port 3000.
### Dependencies
The skylax-client uses following external libraries:

| used packages | License               |
| --- | --- |
| spin.js      | [MIT](https://github.com/fgnass/spin.js/blob/master/LICENSE.md)                  |
| bootpag     | [MIT]() - see file jquery.bootpag.min.js                  |
| jquery      | [MIT](https://jquery.org/license/)                  |
| leaflet     | [BSD-2Clause](https://github.com/Leaflet/Leaflet/blob/master/LICENSE)                  |
| leaflet-sidebar-v2     | [MIT](https://github.com/nickpeihl/leaflet-sidebar-v2/blob/master/LICENSE)                  |
| fontawesome     | [multiple licenses](http://fontawesome.io/license/)                  |
| leaflet-draw | [MIT](https://github.com/Leaflet/Leaflet.draw/blob/develop/MIT-LICENSE.md) |
| bootstrap| [MIT](https://github.com/twbs/bootstrap/blob/master/LICENSE) |
| moment.js|[MIT](https://github.com/moment/moment/blob/develop/LICENSE) |
|bootstrap-datepicker|[MIT](https://github.com/Eonasdan/bootstrap-datetimepicker/blob/master/LICENSE) |


## skylax-api [![Go Report Card](https://goreportcard.com/badge/github.com/ling-js/skylax-api)](https://goreportcard.com/report/github.com/ling-js/skylax-api)
### Requirements
The skylax-api depends on the following libraries to be installed in the host operating system. Please refer to the their Websites for installation instructions:
 * [GEOS](http://trac.osgeo.org/geos/) released under [LGPL](https://git.osgeo.org/gitea/geos/geos/src/branch/master/COPYING)
 * [proj.4](https://github.com/OSGeo/proj.4) released under [MIT License](http://proj4.org/license.html)
 * [GDAL](http://www.gdal.org/) with python and OpenJPEG bindings released under [X11/MIT](https://trac.osgeo.org/gdal/wiki/FAQGeneral#WhatlicensedoesGDALOGRuse)
 * [OpenJPEG](http://www.openjpeg.org/) released under [2-Clause BSD](https://github.com/uclouvain/openjpeg/blob/master/LICENSE)

### Installation

    1. Download the latest binary from the [Github Releases Page](https://github.com/ling-js/skylax-api/releases)
    2. Extract the archive to the desired location
    3. Run skylax-api

### Install from Source
Installing from source depends on a valid go install. Refer to the official site for [documentation](https://golang.org/):

Run following commands in the desired install directory

    1. git clone https://github.com/ling-js/skylax-api
    2. cd skylax-api
    3. go build

### Running
Run following commands in the install directory

`./skylax-api`

The following command line parameters are available. If they are not explicitly specified the default is used.
| flag | default | description |
| --- | --- | --- |
| `-v` | false | toggle verbose output|
| `-src=` | '/opt/sentinel2/' | specify data directory

The source directory may only contain valid datasets in SAFE Format (denoted by `.SAFE` file extension)

### Dependencies
The skylax-api has the following external dependencies:


| Dependency | License               |
| --- | --- |
| [go-gdal](github.com/ling-js/go-gdal) | [License](https://github.com/ling-js/go-gdal/blob/master/LICENSE) |
| [geos](github.com/paulsmith/gogeos/geos) | [MIT License](https://github.com/paulsmith/gogeos/blob/master/COPYING)|
| [gorilla](github.com/gorilla/schema) | [BSD-3-Clause](https://github.com/gorilla/schema/blob/master/LICENSE)|
| [ksuid](github.com/segmentio/ksuid) | [MIT License](https://github.com/segmentio/ksuid/blob/master/LICENSE.md)|
| [httprouter](github.com/julienschmidt/httprouter) | [License](https://github.com/julienschmidt/httprouter/blob/master/LICENSE)|
| [cors](https://github.com/rs/cors) | [MIT License](https://github.com/rs/cors/blob/master/LICENSE)|
| gdal2tiles.py | (see file)

## Licenses
The skylax-api is released under the [MIT License](https://github.com/ling-js/skylax-api/blob/master/LICENSE)

The skylax client (referred to as skylax) is released under the [MIT License](https://github.com/ling-js/skylax/blob/master/LICENSE)

The go-gdal library is released under a custom [License](https://github.com/ling-js/go-gdal/blob/master/LICENSE)
