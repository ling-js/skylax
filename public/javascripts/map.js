/*

The MIT License (MIT)

Copyright (c) Sat Jan 27 2018 Benjamin Karic, Jens Seifert, Jasper Buß, Eric Thieme-Garmann, Jan Speckamp

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORTOR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
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
    maxZoom: 12,
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
    console.log(coords);
    console.log(polyLayer);
    console.log(Object.keys(polyLayer._layers));
    var polygonkeys = Object.keys(polyLayer._layers);
    for(i = 0 ; i<polygonkeys.length;i++){
        if(polyLayer._layers[polygonkeys[i]]._bounds.contains(coords)){

          console.log(polyLayer._layers[polygonkeys[i]].options);
          openAccordion(polyLayer._layers[polygonkeys[i]]);
        }


    }
    //console.log($('#datasetButton1'));
    //var textWidth = $('#datasetButton1')[0].clientWidth;
    //console.log($('#sidebar')[0].clientWidth);
    //console.log($('#sidebar')[0].offsetWidth);
    //console.log($('#datasetButton1')[0].clientWidth);
    //console.log($('#datasetButton1')[0].offsetWidth);
  });

 map.on('draw:created', function(e) {


    // Each time a feaute is created, it's added to the over arching feature group
    drawnItems.addLayer(e.layer);
    document.getElementById('searchformbybbox_topLat').value = getRectangle(2)[0];
    document.getElementById('searchformbybbox_topLong').value = getRectangle(2)[1];
    document.getElementById('searchformbybbox_bottomLat').value = getRectangle(4)[0];
    document.getElementById('searchformbybbox_bottomLong').value = getRectangle(4)[1];

  polyLayer.on('click',function(e){

    console.log("Working");
  })


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
 * function that outputs correct coordinates
 * @param coord wrong koordinates
 * @returns correct Koordinaten
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
    document.getElementById("searchformbybbox_bottomLat").style.color = "";
    document.getElementById("searchformbybbox_bottomLat").style.border = "";
    document.getElementById("searchformbybbox_bottomLong").style.color = "";
    document.getElementById("searchformbybbox_bottomLong").style.border = "";
    $("#bboxerror").html("");
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
  //coordsToPolygon runs when all fields are filled correctly
  // checks after every change on input fields
  $('#searchformbybbox_bottomLat').change(function(){
    drawnItems.clearLayers();
    $('#bboxbutton').show();
    $('#deleteDrawing').hide();
    if(checkForCorrectCoordinates() == true){
        coordsToPolygon();
    }

  });
  //coordsToPolygon runs when all fields are filled correctly
  // checks after every change on input fields
  $('#searchformbybbox_topLat').change(function(){
  drawnItems.clearLayers();
  $('#bboxbutton').show();
  $('#deleteDrawing').hide();
  if(checkForCorrectCoordinates() == true){
      coordsToPolygon();
  }

  });
  //coordsToPolygon runs when all fields are filled correctly
  // checks after every change on input fields
  $('#searchformbybbox_topLong').change(function(){
    drawnItems.clearLayers();
    $('#bboxbutton').show();
    $('#deleteDrawing').hide();
    if(checkForCorrectCoordinates() == true){
        coordsToPolygon();
    }
  });
  //coordsToPolygon runs when all fields are filled correctly
  // checks after every change on input fields
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
/*lat and long of bottom corner values may not be higher than values of lat and long
of top right corner
*/
function checkForCorrectCoordinates(){
  var wrongVal = false;

  if(searchformbybbox_bottomLat.valueAsNumber < 90 && searchformbybbox_bottomLat.valueAsNumber > -90){
    if(searchformbybbox_topLat.valueAsNumber  < 90 && searchformbybbox_topLat.valueAsNumber > - 90 ){
      if(searchformbybbox_topLong.valueAsNumber  < 180 && searchformbybbox_topLong.valueAsNumber > -180){
        if(searchformbybbox_bottomLong.valueAsNumber  < 180 && searchformbybbox_bottomLong.valueAsNumber > -180){

          wrongVal = true;
        }
      }
    }
  }
  if(document.getElementById('searchformbybbox_topLat').value != '' &&
     document.getElementById('searchformbybbox_bottomLat').value != '' &&
     document.getElementById('searchformbybbox_topLong').value != '' &&
       document.getElementById('searchformbybbox_bottomLong').value != '')
  {
    var gibtesLatkoordinatendreher = false;
    if(searchformbybbox_topLat.valueAsNumber < searchformbybbox_bottomLat.valueAsNumber){
      gibtesLatkoordinatendreher= true;
      document.getElementById("bboxerror").innerHTML = "Hint: Lat of Bottom Corner should be lower Top Corner";
      document.getElementById("bboxerror").style.color = "red";
      document.getElementById("bboxerror").style.display = "block";
      document.getElementById("searchformbybbox_bottomLat").style.color = "red";
      document.getElementById("searchformbybbox_bottomLat").style.border = "1px solid red";
      wrongVal=false;
    }
    else
    {
      $("#bboxerror").html("");
      document.getElementById("searchformbybbox_bottomLat").style.color = "";
      document.getElementById("searchformbybbox_bottomLat").style.border = "";
    }

    if(searchformbybbox_topLong.valueAsNumber < searchformbybbox_bottomLong.valueAsNumber)
    {
      if(gibtesLatkoordinatendreher){
        $("#bboxerror").html( "Hint: Coordinates of Bottom Corner should be lower than Top Corner");
      }
      else
      {
        $("#bboxerror").html("Hint: Long of Bottom Corner should be lower Top Corner")
      }
      document.getElementById("bboxerror").style.color = "red";
      document.getElementById("bboxerror").style.display = "block";
      document.getElementById("searchformbybbox_bottomLong").style.color = "red";
      document.getElementById("searchformbybbox_bottomLong").style.border = "1px solid red";
      wrongVal=false;
    }
    else
    {
      if(!gibtesLatkoordinatendreher)
      {
        $("#bboxerror").html("");
      }
      document.getElementById("searchformbybbox_bottomLong").style.color = "";
      document.getElementById("searchformbybbox_bottomLong").style.border = "";
    }
  return wrongVal;
  }
}


// draws polygon on map after input fields are filled
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
    //polygon.on('click', openAccordion);
    polygon.bindTooltip('<p> Dataset '+(((page-1)*8)+(showNumber+1))+'</p>').addTo(map);
    polygon.addTo(polyLayer);
  }
}

/**
 * Draws an invisible polygon of the displayed dataset
 * makes polygon "clickable"
 * @param resultNum Metadata of the displayed dataset
 * @param radioBtn "true" or "false" for rgb oder grey
 */
function drawInvisPolygon(resultNum, names, bands, radioBtn){
  map.closePopup();
  var coordArray = stringToCoordArray(jsonForDatasets[resultNum-1].FOOTPRINT);
  if(coordArray != null){
    if(radioBtn == "true"){
        names[3] = null;
      }else if(radioBtn == "false"){
        names[0] = null;
        names[1] = null;
        names[2] = null;
      }
    var polygon = L.polygon(coordArray, {fillOpacity:'0', weight:'0', dname: names, bname:bands, number:(resultNum-1)});
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
