// Global vars;
var map, // Map Object
  layerControl,
  sidebar,
  drawControl,
  editableLayers, //Layer to draw onto
  drawnItems,
  rectangleDrawer,
  spinner,
  polyLayer,
  target;

//SpinnerToggler
var toggler = false;

//Speichert Ergebnisse nach Laden der Datasets
var jsonForDatasets =[];

//Save Lookup values
var valueLookUpArray = [];

/**
 * Geosoftware I, SoSe 2017, final
 * @author Jan Speckamp (428367) ,Jens Seifert ,Jasper Buß, Benjamin Karic , Eric Thieme-Garmann
 */

('use strict');

/**
 * Initialises Map Object
 */

function initMap() {
  map = L.map('map', {
    center: [48.748945343432936, 11.733398437500002], // Europe
    zoom: 5,
    minZoom: 0,
    maxZoom: 15,
    zoomControl: false,
  });

  L.control
    .zoom({
      position: 'bottomright',
    })
    .addTo(map);

  // Handler that is used in order to get rid of the draw control
  rectangleDrawer = new L.Draw.Rectangle(map);

  var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  	maxZoom: 17,
  	attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  var WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  });

  var basemaps = { OpenStreetMap: osm,
                  "Topographie" : OpenTopoMap,
                  "WorldImagery" : WorldImagery
};
  var overlaymaps = {};

  layerControl = L.control.layers(basemaps, overlaymaps, { collapsed: true }).addTo(map);

  //Feature group where drawn items are saved
  drawnItems = L.featureGroup().addTo(map);

  //Feature group where polygons are shown
  polyLayer = L.featureGroup().addTo(map);


  map.on(L.Draw.Event.CREATED, function(event) {
    var layer = event.layer;
    drawnItems.addLayer(layer);
  });

  map.on('click', function(e) {
    var coords = {lat: e.latlng.lat, lng:correctCoordinates(e.latlng.lng)};
    //console.log(jsonForDatasets);
  });

 map.on('draw:created', function(e) {


    // Each time a feaute is created, it's added to the over arching feature group
    drawnItems.addLayer(e.layer);
    document.getElementById('searchformbybbox_topLat').value = getRectangle(2)[0];
    document.getElementById('searchformbybbox_topLong').value = getRectangle(2)[1];
    document.getElementById('searchformbybbox_bottomLat').value = getRectangle(4)[0];
    document.getElementById('searchformbybbox_bottomLong').value = getRectangle(4)[1];




  });

  // Set up Sidebar and Startpage
  sidebar = L.control.sidebar('sidebar').addTo(map);
  sidebar.open('home');
}

/**
 * Helper function that gets the GPS-Coordinates of the drawn rectangle used for further calculations
 *
 * @param corner 1 - top left corner
 *               2 - top right corner
 *               3 - bottom left corner
 *               4 - bottom right corner
 * @returns output - the given coordinates for the corresponding corner
 */
function getRectangle(corner) {
  var data = drawnItems.toGeoJSON();
  var output = data.features[0].geometry.coordinates[0][corner].reverse();
  output[1] = correctCoordinates(output[1]);
  return output;
}

/**
 * Funktion, die die richtigen Koordinaten ausgibt
 * @param coord Falsche Koordinaten
 * @returns richtige Koordinaten
 */
function correctCoordinates(coord) {
  if (coord < -180) {
    coord += 360;
  } else if (coord > 180) {
    coord -= 360;
  }
  if (coord > -180 && coord < 180) {
    return coord;
  } else {
    correctCoordinates(coord);
  }
}
/**
 * Function that is called whenever the inputs need to be
 * erased from the web page (cache)
 */
function resetInput() {
  document.getElementById('searchformbybbox_topLat').value = '';
  document.getElementById('searchformbybbox_topLong').value = '';
  document.getElementById('searchformbybbox_bottomLat').value = '';
  document.getElementById('searchformbybbox_bottomLong').value = '';
}



// Click handler for your button to start drawing polygons
$(document).ready(function() {
  // Hide the delete button until the draw button is clicked once
  //Resets the input and clears layers
  $('#bboxbutton').click(function() {
    drawnItems.clearLayers();
    rectangleDrawer.enable();
    resetInput();
    $('#bboxbutton').hide();
    $('#deleteDrawing').show();
  });

  $('#deleteDrawing').click(function() {
    resetInput();
    drawnItems.clearLayers();
    $('#bboxbutton').show();
    $('#deleteDrawing').hide();
  });
  //Wenn alle BBox Felder ausgefühlt sind, wird coordsToPolygon ausgeführt
  $('#searchformbybbox_bottomLat').change(function(){
    drawnItems.clearLayers();
    $('#bboxbutton').show();
    $('#deleteDrawing').hide();
    if(checkForCorrectCoordinates() == true){
        coordsToPolygon();
    }

  });

  $('#searchformbybbox_topLat').change(function(){
  drawnItems.clearLayers();
  $('#bboxbutton').show();
  $('#deleteDrawing').hide();
  if(checkForCorrectCoordinates() == true){
      coordsToPolygon();
  }

  });

  $('#searchformbybbox_topLong').change(function(){
    drawnItems.clearLayers();
    $('#bboxbutton').show();
    $('#deleteDrawing').hide();
    if(checkForCorrectCoordinates() == true){
        coordsToPolygon();
    }
  });

  $('#searchformbybbox_bottomLong').change(function(){
      drawnItems.clearLayers();
      $('#bboxbutton').show();
      $('#deleteDrawing').hide();
      if(checkForCorrectCoordinates() == true){
          coordsToPolygon();
      }
    });
});

/**
 * Zooms to the image of the shown dataset.
 * @param j Dataset number
 */
function zoomToLayer(j){
  polyLayer.eachLayer(function(layer){
    if(layer.options.number == (j-1)){
      map.fitBounds(layer.getBounds());
      polyLayer.clearLayers();
    }
  });
//testen hier bug fix, 2. laden geht nicht
}

/**
 * Draws polygon of the bbox search entries
 * @param load Permalink indicator(true = load on permalink)
 */

//checks for correct input coordinates
function checkForCorrectCoordinates(){
  var wrongVal = false;

  if(searchformbybbox_bottomLat.value < 90 && searchformbybbox_bottomLat.value > -90){
    if(searchformbybbox_topLat.value  < 90 && searchformbybbox_topLat.value > - 90 ){
      if(searchformbybbox_topLong.value  < 180 && searchformbybbox_topLong.value > -180){
        if(searchformbybbox_bottomLong.value  < 180 && searchformbybbox_bottomLong.value > -180){
          wrongVal = true;
        }
      }
    }
  }

  return wrongVal;
}

function coordsToPolygon(load){
  if(document.getElementById('searchformbybbox_topLat').value != '' &&
     document.getElementById('searchformbybbox_bottomLat').value != '' &&
     document.getElementById('searchformbybbox_topLong').value != '' &&
       document.getElementById('searchformbybbox_bottomLong').value != ''){
  var latlon =
              [[document.getElementById('searchformbybbox_topLat').value, document.getElementById('searchformbybbox_topLong').value],
              [document.getElementById('searchformbybbox_topLat').value, document.getElementById('searchformbybbox_bottomLong').value],
              [document.getElementById('searchformbybbox_bottomLat').value,document.getElementById('searchformbybbox_bottomLong').value],
              [document.getElementById('searchformbybbox_bottomLat').value , document.getElementById('searchformbybbox_topLong').value]
              ]

  var polygon = L.polygon(latlon).addTo(drawnItems);
  if(load != "true"){
    map.fitBounds(polygon.getBounds());
  }
  $('#bboxbutton').hide();
  $('#deleteDrawing').show();
  }
  else{
  $('#bboxbutton').show();
  $('#deleteDrawing').hide();
  }
}

/**
 * Draws polygon of a resulting dataset
 * @param result Metadata of all found metadata
 * @param number Number of the dataset polygon to disply
 * @param page Page on which the dataset can be found
 */
function drawPolygon(result, number, page, showNumber, reslength){
  var coordArray = stringToCoordArray(result[number].FOOTPRINT);
  if(coordArray != null){
    var polygon = L.polygon(coordArray, {color: 'red',number:showNumber, resultLength:reslength});
    polygon.on('click', openAccordion);
    polygon.bindTooltip('<p> Dataset '+(((page-1)*8)+(showNumber+1))+'</p>').addTo(map);
    polygon.addTo(polyLayer);
  }
}

/**
 * Displays the value on tile click
 */
function initLookUp(e){
  var x = correctCoordinates(e.latlng.lng);
  var y = e.latlng.lat;
  var dname = this.options.dname;
  var bname = this.options.bname;
  valueRequest(dname, bname, x, y);
}

/**
 * Displays the value on tile click
 *@param x X coordinate
 *@param y Y coordniate
 */
 function showValue(x, y){
   var popupMessage = "";
   if(valueLookUpArray.length == 1){
     popupMessage += "The value here is " + valueLookUpArray[0];
   }else{
     var colors = ["red","green","blue"]
     for (var i = 0; i < valueLookUpArray.length; i++) {
       if (i != 0) {
         popupMessage += " <br> "
       }
       popupMessage += "Value of the "+colors[i]+" band is "+valueLookUpArray[i];
     }
   }
   var popup = L.popup()
     .setLatLng([y, x])
     .setContent(popupMessage)
     .openOn(map);
 }
/**
 * Draws an invisible polygon of the displayed dataset
 * @param resultNum Metadata of the displayed dataset
 * @param radioBtn "true" or "false" for rgb oder grey
 */
function drawInvisPolygon(resultNum, names, bands, radioBtn){
  var coordArray = stringToCoordArray(jsonForDatasets[resultNum-1].FOOTPRINT);
  if(coordArray != null){
    if(radioBtn == "true"){
        names[3] = null;
      }else if(radioBtn == "false"){
        names[0] = null;
        names[1] = null;
        names[2] = null;
      }
    var polygon = L.polygon(coordArray, {fillOpacity:'0', weight:'0', dname: names, bname:bands});
    polygon.on('click', initLookUp);
    polygon.addTo(polyLayer);
  }
}
/**
 * Gets a string and return a array of coordinates, needed to draw a polyong
 * @param coordString String that contains coods
 * @return Coordinates as an array
 */
function stringToCoordArray(coordString){
  if(coordString != null){
    var CoordStrLen = coordString.length;
    var res = coordString.slice(9, CoordStrLen -2);
    res = res.replace(/,/g,"");
    res = res.split(" ");
    var coordArray = [];
    for(var i = 0; i < res.length-1; i=i+2){
      var coords = {lat: res[i+1], lng:res[i]};
      coordArray.push(coords);
    }
    return coordArray;
  }
}
