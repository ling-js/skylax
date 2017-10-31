// Global vars;
var map, // Map Object
    layerControl,
    sidebar,
    drawControl,
    editableLayers ;//Layer to draw onto

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
        center: [40.416775, -3.703790], // Madrid
        zoom: 6,
        zoomControl: false
    });
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);
    // Leaflet.draw options

    editableLayers = new L.FeatureGroup();

    var options = {
        position: 'bottomright',
        edit: {
            featureGroup: editableLayers, //REQUIRED!!
            remove: false
        }
    };
    // add controls to map
    drawControl = new L.Control.Draw(options);

    map.addControl(drawControl);
    // add standard OSM tiles as basemap
    layerControl = L.control.layers().addBaseLayer(L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map), 'OpenStreetMap (Tiles)').addTo(map).expand();

    // Set up Sidebar and Startpage
    sidebar = L.control.sidebar('sidebar').addTo(map);
    sidebar.open('home');

}
/**
 * Modified the toolbar in order to only show the rectangle function
 */


L.DrawToolbar.include({
    getModeHandlers: function(map) {
        return [
            {
                enabled: true,
                handler: new L.Draw.Rectangle(map),
                title: 'Create Rectangle'
            }
        ];
    }
});
