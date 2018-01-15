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

var jsonForDatasets =[];

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

  polyLayer = L.featureGroup().addTo(map);


  map.on(L.Draw.Event.CREATED, function(event) {
    var layer = event.layer;

    drawnItems.addLayer(layer);
  });

  map.on('click', function(e) {
    var coords = {lat: e.latlng.lat, lng:correctCoordinates(e.latlng.lng)};
    console.log(e.target._layers);
    for (var i = 0; i < e.target._layers.length; i++) {
      console.log(e.target._layers[i]);
    }
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

  $('#searchformbybbox_bottomLat').change(function(){
    drawnItems.clearLayers();
    $('#bboxbutton').show();
    $('#deleteDrawing').hide();
    coordsToPolygon();
  });

  $('#searchformbybbox_topLat').change(function(){
  drawnItems.clearLayers();
  $('#bboxbutton').show();
  $('#deleteDrawing').hide();
  coordsToPolygon();
  });

  $('#searchformbybbox_topLong').change(function(){
    drawnItems.clearLayers();
    $('#bboxbutton').show();
    $('#deleteDrawing').hide();
    coordsToPolygon();
  });

  $('#searchformbybbox_bottomLong').change(function(){
      drawnItems.clearLayers();
      $('#bboxbutton').show();
      $('#deleteDrawing').hide();
      coordsToPolygon();
    });
});
