// Global vars;
var map, // Map Object
    layerControl,
    sidebar,
    drawControl,
    editableLayers ,//Layer to draw onto
    drawnItems,
    rectangleDrawer;
/**
 * Geosoftware I, SoSe 2017, final
 * @author Jan Speckamp (428367) ,Jens Seifert ,Jasper Buß, Benjamin Karic , Eric Thieme-Garmann
 */

'use strict';

/**
 * Initialises Map Object
 */
function initMap() {
    map = L.map('map', {
        center: [48.748945343432936, 11.733398437500002], // Europe
        zoom: 5,
        zoomControl: false
    });
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);
    // Handler that is used in order to get rid of the draw control
    rectangleDrawer = new L.Draw.Rectangle(map);

    // add standard OSM tiles as basemap
    layerControl = L.control.layers().addBaseLayer(L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map), 'OpenStreetMap (Tiles)').addTo(map).expand();

    //Feature group where drawn items are saved
    drawnItems = L.featureGroup().addTo(map);


    map.on(L.Draw.Event.CREATED, function (event) {
        var layer = event.layer;

        drawnItems.addLayer(layer);
    });

    map.on('click', function(e) {
        console.log(e.latlng);
    } );

    map.on('draw:created', function(e) {


        // Each time a feaute is created, it's added to the over arching feature group
        drawnItems.addLayer(e.layer);
        document.getElementById("searchformbybbox_topleft").value = getRectangle(2)[0];
        document.getElementById("searchformbybbox_topright").value = detectLong(getRectangle(2)[1]);
        document.getElementById("searchformbybbox_bottomleft").value = getRectangle(4)[0];
        document.getElementById("searchformbybbox_bottomright").value = detectLong(getRectangle(4)[1]);

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
function getRectangle(corner){
    var data = drawnItems.toGeoJSON();
    var output = data.features[0].geometry.coordinates[0][corner].reverse();
    console.log(output);
    return output;
}

/**
 * Function that is called whenever the inputs need to be
 * erased from the web page (cache)
 */
function resetInput(){
    document.getElementById("searchformbybbox_topleft").value = "";
    document.getElementById("searchformbybbox_topright").value = "";
    document.getElementById("searchformbybbox_bottomleft").value = "";
    document.getElementById("searchformbybbox_bottomright").value = "";
}

// Click handler for you button to start drawing polygons
$( document ).ready(function() {

    // Hide the delete button until the draw button is clicked once
    $('#deleteDrawing').hide();

    resetInput();

    $('#bboxbutton').click(function () {
        rectangleDrawer.enable();
        $('#bboxbutton').hide();
        $('#deleteDrawing').show();

    });

    $('#deleteDrawing').click(function () {
        resetInput();
        drawnItems.clearLayers();
        $('#bboxbutton').show();
        $('#deleteDrawing').hide();

    });

    $('#searchform').submit(function(e) {
        // Prevent default html form handling
        e.preventDefault();
        var that = this;
        console.log("function gets called properly awaiting ajax...");
        var substring = $("#searchformbyname_input").val();
        var startdate = $("#searchformbydate_input").val();
        var enddate="";
        var page = 0;
        var bbox="";

        var url = "http://gis-bigdata.uni-muenster.de:14014/search?substring="+substring+"&bbox="+bbox+"&startdate="+startdate+"&enddate="+enddate+"&page="+page;
        console.log(url);

        $.ajax({
            type: "GET",
            url: url,
            data:'',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            statusCode: {
                404: function() {
                    console.log("something went wrong(404)");
                }},
            success: function (res) {
                console.dir(res[0]);
            }
        }); //end ajax
    });//end getMetaData()
// submit via ajax
});

